import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from datetime import date, timedelta, datetime

# Cargar variables del archivo .env
load_dotenv()

DB_NAME = os.getenv("DB_NAME")

DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'port': int(os.getenv("DB_PORT")),
    'raise_on_warnings': True,
}

TABLES = {}
SEEDS = {}

# Tabla: usuarios
TABLES['usuarios'] = (
    "CREATE TABLE usuarios ("
    "  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,"
    "  nombre VARCHAR(100) NOT NULL,"
    "  email VARCHAR(120) UNIQUE NOT NULL,"
    "  password VARCHAR(255) NOT NULL,"
    "  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('admin', 'cliente'))"
    ")"
)

# Tabla: veterinarios
TABLES['veterinarios'] = (
    "CREATE TABLE veterinarios ("
    "  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,"
    "  nombre VARCHAR(100) NOT NULL,"
    "  especialidad VARCHAR(100),"
    "  email VARCHAR(120) UNIQUE NOT NULL,"
    "  telefono VARCHAR(20)"
    ")"
)

# Tabla: horarios laborales
TABLES['horarios_laborales'] = (
    "CREATE TABLE horarios_laborales ("
    "  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,"
    "  veterinario_id INT UNSIGNED NOT NULL,"
    "  dia_semana VARCHAR(10) NOT NULL,"
    "  hora TIME NOT NULL,"
    "  FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE"
    ")"
)

# Tabla: mascotas
TABLES['mascotas'] = (
    "CREATE TABLE mascotas ("
    "  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,"
    "  nombre VARCHAR(100) NOT NULL,"
    "  especie VARCHAR(50),"
    "  raza VARCHAR(100),"
    "  edad INT,"
    "  usuario_id INT UNSIGNED NOT NULL,"
    "  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE"
    ")"
)

# Tabla: turnos
TABLES['turnos'] = (
    "CREATE TABLE turnos ("
    "  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,"
    "  fecha DATE NOT NULL,"
    "  hora TIME NOT NULL,"
    "  estado VARCHAR(20) DEFAULT 'pendiente',"
    "  motivo VARCHAR(120),"
    "  mascota_id INT UNSIGNED NOT NULL,"
    "  veterinario_id INT UNSIGNED NOT NULL,"
    "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
    "  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,"
    "  FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE"
    ")"
)

# --- Datos dinámicos ---
today = date.today()
yesterday = today - timedelta(days=1)
tomorrow = today + timedelta(days=1)
next_week = today + timedelta(days=7)

# Password común: "1234" (scrypt hash)
COMMON_PASS = 'scrypt:32768:8:1$gY8UgPUBiSA7Im13$8421f9a50bf14c10c82fc63afd91d12d0016edfe349b40854da240323f05689b2e22614074f69139eaf4ccd3b49b44fc82289d48b6970402b4af45d037c14cb2'

# Datos semilla
SEEDS['usuarios'] = (
    "INSERT INTO usuarios (nombre, email, password, tipo) VALUES (%s, %s, %s, %s)",
    [
        # Admins
        ('Admin Uno', 'admin1@vet.com', COMMON_PASS, 'admin'),
        ('Admin Dos', 'admin2@vet.com', COMMON_PASS, 'admin'),
        # Clientes
        ('Carlos Cliente', 'carlos@cliente.com', COMMON_PASS, 'cliente'), # ID 3
        ('Maria Gomez', 'maria@cliente.com', COMMON_PASS, 'cliente'),   # ID 4
        ('Pedro Perez', 'pedro@cliente.com', COMMON_PASS, 'cliente'),   # ID 5
        ('Lucia Diaz', 'lucia@cliente.com', COMMON_PASS, 'cliente')     # ID 6
    ]
)

SEEDS['veterinarios'] = (
    "INSERT INTO veterinarios (nombre, especialidad, email, telefono) VALUES (%s, %s, %s, %s)",
    [
        ('Dra. Ana Vet', 'Clínica General', 'ana@vet.com', '1122334455'),
        ('Dr. Luis Vet', 'Cirugía', 'luis@vet.com', '2233445566'),
        ('Dr. Jorge Mart', 'Clínica General', 'jorge@vet.com', '3344556677'),
        ('Dra. Sofia Ciru', 'Cirugía', 'sofia@vet.com', '4455667788')
    ]
)

