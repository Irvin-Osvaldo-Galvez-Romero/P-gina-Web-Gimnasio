// Configuración de MongoDB para el Sistema de Gestión de Gimnasio
// Este archivo contiene la configuración necesaria para conectar la aplicación con MongoDB

const { MongoClient, ObjectId } = require('mongodb');
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

// Variable global para mantener la conexión
let client = null;

// Función para conectar a MongoDB
async function connectToMongoDB(environment = 'local') {
    try {
        if (client) {
            return client;
        }

        const mongoConfig = config[environment];
        if (!mongoConfig.uri) {
            throw new Error(`No se encontró la URI de conexión para ${environment}`);
        }

        client = new MongoClient(mongoConfig.uri, mongoConfig.options);
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

// Función para cerrar la conexión
async function closeConnection() {
    if (client) {
        await client.close();
        client = null;
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

// Función para obtener una colección específica
async function getCollection(collectionName, environment = 'local') {
    const db = await getDatabase(environment);
    return db.collection(collectionName);
}

// ============================================================================
// FUNCIONES CRUD PARA CLIENTES
// ============================================================================

// Crear cliente
async function crearCliente(clienteData, environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const result = await collection.insertOne({
            ...clienteData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Cliente creado con ID:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('❌ Error al crear cliente:', error);
        throw error;
    }
}

// Obtener todos los clientes
async function obtenerClientes(environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const clientes = await collection.find({}).toArray();
        console.log(`✅ Obtenidos ${clientes.length} clientes`);
        return clientes;
    } catch (error) {
        console.error('❌ Error al obtener clientes:', error);
        throw error;
    }
}

// Obtener cliente por ID
async function obtenerClientePorId(id, environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const cliente = await collection.findOne({ _id: new ObjectId(id) });
        if (cliente) {
            console.log('✅ Cliente encontrado:', cliente.nombre);
        } else {
            console.log('⚠️ Cliente no encontrado');
        }
        return cliente;
    } catch (error) {
        console.error('❌ Error al obtener cliente:', error);
        throw error;
    }
}

// Actualizar cliente
async function actualizarCliente(id, datosActualizados, environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    ...datosActualizados,
                    updatedAt: new Date()
                }
            }
        );
        if (result.modifiedCount > 0) {
            console.log('✅ Cliente actualizado correctamente');
        } else {
            console.log('⚠️ No se pudo actualizar el cliente');
        }
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('❌ Error al actualizar cliente:', error);
        throw error;
    }
}

// Eliminar cliente
async function eliminarCliente(id, environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
            console.log('✅ Cliente eliminado correctamente');
        } else {
            console.log('⚠️ No se pudo eliminar el cliente');
        }
        return result.deletedCount > 0;
    } catch (error) {
        console.error('❌ Error al eliminar cliente:', error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES CRUD PARA PRODUCTOS
// ============================================================================

// Crear producto
async function crearProducto(productoData, environment = 'local') {
    try {
        const collection = await getCollection('productos', environment);
        const result = await collection.insertOne({
            ...productoData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Producto creado con ID:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        throw error;
    }
}

// Obtener todos los productos
async function obtenerProductos(environment = 'local') {
    try {
        const collection = await getCollection('productos', environment);
        const productos = await collection.find({}).toArray();
        console.log(`✅ Obtenidos ${productos.length} productos`);
        return productos;
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        throw error;
    }
}

// Actualizar stock de producto
async function actualizarStockProducto(id, nuevoStock, environment = 'local') {
    try {
        const collection = await getCollection('productos', environment);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    stock: nuevoStock,
                    updatedAt: new Date()
                }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('❌ Error al actualizar stock:', error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES CRUD PARA MEMBRESIAS
// ============================================================================

// Crear membresía
async function crearMembresia(membresiaData, environment = 'local') {
    try {
        const collection = await getCollection('membresias', environment);
        const result = await collection.insertOne({
            ...membresiaData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Membresía creada con ID:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('❌ Error al crear membresía:', error);
        throw error;
    }
}

// Obtener todas las membresías
async function obtenerMembresias(environment = 'local') {
    try {
        const collection = await getCollection('membresias', environment);
        const membresias = await collection.find({}).toArray();
        console.log(`✅ Obtenidas ${membresias.length} membresías`);
        return membresias;
    } catch (error) {
        console.error('❌ Error al obtener membresías:', error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES DE BÚSQUEDA Y FILTROS
// ============================================================================

// Buscar clientes por nombre
async function buscarClientesPorNombre(nombre, environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const clientes = await collection.find({
            nombre: { $regex: nombre, $options: 'i' }
        }).toArray();
        console.log(`✅ Encontrados ${clientes.length} clientes con nombre "${nombre}"`);
        return clientes;
    } catch (error) {
        console.error('❌ Error al buscar clientes:', error);
        throw error;
    }
}

// Obtener clientes con membresía vencida
async function obtenerClientesMembresiaVencida(environment = 'local') {
    try {
        const collection = await getCollection('clientes', environment);
        const clientes = await collection.find({
            fechaFin: { $lt: new Date() }
        }).toArray();
        console.log(`✅ Encontrados ${clientes.length} clientes con membresía vencida`);
        return clientes;
    } catch (error) {
        console.error('❌ Error al obtener clientes con membresía vencida:', error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES DE ESTADÍSTICAS
// ============================================================================

// Obtener estadísticas generales
async function obtenerEstadisticas(environment = 'local') {
    try {
        const db = await getDatabase(environment);
        
        const totalClientes = await db.collection('clientes').countDocuments();
        const totalProductos = await db.collection('productos').countDocuments();
        const totalMembresias = await db.collection('membresias').countDocuments();
        
        const clientesActivos = await db.collection('clientes').countDocuments({
            fechaFin: { $gte: new Date() }
        });
        
        const productosBajoStock = await db.collection('productos').countDocuments({
            stock: { $lt: 10 }
        });
        
        return {
            totalClientes,
            totalProductos,
            totalMembresias,
            clientesActivos,
            productosBajoStock
        };
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        throw error;
    }
}

// ============================================================================
// EXPORTACIÓN DE FUNCIONES
// ============================================================================

module.exports = {
    // Configuración
    connectToMongoDB,
    getDatabase,
    getCollection,
    closeConnection,
    config,
    
    // Clientes
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente,
    buscarClientesPorNombre,
    
    // Productos
    crearProducto,
    obtenerProductos,
    actualizarStockProducto,
    
    // Membresías
    crearMembresia,
    obtenerMembresias,
    
    // Búsquedas y filtros
    obtenerClientesMembresiaVencida,
    
    // Estadísticas
    obtenerEstadisticas,
    
    // Utilidades
    ObjectId
}; 