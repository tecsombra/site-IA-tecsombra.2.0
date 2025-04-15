from flask import Blueprint, request, jsonify
from routes.main import get_db_connection, classificar_risco, calcular_preco_com_risco, calcular_impostos, gerar_pdf_orcamento
from datetime import datetime
import sqlite3

api_bp = Blueprint('api', __name__)

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
