from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Cargar variables del archivo .env
load_dotenv()

# Importar blueprints
from app.modules.usuario.usuario_routes import usuario_bp
from app.modules.auth.auth_routes import auth_bp

# Instanciar JWT globalmente
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configuración desde variables de entorno
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "clavepor_defecto")
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600"))

    # Inicializar extensiones
    CORS(app)
    jwt.init_app(app)

    # Registrar rutas
    app.register_blueprint(usuario_bp)
    app.register_blueprint(auth_bp)

    return app