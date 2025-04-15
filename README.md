# IA para Serralheria - Arquivo README

## Descrição
Sistema de análise de projetos, classificação de riscos, estimativa de materiais, cálculo de custos e geração de orçamentos para empresas de serralheria. O sistema utiliza inteligência artificial para classificar o nível de risco dos projetos e ajustar os preços de acordo com fatores como altura, complexidade e ambiente de instalação.

## Funcionalidades Principais
- Análise de projetos com classificação automática de riscos
- Estimativa de materiais necessários
- Cálculo de custos com ajuste baseado em risco
- Geração de orçamentos em PDF
- Otimizador de cortes para perfis de alumínio
- Visualizador de projetos em 2D
- Gestão de clientes e histórico de projetos
- Interface responsiva para acesso em dispositivos móveis

## Tecnologias Utilizadas
- Backend: Python/Flask
- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Banco de Dados: SQLite (desenvolvimento) / PostgreSQL (produção)
- IA: Modelo de classificação baseado em regras e aprendizado de máquina
- Visualização: Canvas HTML5
- Geração de PDF: ReportLab

## Requisitos
- Python 3.10 ou superior
- Dependências listadas em requirements.txt

## Instalação
1. Clone o repositório
2. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
3. Execute o aplicativo:
   ```
   python app.py
   ```

## Estrutura do Projeto
- `app.py`: Aplicativo principal Flask
- `classificador_riscos.py`: Módulo de classificação de riscos com IA
- `templates/`: Arquivos HTML
- `static/`: Arquivos estáticos (CSS, JavaScript, imagens)
  - `static/css/`: Arquivos de estilo
  - `static/js/`: Scripts JavaScript
  - `static/img/`: Imagens

## Módulos JavaScript
- `otimizador_cortes.js`: Algoritmo para otimização de cortes de perfis
- `visualizador_projetos.js`: Visualizador 2D de projetos
- `gestao_clientes.js`: Sistema de gestão de clientes
- `main.js`: Funcionalidades principais da interface

## Implantação
O sistema está configurado para implantação em plataformas como Heroku:
- `Procfile`: Configuração para servidor web Gunicorn
- `runtime.txt`: Especificação da versão do Python
- `requirements.txt`: Dependências necessárias

## Configuração do Banco de Dados
O sistema suporta SQLite para desenvolvimento e PostgreSQL para produção:
- SQLite: Configuração padrão, não requer configuração adicional
- PostgreSQL: Configure a variável de ambiente `DATABASE_URL`

## Uso
1. Acesse a página inicial
2. Preencha os dados do projeto (nome, cliente, dimensões, etc.)
3. Clique em "Analisar Projeto" para obter a análise de risco e estimativa de materiais
4. Visualize o resultado e gere um orçamento em PDF se desejado
5. Utilize as ferramentas adicionais (otimizador de cortes, visualizador) conforme necessário

## Licença
Todos os direitos reservados.

## Contato
Para mais informações, entre em contato com o desenvolvedor.
