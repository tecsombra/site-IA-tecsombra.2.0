import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env se existir
load_dotenv()

class Config:
    """Configurações base para o aplicativo"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'chave-secreta-padrao-para-desenvolvimento')
    DEBUG = False
    TESTING = False
    
    # Configuração do banco de dados
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///serralheria.db')
    
    # Se estiver usando PostgreSQL em produção, adaptar a string de conexão
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    # Configurações de upload de arquivos
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB limite para uploads
    
    # Configurações de e-mail (para futuras implementações)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = os.environ.get('MAIL_PORT')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'false').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')

class DevelopmentConfig(Config):
    """Configurações para ambiente de desenvolvimento"""
    DEBUG = True
    
    # Usar SQLite para desenvolvimento
    DATABASE_URL = 'sqlite:///serralheria.db'

class TestingConfig(Config):
    """Configurações para ambiente de testes"""
    TESTING = True
    DEBUG = True
    
    # Usar banco de dados em memória para testes
    DATABASE_URL = 'sqlite:///:memory:'

class ProductionConfig(Config):
    """Configurações para ambiente de produção"""
    # A SECRET_KEY deve ser definida como variável de ambiente em produção
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Configurações específicas de produção
    SERVER_NAME = os.environ.get('SERVER_NAME')
    
    # Configurações de segurança
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

# Dicionário de configurações disponíveis
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    
    # Configuração padrão
    'default': DevelopmentConfig
}

def get_config():
    """Retorna a configuração apropriada com base no ambiente"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])
