# Configuración de MongoDB y MongoDB Atlas para Sistema de Gimnasio

## 📋 Índice
1. [Instalación de MongoDB Local](#instalación-de-mongodb-local)
2. [Configuración de MongoDB Atlas](#configuración-de-mongodb-atlas)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Migración de Firebase a MongoDB](#migración-de-firebase-a-mongodb)
5. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🖥️ Instalación de MongoDB Local

### Paso 1: Descargar MongoDB Community Server

1. Ve a [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Selecciona:
   - **Version**: 7.0 o la más reciente
   - **Platform**: Windows
   - **Package**: msi
3. Haz clic en "Download"

### Paso 2: Instalar MongoDB

1. Ejecuta el archivo `.msi` descargado
2. Sigue el asistente de instalación:
   - Acepta los términos de licencia
   - Selecciona "Complete" installation
   - **IMPORTANTE**: Marca la opción "Install MongoDB as a Service"
   - Completa la instalación

### Paso 3: Verificar la Instalación

Abre PowerShell como administrador y ejecuta:

```powershell
# Verificar que MongoDB está corriendo
Get-Service -Name MongoDB

# Conectar a MongoDB
mongosh
```

### Paso 4: Crear Base de Datos

```javascript
// En mongosh
use gimnasio_db
db.createCollection("clientes")
db.createCollection("productos")
db.createCollection("membresias")
db.createCollection("usuarios")
```

---

## ☁️ Configuración de MongoDB Atlas

### Paso 1: Crear Cuenta en MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Haz clic en "Try Free"
3. Completa el registro

### Paso 2: Crear Cluster

1. **Build a Database**
2. Selecciona "FREE" tier (M0)
3. **Provider**: AWS, Google Cloud, o Azure
4. **Region**: Elige la más cercana a tu ubicación
5. Haz clic en "Create"

### Paso 3: Configurar Seguridad

#### Crear Usuario de Base de Datos:
1. Ve a "Database Access"
2. Haz clic en "Add New Database User"
3. **Username**: `gimnasio_user`
4. **Password**: Genera una contraseña segura
5. **Database User Privileges**: "Read and write to any database"
6. Haz clic en "Add User"

#### Configurar IP Whitelist:
1. Ve a "Network Access"
2. Haz clic en "Add IP Address"
3. Para desarrollo: "Allow Access from Anywhere" (0.0.0.0/0)
4. Para producción: Agrega tu IP específica

### Paso 4: Obtener String de Conexión

1. Ve a "Database" en tu cluster
2. Haz clic en "Connect"
3. Selecciona "Connect your application"
4. Copia el string de conexión

**Ejemplo de string de conexión:**
```
mongodb+srv://gimnasio_user:<password>@cluster0.xxxxx.mongodb.net/gimnasio_db?retryWrites=true&w=majority
```

---

## ⚙️ Configuración del Proyecto

### Paso 1: Instalar Dependencias

```bash
npm install mongodb mongoose dotenv
```

### Paso 2: Crear Archivo de Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
# MongoDB Local
MONGODB_LOCAL_URI=mongodb://localhost:27017/gimnasio_db

# MongoDB Atlas
MONGODB_ATLAS_URI=mongodb+srv://gimnasio_user:<tu_password>@cluster0.xxxxx.mongodb.net/gimnasio_db?retryWrites=true&w=majority

# Configuración
NODE_ENV=development
```

### Paso 3: Configurar Conexión

Crea el archivo `mongodb-config.js`:

```javascript
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Configuración de conexión
const config = {
    local: {
        uri: process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/gimnasio_db',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    atlas: {
        uri: process.env.MONGODB_ATLAS_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    }
};

// Función para conectar a MongoDB
async function connectToMongoDB(environment = 'local') {
    try {
        const client = new MongoClient(config[environment].uri, config[environment].options);
        await client.connect();
        console.log(`✅ Conectado a MongoDB ${environment}`);
        return client;
    } catch (error) {
        console.error(`❌ Error conectando a MongoDB ${environment}:`, error);
        throw error;
    }
}

// Función para obtener la base de datos
async function getDatabase(environment = 'local') {
    const client = await connectToMongoDB(environment);
    return client.db();
}

module.exports = {
    connectToMongoDB,
    getDatabase,
    config
};
```

---

## 🔄 Migración de Firebase a MongoDB

### Estructura de Colecciones

```javascript
// Colección: clientes
{
  _id: ObjectId,
  nombre: String,
  apellidos: String,
  edad: Number,
  enfermedadCronica: String,
  alergia: String,
  tipoMembresia: String,
  direccion: String,
  fechaInicio: Date,
  fechaFin: Date,
  createdAt: Date,
  updatedAt: Date
}

// Colección: productos
{
  _id: ObjectId,
  nombre: String,
  precio: Number,
  stock: Number,
  categoria: String,
  descripcion: String,
  imagen: String,
  createdAt: Date,
  updatedAt: Date
}

// Colección: membresias
{
  _id: ObjectId,
  nombre: String,
  precio: Number,
  duracion: Number, // en días
  descripcion: String,
  beneficios: [String],
  createdAt: Date,
  updatedAt: Date
}

// Colección: usuarios
{
  _id: ObjectId,
  email: String,
  password: String, // hasheada
  rol: String, // admin, empleado
  nombre: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💡 Ejemplos de Uso

### Operaciones CRUD Básicas

```javascript
// Crear cliente
async function crearCliente(clienteData) {
    const db = await getDatabase();
    const result = await db.collection('clientes').insertOne({
        ...clienteData,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result.insertedId;
}

// Obtener todos los clientes
async function obtenerClientes() {
    const db = await getDatabase();
    return await db.collection('clientes').find({}).toArray();
}

// Actualizar cliente
async function actualizarCliente(id, datosActualizados) {
    const db = await getDatabase();
    const result = await db.collection('clientes').updateOne(
        { _id: new ObjectId(id) },
        { 
            $set: {
                ...datosActualizados,
                updatedAt: new Date()
            }
        }
    );
    return result.modifiedCount > 0;
}

// Eliminar cliente
async function eliminarCliente(id) {
    const db = await getDatabase();
    const result = await db.collection('clientes').deleteOne(
        { _id: new ObjectId(id) }
    );
    return result.deletedCount > 0;
}
```

---

## 🚀 Próximos Pasos

1. **Instalar MongoDB localmente** siguiendo los pasos anteriores
2. **Crear cuenta en MongoDB Atlas** y configurar el cluster
3. **Instalar las dependencias** del proyecto
4. **Configurar las variables de entorno**
5. **Migrar las funciones** de Firebase a MongoDB
6. **Probar la conexión** y operaciones básicas

---

## 📞 Soporte

Si tienes problemas durante la instalación:

1. **MongoDB Local**: Verifica que el servicio esté corriendo
2. **MongoDB Atlas**: Revisa la configuración de red y credenciales
3. **Conexión**: Verifica las variables de entorno

---

## 🔗 Enlaces Útiles

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Mongoose ODM](https://mongoosejs.com/) 