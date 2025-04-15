from flask import Blueprint, render_template, request, jsonify, send_file
from classificador_riscos import ClassificadorRiscos
import sqlite3
import os
from datetime import datetime
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

main_bp = Blueprint('main', __name__)

# Instanciar o classificador de riscos
classificador = ClassificadorRiscos()

# Funções auxiliares
def get_db_connection():
    """Retorna uma conexão com o banco de dados"""
    DATABASE = 'serralheria.db'
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa o banco de dados com as tabelas necessárias"""
    conn = sqlite3.connect('serralheria.db')
    cursor = conn.cursor()
    
    # Tabela de materiais
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS materiais (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        preco_unitario REAL NOT NULL,
        unidade TEXT NOT NULL,
        fornecedor TEXT,
        ultima_atualizacao TEXT
    )
    ''')
    
    # Tabela de projetos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS projetos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cliente TEXT,
        data_criacao TEXT NOT NULL,
        altura_maxima REAL,
        complexidade TEXT,
        ambiente TEXT,
        nivel_risco TEXT,
        fator_risco REAL,
        descricao TEXT
    )
    ''')
    
    # Tabela de orçamentos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orcamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projeto_id INTEGER,
        data_criacao TEXT NOT NULL,
        valor_materiais REAL NOT NULL,
        valor_mao_obra REAL NOT NULL,
        valor_impostos REAL NOT NULL,
        valor_total REAL NOT NULL,
        margem_lucro REAL NOT NULL,
        FOREIGN KEY (projeto_id) REFERENCES projetos (id)
    )
    ''')
    
    # Tabela de itens de orçamento
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS itens_orcamento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orcamento_id INTEGER,
        material_id INTEGER,
        quantidade REAL NOT NULL,
        valor_unitario REAL NOT NULL,
        valor_total REAL NOT NULL,
        FOREIGN KEY (orcamento_id) REFERENCES orcamentos (id),
        FOREIGN KEY (material_id) REFERENCES materiais (id)
    )
    ''')
    
    # Inserir alguns materiais de exemplo
    materiais = [
        ('Tubo Metalon 20x20', 'Estrutural', 15.50, 'metro', 'SILFER', datetime.now().strftime('%Y-%m-%d')),
        ('Tubo Metalon 30x30', 'Estrutural', 22.75, 'metro', 'SILFER', datetime.now().strftime('%Y-%m-%d')),
        ('Tubo Metalon 40x40', 'Estrutural', 32.90, 'metro', 'SILFER', datetime.now().strftime('%Y-%m-%d')),
        ('Tubo Metalon 50x30', 'Estrutural', 35.40, 'metro', 'KASIFER', datetime.now().strftime('%Y-%m-%d')),
        ('Chapa Galvanizada #18', 'Cobertura', 120.00, 'm²', 'GOLDONI', datetime.now().strftime('%Y-%m-%d')),
        ('Chapa Galvanizada #20', 'Cobertura', 95.00, 'm²', 'GOLDONI', datetime.now().strftime('%Y-%m-%d')),
        ('Telha Trapezoidal', 'Cobertura', 45.00, 'm²', 'KASIFER', datetime.now().strftime('%Y-%m-%d')),
        ('Parafuso Autobrocante', 'Fixação', 0.35, 'unidade', 'SILFER', datetime.now().strftime('%Y-%m-%d')),
        ('Eletrodo 6013', 'Consumível', 25.00, 'kg', 'GOLDONI', datetime.now().strftime('%Y-%m-%d')),
        ('Disco de Corte 7"', 'Consumível', 12.50, 'unidade', 'SILFER', datetime.now().strftime('%Y-%m-%d')),
        ('Tinta Anticorrosiva', 'Acabamento', 85.00, 'litro', 'KASIFER', datetime.now().strftime('%Y-%m-%d'))
    ]
    
    cursor.executemany(
        'INSERT OR IGNORE INTO materiais (nome, tipo, preco_unitario, unidade, fornecedor, ultima_atualizacao) VALUES (?, ?, ?, ?, ?, ?)',
        materiais
    )
    
    conn.commit()
    conn.close()

# Inicializar o banco de dados se não existir
if not os.path.exists('serralheria.db'):
    init_db()

def classificar_risco(projeto):
    """
    Classifica o nível de risco do projeto com base em suas características.
    Utiliza o classificador de IA para análise mais precisa.
    """
    return classificador.classificar(projeto)

def calcular_preco_com_risco(preco_base, nivel_risco):
    """
    Aplica o fator de risco ao preço base.
    """
    return preco_base * nivel_risco['fator_multiplicador']

def calcular_impostos(valor_total):
    """
    Calcula os impostos devidos para um projeto com base no regime ME.
    """
    # Alíquota simplificada do Simples Nacional para serralheria (aproximada)
    aliquota = 6.0  # 6% para serviços de serralheria no Simples Nacional (aproximado)
    
    # Calcular valor do imposto
    valor_imposto = valor_total * (aliquota / 100)
    
    return {
        'regime': "ME - Simples Nacional",
        'aliquota': aliquota,
        'valor': valor_imposto
    }

def gerar_pdf_orcamento(orcamento_data):
    """
    Gera um PDF com o orçamento detalhado.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    subtitle_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Título
    elements.append(Paragraph(f"Orçamento - {orcamento_data['projeto']['nome']}", title_style))
    elements.append(Paragraph(f"Cliente: {orcamento_data['projeto']['cliente']}", subtitle_style))
    elements.append(Paragraph(f"Data: {orcamento_data['data_criacao']}", normal_style))
    elements.append(Paragraph(f"Nível de Risco: {orcamento_data['projeto']['nivel_risco'].upper()}", normal_style))
    elements.append(Paragraph(f"Justificativa: {orcamento_data['projeto']['justificativa']}", normal_style))
    elements.append(Paragraph(" ", normal_style))  # Espaço
    
    # Tabela de materiais
    data = [['Material', 'Quantidade', 'Unidade', 'Valor Unitário', 'Valor Total']]
    
    for item in orcamento_data['itens']:
        data.append([
            item['nome'],
            f"{item['quantidade']:.2f}",
            item['unidade'],
            f"R$ {item['valor_unitario']:.2f}",
            f"R$ {item['valor_total']:.2f}"
        ])
    
    # Adicionar totais
    data.append(['', '', '', 'Subtotal Materiais:', f"R$ {orcamento_data['valor_materiais']:.2f}"])
    data.append(['', '', '', 'Mão de Obra:', f"R$ {orcamento_data['valor_mao_obra']:.2f}"])
    data.append(['', '', '', 'Impostos:', f"R$ {orcamento_data['valor_impostos']:.2f}"])
    data.append(['', '', '', 'TOTAL:', f"R$ {orcamento_data['valor_total']:.2f}"])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, -4), (-1, -1), 'Helvetica-Bold'),
    ]))
    
    elements.append(table)
    
    # Observações
    elements.append(Paragraph(" ", normal_style))  # Espaço
    elements.append(Paragraph("Observações:", subtitle_style))
    elements.append(Paragraph("1. Orçamento válido por 15 dias.", normal_style))
    elements.append(Paragraph("2. Prazo de entrega a combinar após aprovação.", normal_style))
    elements.append(Paragraph("3. Pagamento: 50% na aprovação, 50% na entrega.", normal_style))
    elements.append(Paragraph(f"4. Fator de risco aplicado: {orcamento_data['projeto']['fator_multiplicador']:.2f}x", normal_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

# Rotas
@main_bp.route('/')
def index():
    return render_template('index.html')
