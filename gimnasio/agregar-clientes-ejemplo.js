const { MongoClient } = require('mongodb');
require('dotenv').config();

// Configuración de MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kevin:kevin123@cluster0.mongodb.net/gimnasio?retryWrites=true&w=majority';

async function agregarClientesEjemplo() {
    let client;
    
    try {
        console.log('🔄 Conectando a MongoDB Atlas...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Conectado a MongoDB Atlas');
        
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        // Obtener fecha actual
        const hoy = new Date();
        
        // Calcular fechas para suscripciones que terminen pronto
        const fechaVenceHoy = new Date(hoy);
        fechaVenceHoy.setDate(hoy.getDate());
        
        const fechaVence3Dias = new Date(hoy);
        fechaVence3Dias.setDate(hoy.getDate() + 3);
        
        const fechaVence7Dias = new Date(hoy);
        fechaVence7Dias.setDate(hoy.getDate() + 7);
        
        const fechaVence15Dias = new Date(hoy);
        fechaVence15Dias.setDate(hoy.getDate() + 15);
        
        const fechaVence30Dias = new Date(hoy);
        fechaVence30Dias.setDate(hoy.getDate() + 30);
        
        const fechaVencida2Dias = new Date(hoy);
        fechaVencida2Dias.setDate(hoy.getDate() - 2);
        
        const fechaVencida5Dias = new Date(hoy);
        fechaVencida5Dias.setDate(hoy.getDate() - 5);
        
        // Clientes de ejemplo con suscripciones próximas a vencer
        const clientesEjemplo = [
            {
                id: 'CLI001',
                nombre: 'Juan',
                apellidos: 'Pérez García',
                edad: 28,
                enfermedadCronica: 'Ninguna',
                alergia: 'Ninguna',
                tipoMembresia: 'Mensual',
                direccion: 'Calle Principal 123, Ciudad',
                fechaInicio: fechaVenceHoy.toISOString().split('T')[0],
                fechaFin: fechaVenceHoy.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI002',
                nombre: 'María',
                apellidos: 'González López',
                edad: 32,
                enfermedadCronica: 'Ninguna',
                alergia: 'Ninguna',
                tipoMembresia: 'Trimestral',
                direccion: 'Av. Principal 456, Ciudad',
                fechaInicio: fechaVence3Dias.toISOString().split('T')[0],
                fechaFin: fechaVence3Dias.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI003',
                nombre: 'Carlos',
                apellidos: 'Rodríguez Martínez',
                edad: 25,
                enfermedadCronica: 'Ninguna',
                alergia: 'Polen',
                tipoMembresia: 'Semestral',
                direccion: 'Calle Secundaria 789, Ciudad',
                fechaInicio: fechaVence7Dias.toISOString().split('T')[0],
                fechaFin: fechaVence7Dias.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI004',
                nombre: 'Ana',
                apellidos: 'López Sánchez',
                edad: 29,
                enfermedadCronica: 'Asma',
                alergia: 'Ninguna',
                tipoMembresia: 'Anual',
                direccion: 'Plaza Mayor 321, Ciudad',
                fechaInicio: fechaVence15Dias.toISOString().split('T')[0],
                fechaFin: fechaVence15Dias.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI005',
                nombre: 'Roberto',
                apellidos: 'Fernández Díaz',
                edad: 35,
                enfermedadCronica: 'Ninguna',
                alergia: 'Ninguna',
                tipoMembresia: 'Mensual',
                direccion: 'Avenida Central 654, Ciudad',
                fechaInicio: fechaVence30Dias.toISOString().split('T')[0],
                fechaFin: fechaVence30Dias.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI006',
                nombre: 'Laura',
                apellidos: 'Martínez Ruiz',
                edad: 27,
                enfermedadCronica: 'Ninguna',
                alergia: 'Ninguna',
                tipoMembresia: 'Trimestral',
                direccion: 'Calle Nueva 987, Ciudad',
                fechaInicio: fechaVencida2Dias.toISOString().split('T')[0],
                fechaFin: fechaVencida2Dias.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI007',
                nombre: 'Miguel',
                apellidos: 'Sánchez Torres',
                edad: 31,
                enfermedadCronica: 'Diabetes',
                alergia: 'Ninguna',
                tipoMembresia: 'Semestral',
                direccion: 'Boulevard Principal 147, Ciudad',
                fechaInicio: fechaVencida5Dias.toISOString().split('T')[0],
                fechaFin: fechaVencida5Dias.toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'CLI008',
                nombre: 'Carmen',
                apellidos: 'García Morales',
                edad: 33,
                enfermedadCronica: 'Ninguna',
                alergia: 'Ninguna',
                tipoMembresia: 'Anual',
                direccion: 'Calle Antigua 258, Ciudad',
                fechaInicio: '2024-01-15',
                fechaFin: '2025-01-15',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        // Limpiar clientes existentes (opcional)
        console.log('🧹 Limpiando clientes existentes...');
        await clientesCollection.deleteMany({});
        
        // Insertar clientes de ejemplo
        console.log('📝 Insertando clientes de ejemplo...');
        const result = await clientesCollection.insertMany(clientesEjemplo);
        
        console.log(`✅ Se agregaron ${result.insertedCount} clientes de ejemplo`);
        console.log('\n📋 Resumen de clientes agregados:');
        
        clientesEjemplo.forEach(cliente => {
            const fechaFin = new Date(cliente.fechaFin);
            const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
            let estado = '';
            
            if (diasRestantes < 0) {
                estado = '🔴 VENCIDA';
            } else if (diasRestantes <= 7) {
                estado = '🟡 PRÓXIMO A VENCER';
            } else {
                estado = '🟢 ACTIVA';
            }
            
            console.log(`- ${cliente.nombre} ${cliente.apellidos} (${cliente.tipoMembresia}): ${diasRestantes} días restantes - ${estado}`);
        });
        
        console.log('\n🎉 ¡Clientes de ejemplo agregados exitosamente!');
        console.log('💡 Ahora puedes ir a la sección "Historial" para ver las suscripciones próximas a vencer.');
        
    } catch (error) {
        console.error('❌ Error al agregar clientes de ejemplo:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar el script
agregarClientesEjemplo(); 