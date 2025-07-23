from flask import Flask
from flask_cors import CORS
from .modules.usuario.usuario_routes import usuario_bp

def create_app():
    app = Flask(__name__)
    CORS(app) 
    app.register_blueprint(usuario_bp)

    return app