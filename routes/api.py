from flask import Blueprint, request, jsonify, send_file
from routes.main import get_db_connection, classificar_risco, calcular_preco_com_risco, calcular_impostos, gerar_pdf_orcamento
from datetime import datetime
import sqlite3
import os
from werkzeug.utils import secure_filename
import PyPDF2
from PIL import Image
import re

api_bp = Blueprint('api', __name__)

# Configuração para upload de arquivos
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@api_bp.route('/materiais', methods=['GET'])
def get_materiais():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM materiais')
    materiais = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(materiais)

@api_bp.route('/projetos', methods=['GET', 'POST'])
def projetos():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        
        # Classificar o risco do projeto
        risco = classificar_risco(data)
        
        cursor.execute('''
        INSERT INTO projetos (nome, cliente, data_criacao, altura_maxima, complexidade, ambiente, nivel_risco, fator_risco, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['nome'],
            data.get('cliente', ''),
            datetime.now().strftime('%Y-%m-%d'),
            data.get('altura_maxima', 0),
            data.get('complexidade', 'baixa'),
            data.get('ambiente', 'controlado'),
            risco['nivel_risco'],
            risco['fator_multiplicador'],
            data.get('descricao', '')
        ))
        
        projeto_id = cursor.lastrowid
        conn.commit()
        
        # Buscar o projeto recém-criado
        cursor.execute('SELECT * FROM projetos WHERE id = ?', (projeto_id,))
        projeto = dict(cursor.fetchone())
        projeto['justificativa'] = risco['justificativa']
        
        conn.close()
        return jsonify(projeto), 201
    
    else:  # GET
        cursor.execute('SELECT * FROM projetos')
        projetos = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return jsonify(projetos)

@api_bp.route('/projetos/<int:projeto_id>', methods=['GET'])
def get_projeto(projeto_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM projetos WHERE id = ?', (projeto_id,))
    projeto = cursor.fetchone()
    
    if projeto is None:
        conn.close()
        return jsonify({'error': 'Projeto não encontrado'}), 404
    
    projeto_dict = dict(projeto)
    
    # Adicionar justificativa de risco
    risco = classificar_risco({
        'altura_maxima': projeto_dict['altura_maxima'],
        'complexidade': projeto_dict['complexidade'],
        'ambiente': projeto_dict['ambiente']
    })
    projeto_dict['justificativa'] = risco['justificativa']
    
    conn.close()
    return jsonify(projeto_dict)

@api_bp.route('/analisar-projeto', methods=['POST'])
def analisar_projeto():
    """
    Rota para analisar um projeto sem salvá-lo no banco de dados.
    Retorna a análise de risco e estimativa de materiais.
    """
    data = request.json
    
    # Classificar o risco do projeto
    risco = classificar_risco(data)
    
    # Calcular área se não fornecida
    area = data.get('area', 0)
    if area == 0 and data.get('comprimento', 0) > 0 and data.get('largura', 0) > 0:
        area = data['comprimento'] * data['largura']
    
    # Estimar materiais necessários
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM materiais')
    materiais = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    # Lógica para estimar materiais
    materiais_estimados = []
    valor_materiais = 0
    
    # Estrutura (tubos metalon)
    if area > 0:
        # Metalon 40x40 para estrutura principal
        qtd_metalon_40 = area * 0.8  # 0.8 metros por m²
        valor_metalon_40 = next((m['preco_unitario'] for m in materiais if m['nome'] == 'Tubo Metalon 40x40'), 32.90)
        valor_total_metalon_40 = qtd_metalon_40 * valor_metalon_40
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais if m['nome'] == 'Tubo Metalon 40x40'), 3),
            'nome': 'Tubo Metalon 40x40',
            'quantidade': qtd_metalon_40,
            'unidade': 'metro',
            'valor_unitario': valor_metalon_40,
            'valor_total': valor_total_metalon_40
        })
        valor_materiais += valor_total_metalon_40
        
        # Metalon 20x20 para detalhes
        qtd_metalon_20 = area * 1.2  # 1.2 metros por m²
        valor_metalon_20 = next((m['preco_unitario'] for m in materiais if m['nome'] == 'Tubo Metalon 20x20'), 15.50)
        valor_total_metalon_20 = qtd_metalon_20 * valor_metalon_20
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais if m['nome'] == 'Tubo Metalon 20x20'), 1),
            'nome': 'Tubo Metalon 20x20',
            'quantidade': qtd_metalon_20,
            'unidade': 'metro',
            'valor_unitario': valor_metalon_20,
            'valor_total': valor_total_metalon_20
        })
        valor_materiais += valor_total_metalon_20
        
        # Chapa galvanizada
        qtd_chapa = area * 0.7  # 70% da área total
        valor_chapa = next((m['preco_unitario'] for m in materiais if m['nome'] == 'Chapa Galvanizada #20'), 95.00)
        valor_total_chapa = qtd_chapa * valor_chapa
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais if m['nome'] == 'Chapa Galvanizada #20'), 6),
            'nome': 'Chapa Galvanizada #20',
            'quantidade': qtd_chapa,
            'unidade': 'm²',
            'valor_unitario': valor_chapa,
            'valor_total': valor_total_chapa
        })
        valor_materiais += valor_total_chapa
        
        # Parafusos
        qtd_parafusos = area * 15  # 15 parafusos por m²
        valor_parafuso = next((m['preco_unitario'] for m in materiais if m['nome'] == 'Parafuso Autobrocante'), 0.35)
        valor_total_parafusos = qtd_parafusos * valor_parafuso
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais if m['nome'] == 'Parafuso Autobrocante'), 8),
            'nome': 'Parafuso Autobrocante',
            'quantidade': qtd_parafusos,
            'unidade': 'unidade',
            'valor_unitario': valor_parafuso,
            'valor_total': valor_total_parafusos
        })
        valor_materiais += valor_total_parafusos
        
        # Tinta
        qtd_tinta = area * 0.1  # 0.1 litros por m²
        valor_tinta = next((m['preco_unitario'] for m in materiais if m['nome'] == 'Tinta Anticorrosiva'), 85.00)
        valor_total_tinta = qtd_tinta * valor_tinta
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais if m['nome'] == 'Tinta Anticorrosiva'), 11),
            'nome': 'Tinta Anticorrosiva',
            'quantidade': qtd_tinta,
            'unidade': 'litro',
            'valor_unitario': valor_tinta,
            'valor_total': valor_total_tinta
        })
        valor_materiais += valor_total_tinta
    
    # Calcular valor da mão de obra
    percentual_mao_obra = data.get('custo_mao_obra_percentual', 40) / 100
    valor_mao_obra = valor_materiais * percentual_mao_obra
    
    # Aplicar fator de risco
    subtotal = valor_materiais + valor_mao_obra
    valor_com_risco = calcular_preco_com_risco(subtotal, risco)
    
    # Calcular impostos
    impostos = calcular_impostos(valor_com_risco)
    valor_impostos = impostos['valor']
    
    # Calcular valor total com margem de lucro
    margem_lucro = data.get('margem_lucro', 30)
    valor_custo = valor_com_risco + valor_impostos
    valor_lucro = valor_custo * (margem_lucro / 100)
    valor_total = valor_custo + valor_lucro
    
    # Preparar resposta
    resultado = {
        'projeto': {
            'nome': data['nome'],
            'cliente': data.get('cliente', ''),
            'altura_maxima': data.get('altura_maxima', 0),
            'complexidade': data.get('complexidade', 'baixa'),
            'ambiente': data.get('ambiente', 'controlado'),
            'comprimento': data.get('comprimento', 0),
            'largura': data.get('largura', 0),
            'area': area,
            'nivel_risco': risco['nivel_risco'],
            'fator_multiplicador': risco['fator_multiplicador'],
            'justificativa': risco['justificativa']
        },
        'materiais_estimados': materiais_estimados,
        'valor_materiais': valor_materiais,
        'valor_mao_obra': valor_mao_obra,
        'subtotal': subtotal,
        'valor_com_risco': valor_com_risco,
        'valor_impostos': valor_impostos,
        'margem_lucro': margem_lucro,
        'valor_lucro': valor_lucro,
        'valor_total': valor_total
    }
    
    return jsonify(resultado)

@api_bp.route('/orcamentos', methods=['POST'])
def criar_orcamento():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    data = request.json
    projeto_id = data['projeto_id']
    itens = data['itens']
    margem_lucro = data.get('margem_lucro', 30.0)  # Margem de lucro padrão de 30%
    
    # Buscar informações do projeto
    cursor.execute('SELECT * FROM projetos WHERE id = ?', (projeto_id,))
    projeto = cursor.fetchone()
    
    if not projeto:
        conn.close()
        return jsonify({'error': 'Projeto não encontrado'}), 404
    
    projeto = dict(projeto)
    
    # Calcular valor total dos materiais
    valor_materiais = 0
    for item in itens:
        material_id = item['material_id']
        quantidade = item['quantidade']
        
        # Buscar preço do material
        cursor.execute('SELECT * FROM materiais WHERE id = ?', (material_id,))
        material = cursor.fetchone()
        
        if not material:
            conn.close()
            return jsonify({'error': f'Material com ID {material_id} não encontrado'}), 404
        
        material = dict(material)
        valor_unitario = material['preco_unitario']
        valor_total_item = valor_unitario * quantidade
        
        valor_materiais += valor_total_item
        
        # Adicionar informações do material ao item
        item['nome'] = material['nome']
        item['valor_unitario'] = valor_unitario
        item['valor_total'] = valor_total_item
        item['unidade'] = material['unidade']
    
    # Calcular valor da mão de obra
    valor_mao_obra = valor_materiais * 0.4  # 40% do valor dos materiais
    
    # Aplicar fator de risco
    valor_base = valor_materiais + valor_mao_obra
    valor_com_risco = calcular_preco_com_risco(valor_base, {
        'fator_multiplicador': projeto['fator_risco']
    })
    
    # Calcular impostos
    impostos = calcular_impostos(valor_com_risco)
    valor_impostos = impostos['valor']
    
    # Calcular valor total com margem de lucro
    valor_custo = valor_com_risco + valor_impostos
    valor_total = valor_custo * (1 + (margem_lucro / 100))
    
    # Inserir orçamento no banco de dados
    cursor.execute('''
    INSERT INTO orcamentos (projeto_id, data_criacao, valor_materiais, valor_mao_obra, valor_impostos, valor_total, margem_lucro)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        projeto_id,
        datetime.now().strftime('%Y-%m-%d'),
        valor_materiais,
        valor_mao_obra,
        valor_impostos,
        valor_total,
        margem_lucro
    ))
    
    orcamento_id = cursor.lastrowid
    
    # Inserir itens do orçamento
    for item in itens:
        cursor.execute('''
        INSERT INTO itens_orcamento (orcamento_id, material_id, quantidade, valor_unitario, valor_total)
        VALUES (?, ?, ?, ?, ?)
        ''', (
            orcamento_id,
            item['material_id'],
            item['quantidade'],
            item['valor_unitario'],
            item['valor_total']
        ))
    
    conn.commit()
    
    # Buscar o orçamento recém-criado
    cursor.execute('SELECT * FROM orcamentos WHERE id = ?', (orcamento_id,))
    orcamento = dict(cursor.fetchone())
    
    # Adicionar informações do projeto e itens ao orçamento
    orcamento['projeto'] = projeto
    orcamento['projeto']['justificativa'] = classificar_risco({
        'altura_maxima': projeto['altura_maxima'],
        'complexidade': projeto['complexidade'],
        'ambiente': projeto['ambiente']
    })['justificativa']
    orcamento['itens'] = itens
    
    conn.close()
    return jsonify(orcamento)

