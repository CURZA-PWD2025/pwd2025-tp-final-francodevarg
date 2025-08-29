from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Cargar variables del archivo .env
load_dotenv()

# Importar blueprints
from app.modules.auth.auth_routes import auth_bp
from app.modules.veterinario.veterinario_routes import veterinario_bp
from app.modules.mascota.mascota_routes import mascota_bp
from app.modules.turno.turno_routes import turno_bp

from app.modules.auth.auth_model import blacklist  

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

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in blacklist

    # Registrar rutas
    app.register_blueprint(auth_bp)
    app.register_blueprint(veterinario_bp)
    app.register_blueprint(mascota_bp)
    app.register_blueprint(turno_bp)

    return app
