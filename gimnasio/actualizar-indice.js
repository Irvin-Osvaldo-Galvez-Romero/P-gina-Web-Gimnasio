const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_ATLAS_URI || "mongodb+srv://Usuario:X5ZhVvf1eRkUMQeE@cluster0.hnpybvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function actualizarIndice() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB Atlas');
        
        const db = client.db('gimnasio_db');
        const clientesCollection = db.collection('clientes');
        
        // 1. Eliminar el índice existente
        try {
            console.log('🗑️ Intentando eliminar el índice "email_1"...');
            await clientesCollection.dropIndex("email_1");
            console.log('✅ Índice "email_1" eliminado correctamente.');
        } catch (error) {
            if (error.codeName === 'IndexNotFound') {
                console.log('⚠️ El índice "email_1" no existía, no fue necesario eliminarlo.');
            } else {
                throw error;
            }
        }

        // 2. Crear el nuevo índice disperso
        console.log('✨ Creando el nuevo índice disperso para "email"...');
        await clientesCollection.createIndex({ "email": 1 }, { unique: true, sparse: true });
        console.log('✅ Nuevo índice disperso creado exitosamente.');
        
    } catch (error) {
        console.error('❌ Error actualizando el índice:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Conexión cerrada.');
    }
}

actualizarIndice(); 