@api_bp.route('/orcamentos/<int:orcamento_id>/pdf', methods=['GET'])
def get_orcamento_pdf(orcamento_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Buscar informações do orçamento
    cursor.execute('SELECT * FROM orcamentos WHERE id = ?', (orcamento_id,))
    orcamento = cursor.fetchone()
    
    if not orcamento:
        conn.close()
        return jsonify({'error': 'Orçamento não encontrado'}), 404
    
    orcamento = dict(orcamento)
    
    # Buscar informações do projeto
    cursor.execute('SELECT * FROM projetos WHERE id = ?', (orcamento['projeto_id'],))
    projeto = cursor.fetchone()
    
    if not projeto:
        conn.close()
        return jsonify({'error': 'Projeto não encontrado'}), 404
    
    projeto = dict(projeto)
    
    # Adicionar justificativa de risco
    projeto['justificativa'] = classificar_risco({
        'altura_maxima': projeto['altura_maxima'],
        'complexidade': projeto['complexidade'],
        'ambiente': projeto['ambiente']
    })['justificativa']
    
    # Buscar itens do orçamento
    cursor.execute('SELECT * FROM itens_orcamento WHERE orcamento_id = ?', (orcamento_id,))
    itens_orcamento = [dict(row) for row in cursor.fetchall()]
    
    # Buscar informações dos materiais
    itens = []
    for item in itens_orcamento:
        cursor.execute('SELECT * FROM materiais WHERE id = ?', (item['material_id'],))
        material = cursor.fetchone()
        
        if material:
            material = dict(material)
            item['nome'] = material['nome']
            item['unidade'] = material['unidade']
            itens.append(item)
    
    conn.close()
    
    # Preparar dados para o PDF
    orcamento_data = {
        'id': orcamento['id'],
        'data_criacao': orcamento['data_criacao'],
        'valor_materiais': orcamento['valor_materiais'],
        'valor_mao_obra': orcamento['valor_mao_obra'],
        'valor_impostos': orcamento['valor_impostos'],
        'valor_total': orcamento['valor_total'],
        'margem_lucro': orcamento['margem_lucro'],
        'projeto': projeto,
        'itens': itens
    }
    
    # Gerar PDF
    pdf_buffer = gerar_pdf_orcamento(orcamento_data)
    
    # Retornar o PDF
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'orcamento_{orcamento_id}.pdf'
    )

