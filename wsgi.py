import os
from flask import Flask
from config import get_config

def create_app(config_name=None):
    """Função factory para criar a aplicação Flask"""
    app = Flask(__name__)
    
    # Carregar configurações
    config = get_config()
    app.config.from_object(config)
    
    # Garantir que a pasta de uploads exista
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Registrar blueprints (para organização modular)
    from routes.main import main_bp
    from routes.api import api_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Inicializar extensões
    init_extensions(app)
    
    # Registrar manipuladores de erro
    register_error_handlers(app)
    
    return app

def init_extensions(app):
    """Inicializa extensões Flask"""
    # Exemplo: Flask-SQLAlchemy, Flask-Login, etc.
    # Para implementação futura
    pass

def register_error_handlers(app):
    """Registra manipuladores de erro personalizados"""
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404
    
    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500

# Para execução direta
if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