SEEDS['horarios_laborales'] = (
    "INSERT INTO horarios_laborales (veterinario_id, dia_semana, hora) VALUES (%s, %s, %s)",
    [
        # Ana (1) - Lunes y Miércoles (09:00 - 13:00)
        (1, 'Lunes', '09:00'), (1, 'Lunes', '10:00'), (1, 'Lunes', '11:00'), (1, 'Lunes', '12:00'), (1, 'Lunes', '13:00'),
        (1, 'Miércoles', '09:00'), (1, 'Miércoles', '10:00'), (1, 'Miércoles', '11:00'), (1, 'Miércoles', '12:00'), (1, 'Miércoles', '13:00'),
        
        # Luis (2) - Martes y Jueves (14:00 - 18:00)
        (2, 'Martes', '14:00'), (2, 'Martes', '15:00'), (2, 'Martes', '16:00'), (2, 'Martes', '17:00'), (2, 'Martes', '18:00'),
        (2, 'Jueves', '14:00'), (2, 'Jueves', '15:00'), (2, 'Jueves', '16:00'), (2, 'Jueves', '17:00'), (2, 'Jueves', '18:00'),

        # Jorge (3) - Viernes (09:00 - 13:00)
        (3, 'Viernes', '09:00'), (3, 'Viernes', '10:00'), (3, 'Viernes', '11:00'), (3, 'Viernes', '12:00'), (3, 'Viernes', '13:00'),

        # Sofia (4) - Lunes y Viernes (16:00 - 20:00)
        (4, 'Lunes', '16:00'), (4, 'Lunes', '17:00'), (4, 'Lunes', '18:00'), (4, 'Lunes', '19:00'),
        (4, 'Viernes', '16:00'), (4, 'Viernes', '17:00'), (4, 'Viernes', '18:00'), (4, 'Viernes', '19:00')
    ]
)

SEEDS['mascotas'] = (
    "INSERT INTO mascotas (nombre, especie, raza, edad, usuario_id) VALUES (%s, %s, %s, %s, %s)",
    [
        # Carlos (3)
        ('Firulais', 'Perro', 'Labrador', 3, 3),
        ('Mishi', 'Gato', 'Siames', 2, 3),
        # Maria (4)
        ('Luna', 'Perro', 'Golden Retriever', 5, 4),
        # Pedro (5)
        ('Rocky', 'Perro', 'Bulldog', 1, 5),
        ('Simba', 'Gato', 'Persa', 4, 5),
        # Lucia (6)
        ('Nala', 'Gato', 'Común Europeo', 2, 6)
    ]
)

SEEDS['turnos'] = (
    "INSERT INTO turnos (fecha, hora, estado, motivo, mascota_id, veterinario_id) VALUES (%s, %s, %s, %s, %s, %s)",
    [
        # Pasados (Ayer)
        (yesterday, '09:00', 'Completado', 'Vacunación', 1, 1),
        (yesterday, '10:00', 'Cancelado', 'Consulta general', 2, 2),
        
        # Hoy
        (today, '09:00', 'Confirmado', 'Revisión oreja', 3, 1),
        (today, '14:00', 'Pendiente', 'Consulta digestiva', 4, 1),
        
        # Mañana
        (tomorrow, '09:00', 'Pendiente', 'Corte de uñas', 5, 3),
        (tomorrow, '11:00', 'Confirmado', 'Castración', 6, 4),
        
        # Futuro
        (next_week, '16:00', 'Pendiente', 'Control post-operatorio', 1, 4)
    ]
)

# Funciones
def create_database(cursor):
    try:
        # Reset DB logic
        cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")
        print(f"♻️  Base de datos '{DB_NAME}' eliminada (reset).")
        
        cursor.execute(f"CREATE DATABASE {DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'")
        print(f"✅ Base de datos '{DB_NAME}' creada.")
    except Error as err:
        print(f"❌ Error creando base de datos: {err}")

def create_tables(tables, cursor):
    for table_name in tables:
        table_description = tables[table_name]
        try:
            print(f"🔧 Creando tabla {table_name}: ", end="")
            cursor.execute(table_description)
        except Error as err:
            print(f"❌ {err.msg}")
        else:
            print("✅ OK")

def seeds_tables(seed, cursor):
    for table_name in seed:
        seed_description = seed[table_name]
        try:
            print(f"🌱 Insertando datos en {table_name}: ", end="")
            cursor.executemany(seed_description[0], seed_description[1])
        except Error as err:
            print(f"❌ {err.msg}")
        else:
            print("✅ OK")

# Ejecutar
if __name__ == "__main__":
    try:
        cxn = mysql.connector.connect(**DB_CONFIG)
        cursor = cxn.cursor()
        
        create_database(cursor)
        
        cursor.execute(f"USE {DB_NAME}")
        create_tables(TABLES, cursor)
        seeds_tables(SEEDS, cursor)
        
        cxn.commit()
        cursor.close()
        cxn.close()
        print("\n✨ Migración completa exitosamente.")
        
    except Error as err:
        print(f"\n❌ Error de conexión o ejecución: {err}")