@api_bp.route('/analisar-documento', methods=['POST'])
def analisar_documento():
    """
    Rota para analisar documentos técnicos (PDFs e imagens)
    Extrai informações como dimensões, elementos estruturais e materiais
    """
    # Verificar se o arquivo foi enviado
    if 'arquivo' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    arquivo = request.files['arquivo']
    
    # Verificar se o nome do arquivo está vazio
    if arquivo.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400
    
    # Verificar se o arquivo é permitido
    if not allowed_file(arquivo.filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    # Salvar o arquivo temporariamente
    filename = secure_filename(arquivo.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    # Criar diretório de uploads se não existir
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    arquivo.save(filepath)
    
    try:
        # Processar o arquivo de acordo com seu tipo
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        if file_extension == 'pdf':
            resultados = processar_pdf(filepath)
        else:  # Imagem
            resultados = processar_imagem(filepath)
        
        # Adicionar estimativa de materiais
        resultados = estimar_materiais_do_documento(resultados)
        
        # Remover o arquivo temporário
        os.remove(filepath)
        
        return jsonify(resultados)
    
    except Exception as e:
        # Remover o arquivo temporário em caso de erro
        if os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({'error': str(e)}), 500

def allowed_file(filename):
    """Verifica se o arquivo tem uma extensão permitida"""
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'tif', 'tiff', 'bmp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def processar_pdf(filepath):
    """Processa um arquivo PDF para extrair informações relevantes"""
    resultados = {
        'dimensoes': {},
        'elementos': [],
        'materiais': [],
        'area': 0,
        'perimetro': 0
    }
    
    try:
        # Abrir o PDF
        with open(filepath, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            
            # Extrair texto de todas as páginas
            texto_completo = ""
            for page in reader.pages:
                texto_completo += page.extract_text()
            
            # Extrair dimensões usando expressões regulares
            dimensoes = extrair_dimensoes(texto_completo)
            resultados['dimensoes'] = dimensoes
            
            # Calcular área e perímetro se possível
            if 'comprimento' in dimensoes and 'largura' in dimensoes:
                resultados['area'] = dimensoes['comprimento'] * dimensoes['largura']
                resultados['perimetro'] = 2 * (dimensoes['comprimento'] + dimensoes['largura'])
            
            # Identificar elementos estruturais
            resultados['elementos'] = identificar_elementos(texto_completo)
            
            # Identificar materiais mencionados
            resultados['materiais'] = identificar_materiais(texto_completo)
            
            return resultados
    
    except Exception as e:
        raise Exception(f"Erro ao processar PDF: {str(e)}")

def processar_imagem(filepath):
    """Processa uma imagem para extrair informações relevantes"""
    resultados = {
        'dimensoes': {},
        'elementos': [],
        'materiais': [],
        'area': 0,
        'perimetro': 0
    }
    
    try:
        # Abrir a imagem
        imagem = Image.open(filepath)
        
        # Extrair dimensões da imagem (estimativa baseada no tamanho)
        largura_px, altura_px = imagem.size
        
        # Estimativa simples: assumindo que 100px = 1m (apenas para demonstração)
        escala = 100  # pixels por metro
        
        # Estimar dimensões reais
        largura_m = largura_px / escala
        altura_m = altura_px / escala
        
        resultados['dimensoes'] = {
            'comprimento': largura_m,
            'largura': altura_m,
            'altura': 2.8  # Altura padrão estimada
        }
        
        # Calcular área e perímetro
        resultados['area'] = largura_m * altura_m
        resultados['perimetro'] = 2 * (largura_m + altura_m)
        
        # Para uma análise mais precisa, seria necessário usar algoritmos de visão computacional
        # Aqui estamos usando estimativas simplificadas
        
        # Estimar elementos estruturais com base no tamanho
        area = resultados['area']
        if area > 0:
            # Estimar número de pilares (1 a cada 3m²)
            num_pilares = max(4, int(area / 3))
            resultados['elementos'].append({
                'tipo': 'pilar',
                'quantidade': num_pilares,
                'dimensoes': '40x40'
            })
            
            # Estimar comprimento de metalon para estrutura
            comprimento_metalon = area * 2  # 2m por m²
            resultados['elementos'].append({
                'tipo': 'metalon',
                'quantidade': int(comprimento_metalon),
                'dimensoes': '40x40'
            })
            
            # Estimar comprimento de metalon para detalhes
            comprimento_metalon_detalhes = area * 3  # 3m por m²
            resultados['elementos'].append({
                'tipo': 'metalon',
                'quantidade': int(comprimento_metalon_detalhes),
                'dimensoes': '20x20'
            })
            
            # Estimar área de chapas
            area_chapas = area * 0.7  # 70% da área total
            resultados['elementos'].append({
                'tipo': 'chapa',
                'quantidade': int(area_chapas),
                'dimensoes': '1000x2000'
            })
        
        return resultados
    
    except Exception as e:
        raise Exception(f"Erro ao processar imagem: {str(e)}")

def extrair_dimensoes(texto):
    """Extrai dimensões de um texto usando expressões regulares"""
    dimensoes = {}
    
    # Padrões para buscar dimensões
    padroes = {
        'comprimento': r'comprimento[:\s]*(\d+[.,]?\d*)[\s]*m',
        'largura': r'largura[:\s]*(\d+[.,]?\d*)[\s]*m',
        'altura': r'altura[:\s]*(\d+[.,]?\d*)[\s]*m',
        'profundidade': r'profundidade[:\s]*(\d+[.,]?\d*)[\s]*m'
    }
    
    # Padrões alternativos
    padroes_alt = {
        'comprimento': [r'(\d+[.,]?\d*)[\s]*m[\s]*[x×]', r'c\s*=\s*(\d+[.,]?\d*)[\s]*m'],
        'largura': [r'[x×][\s]*(\d+[.,]?\d*)[\s]*m', r'l\s*=\s*(\d+[.,]?\d*)[\s]*m'],
        'altura': [r'h\s*=\s*(\d+[.,]?\d*)[\s]*m', r'alt[:\s]*(\d+[.,]?\d*)[\s]*m']
    }
    
    # Buscar dimensões usando os padrões principais
    for dim, padrao in padroes.items():
        match = re.search(padrao, texto, re.IGNORECASE)
        if match:
            valor = match.group(1).replace(',', '.')
            dimensoes[dim] = float(valor)
    
    # Se não encontrou com os padrões principais, tentar padrões alternativos
    for dim, padroes_lista in padroes_alt.items():
        if dim not in dimensoes:
            for padrao in padroes_lista:
                match = re.search(padrao, texto, re.IGNORECASE)
                if match:
                    valor = match.group(1).replace(',', '.')
                    dimensoes[dim] = float(valor)
                    break
    
    # Se ainda não encontrou comprimento e largura, buscar por padrão "LxC"
    if 'comprimento' not in dimensoes or 'largura' not in dimensoes:
        match = re.search(r'(\d+[.,]?\d*)[\s]*[x×][\s]*(\d+[.,]?\d*)', texto)
        if match:
            largura = float(match.group(1).replace(',', '.'))
            comprimento = float(match.group(2).replace(',', '.'))
            dimensoes['largura'] = largura
            dimensoes['comprimento'] = comprimento
    
    # Valores padrão se não encontrar
    if 'comprimento' not in dimensoes:
        dimensoes['comprimento'] = 5.0  # valor padrão
    if 'largura' not in dimensoes:
        dimensoes['largura'] = 3.0  # valor padrão
    if 'altura' not in dimensoes:
        dimensoes['altura'] = 2.8  # valor padrão
    
    return dimensoes

def identificar_elementos(texto):
    """Identifica elementos estruturais mencionados no texto"""
    elementos = []
    
    # Dicionário de elementos a procurar e seus padrões
    elementos_dict = {
        'viga': r'viga[s]?',
        'coluna': r'coluna[s]?',
        'pilar': r'pilar(es)?',
        'treliça': r'treliça[s]?',
        'perfil': r'perfil(is)?',
        'metalon': r'metalon',
        'chapa': r'chapa[s]?',
        'telha': r'telha[s]?',
        'grade': r'grade[s]?',
        'tela': r'tela[s]?',
        'vidro': r'vidro[s]?'
    }
    
    # Buscar elementos no texto
    for elemento, padrao in elementos_dict.items():
        matches = re.finditer(padrao, texto, re.IGNORECASE)
        for match in matches:
            # Buscar quantidade próxima
            contexto = texto[max(0, match.start() - 50):min(len(texto), match.end() + 50)]
            qtd_match = re.search(r'(\d+)[\s]*' + padrao, contexto, re.IGNORECASE)
            
            quantidade = 1
            if qtd_match:
                quantidade = int(qtd_match.group(1))
            
            # Buscar dimensões próximas
            dim_match = re.search(r'(\d+)[x×](\d+)', contexto)
            dimensoes = ""
            if dim_match:
                dimensoes = f"{dim_match.group(1)}x{dim_match.group(2)}"
            
            # Verificar se este elemento já foi adicionado
            elemento_existente = next((e for e in elementos if e['tipo'] == elemento), None)
            
            if elemento_existente:
                elemento_existente['quantidade'] += quantidade
            else:
                elementos.append({
                    'tipo': elemento,
                    'quantidade': quantidade,
                    'dimensoes': dimensoes
                })
    
    # Se não encontrou elementos, estimar com base na área
    if not elementos and 'area' in locals():
        area = locals()['area']
        if area > 0:
            # Estimar número de pilares (1 a cada 3m²)
            num_pilares = max(4, int(area / 3))
            elementos.append({
                'tipo': 'pilar',
                'quantidade': num_pilares,
                'dimensoes': '40x40'
            })
            
            # Estimar comprimento de metalon para estrutura
            comprimento_metalon = area * 2  # 2m por m²
            elementos.append({
                'tipo': 'metalon',
                'quantidade': int(comprimento_metalon),
                'dimensoes': '40x40'
            })
            
            # Estimar comprimento de metalon para detalhes
            comprimento_metalon_detalhes = area * 3  # 3m por m²
            elementos.append({
                'tipo': 'metalon',
                'quantidade': int(comprimento_metalon_detalhes),
                'dimensoes': '20x20'
            })
    
    return elementos

def identificar_materiais(texto):
    """Identifica materiais mencionados no texto"""
    materiais = []
    
    # Lista de materiais comuns em serralheria
    materiais_dict = {
        'Tubo Metalon 20x20': r'metalon[\s]*20[\s]*x[\s]*20',
        'Tubo Metalon 30x30': r'metalon[\s]*30[\s]*x[\s]*30',
        'Tubo Metalon 40x40': r'metalon[\s]*40[\s]*x[\s]*40',
        'Tubo Metalon 50x30': r'metalon[\s]*50[\s]*x[\s]*30',
        'Chapa Galvanizada #18': r'chapa[\s]*galvanizada[\s]*#?18',
        'Chapa Galvanizada #20': r'chapa[\s]*galvanizada[\s]*#?20',
        'Telha Trapezoidal': r'telha[\s]*trapezoidal',
        'Parafuso Autobrocante': r'parafuso[\s]*autobrocante',
        'Eletrodo 6013': r'eletrodo[\s]*6013',
        'Disco de Corte': r'disco[\s]*de[\s]*corte',
        'Tinta Anticorrosiva': r'tinta[\s]*anticorrosiva'
    }
    
    # Buscar materiais no texto
    for material, padrao in materiais_dict.items():
        if re.search(padrao, texto, re.IGNORECASE):
            materiais.append(material)
    
    return materiais

def estimar_materiais_do_documento(resultados):
    """Estima materiais necessários com base nos resultados da análise do documento"""
    # Obter materiais do banco de dados
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM materiais')
    materiais_db = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    # Inicializar lista de materiais estimados
    materiais_estimados = []
    valor_materiais = 0
    
    # Calcular área
    area = resultados['area']
    
    if area > 0:
        # Metalon 40x40 para estrutura principal
        qtd_metalon_40 = area * 0.8  # 0.8 metros por m²
        valor_metalon_40 = next((m['preco_unitario'] for m in materiais_db if m['nome'] == 'Tubo Metalon 40x40'), 32.90)
        valor_total_metalon_40 = qtd_metalon_40 * valor_metalon_40
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais_db if m['nome'] == 'Tubo Metalon 40x40'), 3),
            'nome': 'Tubo Metalon 40x40',
            'quantidade': qtd_metalon_40,
            'unidade': 'metro',
            'valor_unitario': valor_metalon_40,
            'valor_total': valor_total_metalon_40
        })
        valor_materiais += valor_total_metalon_40
        
        # Metalon 20x20 para detalhes
        qtd_metalon_20 = area * 1.2  # 1.2 metros por m²
        valor_metalon_20 = next((m['preco_unitario'] for m in materiais_db if m['nome'] == 'Tubo Metalon 20x20'), 15.50)
        valor_total_metalon_20 = qtd_metalon_20 * valor_metalon_20
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais_db if m['nome'] == 'Tubo Metalon 20x20'), 1),
            'nome': 'Tubo Metalon 20x20',
            'quantidade': qtd_metalon_20,
            'unidade': 'metro',
            'valor_unitario': valor_metalon_20,
            'valor_total': valor_total_metalon_20
        })
        valor_materiais += valor_total_metalon_20
        
        # Chapa galvanizada
        qtd_chapa = area * 0.7  # 70% da área total
        valor_chapa = next((m['preco_unitario'] for m in materiais_db if m['nome'] == 'Chapa Galvanizada #20'), 95.00)
        valor_total_chapa = qtd_chapa * valor_chapa
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais_db if m['nome'] == 'Chapa Galvanizada #20'), 6),
            'nome': 'Chapa Galvanizada #20',
            'quantidade': qtd_chapa,
            'unidade': 'm²',
            'valor_unitario': valor_chapa,
            'valor_total': valor_total_chapa
        })
        valor_materiais += valor_total_chapa
        
        # Parafusos
        qtd_parafusos = area * 15  # 15 parafusos por m²
        valor_parafuso = next((m['preco_unitario'] for m in materiais_db if m['nome'] == 'Parafuso Autobrocante'), 0.35)
        valor_total_parafusos = qtd_parafusos * valor_parafuso
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais_db if m['nome'] == 'Parafuso Autobrocante'), 8),
            'nome': 'Parafuso Autobrocante',
            'quantidade': qtd_parafusos,
            'unidade': 'unidade',
            'valor_unitario': valor_parafuso,
            'valor_total': valor_total_parafusos
        })
        valor_materiais += valor_total_parafusos
        
        # Tinta
        qtd_tinta = area * 0.1  # 0.1 litros por m²
        valor_tinta = next((m['preco_unitario'] for m in materiais_db if m['nome'] == 'Tinta Anticorrosiva'), 85.00)
        valor_total_tinta = qtd_tinta * valor_tinta
        materiais_estimados.append({
            'material_id': next((m['id'] for m in materiais_db if m['nome'] == 'Tinta Anticorrosiva'), 11),
            'nome': 'Tinta Anticorrosiva',
            'quantidade': qtd_tinta,
            'unidade': 'litro',
            'valor_unitario': valor_tinta,
            'valor_total': valor_total_tinta
        })
        valor_materiais += valor_total_tinta
    
    # Adicionar estimativas ao resultado
    resultados['materiais_estimados'] = materiais_estimados
    resultados['valor_materiais'] = valor_materiais
    
    # Calcular valor da mão de obra (40% do valor dos materiais)
    resultados['valor_mao_obra'] = valor_materiais * 0.4
    
    # Calcular valor total
    resultados['valor_total'] = valor_materiais + resultados['valor_mao_obra']
    
    return resultados
