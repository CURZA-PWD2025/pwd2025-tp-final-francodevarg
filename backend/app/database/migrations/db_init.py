import mysql.connector
from mysql.connector import Error, errorcode
import os
from dotenv import load_dotenv

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

# Datos semilla
SEEDS['usuarios'] = (
    "INSERT INTO usuarios (nombre, email, password, tipo) VALUES (%s, %s, %s, %s)",
    [
        ('Admin Uno', 'admin1@vet.com', 'scrypt:32768:8:1$gY8UgPUBiSA7Im13$8421f9a50bf14c10c82fc63afd91d12d0016edfe349b40854da240323f05689b2e22614074f69139eaf4ccd3b49b44fc82289d48b6970402b4af45d037c14cb2', 'admin'),
        ('Carlos Cliente', 'carlos@cliente.com', 'scrypt:32768:8:1$gY8UgPUBiSA7Im13$8421f9a50bf14c10c82fc63afd91d12d0016edfe349b40854da240323f05689b2e22614074f69139eaf4ccd3b49b44fc82289d48b6970402b4af45d037c14cb2', 'cliente')
    ]
    ## (password = 1234)
)

SEEDS['veterinarios'] = (
    "INSERT INTO veterinarios (nombre, especialidad, email, telefono) VALUES (%s, %s, %s, %s)",
    [
        ('Dra. Ana Vet', 'Clínica General', 'ana@vet.com', '1122334455'),
        ('Dr. Luis Vet', 'Cirugía', 'luis@vet.com', '2233445566')
    ]
)

SEEDS['horarios_laborales'] = (
    "INSERT INTO horarios_laborales (veterinario_id, dia_semana, hora) VALUES (%s, %s, %s)",
    [
        (1, 'Lunes', '09:00'),
        (1, 'Lunes', '10:00'),
        (2, 'Martes', '09:00'),
        (2, 'Martes', '10:00'),
        (1, 'Miércoles', '14:00'),
        (1, 'Miércoles', '15:00')
    ]
)

SEEDS['mascotas'] = (
    "INSERT INTO mascotas (nombre, especie, raza, edad, usuario_id) VALUES (%s, %s, %s, %s, %s)",
    [
        ('Firulais', 'Perro', 'Labrador', 3, 2),
        ('Mishi', 'Gato', 'Siames', 2, 2)
    ]
)

SEEDS['turnos'] = (
    "INSERT INTO turnos (fecha, hora, estado, motivo, mascota_id, veterinario_id) VALUES (%s, %s, %s, %s, %s, %s)",
    [
        ('2025-07-25', '09:00', 'confirmado', 'Consulta general', 1, 1),
        ('2025-07-26', '11:00', 'pendiente', 'Chequeo anual', 2, 2)
    ]
)

# Funciones
def create_database(cursor):
    try:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'")
        print(f"✅ Base de datos '{DB_NAME}' creada o ya existe.")
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
cxn = mysql.connector.connect(**DB_CONFIG)
cursor = cxn.cursor()
create_database(cursor)
cursor.execute(f"USE {DB_NAME}")
create_tables(TABLES, cursor)
seeds_tables(SEEDS, cursor)
cxn.commit()
cursor.close()
cxn.close()
