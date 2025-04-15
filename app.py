from flask import Flask, render_template
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente
load_dotenv()

def create_app():
    """Função factory para criar a aplicação Flask"""
    app = Flask(__name__)
    
    # Configuração básica
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'chave-secreta-padrao-para-desenvolvimento')
    app.config['DEBUG'] = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    # Configuração do banco de dados
    app.config['DATABASE'] = os.environ.get('DATABASE_URL', 'serralheria.db')
    
    # Registrar blueprints
    from routes.main import main_bp
    from routes.api import api_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Manipuladores de erro
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404
    
    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500
    
    return app

# Aplicação principal
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
