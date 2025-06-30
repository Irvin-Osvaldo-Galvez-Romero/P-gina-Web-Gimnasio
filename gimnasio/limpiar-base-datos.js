// Script para limpiar todas las tablas de MongoDB y reiniciar contadores de ID
// Este archivo elimina todos los datos excepto un administrador y reinicia los contadores

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_ATLAS_URI || "mongodb+srv://Usuario:X5ZhVvf1eRkUMQeE@cluster0.hnpybvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function limpiarBaseDatos() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB Atlas');
        
        const db = client.db('gimnasio_db');
        console.log('📊 Base de datos: gimnasio_db');
        
        // Lista de todas las colecciones a limpiar
        const colecciones = [
            'clientes',
            'productos', 
            'ventas',
            'membresias',
            'instructores',
            'contratos',
            'configuracion'
        ];
        
        console.log('\n🧹 Iniciando limpieza de base de datos...');
        
        // Limpiar cada colección
        for (const coleccion of colecciones) {
            try {
                const collection = db.collection(coleccion);
                const count = await collection.countDocuments();
                
                if (count > 0) {
                    await collection.deleteMany({});
                    console.log(`✅ Colección '${coleccion}' limpiada (${count} documentos eliminados)`);
                } else {
                    console.log(`ℹ️ Colección '${coleccion}' ya está vacía`);
                }
            } catch (error) {
                console.log(`⚠️ Error al limpiar colección '${coleccion}':`, error.message);
            }
        }
        
        // Limpiar usuarios pero mantener solo un administrador
        console.log('\n👥 Limpiando usuarios...');
        const usuariosCollection = db.collection('usuarios');
        
        // Eliminar todos los usuarios
        const usuariosEliminados = await usuariosCollection.countDocuments();
        await usuariosCollection.deleteMany({});
        console.log(`✅ Usuarios eliminados: ${usuariosEliminados}`);
        
        // Crear un solo administrador por defecto
        const adminPorDefecto = {
            nombre: "Administrador",
            email: "admin@gimnasio.com",
            password: "admin123",
            rol: "admin",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await usuariosCollection.insertOne(adminPorDefecto);
        console.log('✅ Administrador por defecto creado');
        
        // Reiniciar contadores de ID (crear nuevos documentos con ID 001)
        console.log('\n🔄 Reiniciando contadores de ID...');
        
        // Crear documentos de ejemplo con ID 001 para cada colección
        await crearDocumentosConID001(db);
        
        console.log('\n🎉 ¡Base de datos limpiada exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   - Todas las colecciones han sido limpiadas');
        console.log('   - Solo se mantiene un administrador: admin@gimnasio.com / admin123');
        console.log('   - Los contadores de ID han sido reiniciados a 001');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('🔌 Conexión cerrada');
    }
}

async function crearDocumentosConID001(db) {
    try {
        // Crear cliente de ejemplo con ID 001
        const clienteEjemplo = {
            _id: "001",
            nombre: "Cliente",
            apellidos: "Ejemplo",
            email: "cliente.ejemplo@email.com",
            edad: 25,
            enfermedadCronica: "Ninguna",
            alergia: "Ninguna",
            tipoMembresia: "Básica",
            direccion: "Dirección de ejemplo",
            fechaInicio: new Date(),
            fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('clientes').insertOne(clienteEjemplo);
        console.log('✅ Cliente de ejemplo creado con ID: 001');
        
        // Crear producto de ejemplo con ID 001
        const productoEjemplo = {
            _id: "001",
            nombre: "Producto Ejemplo",
            precio: 29.99,
            stock: 10,
            categoria: "Suplementos",
            descripcion: "Producto de ejemplo para pruebas",
            imagen: "producto-ejemplo.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('productos').insertOne(productoEjemplo);
        console.log('✅ Producto de ejemplo creado con ID: 001');
        
        // Crear membresía de ejemplo con ID 001
        const membresiaEjemplo = {
            _id: "001",
            nombre: "Membresía Ejemplo",
            precio: 49.99,
            duracion: 30,
            descripcion: "Membresía de ejemplo para pruebas",
            beneficios: ["Gimnasio completo", "Vestidores"],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('membresias').insertOne(membresiaEjemplo);
        console.log('✅ Membresía de ejemplo creada con ID: 001');
        
        // Crear venta de ejemplo con ID 001
        const ventaEjemplo = {
            _id: "001",
            cliente: "Cliente Ejemplo",
            productos: ["Producto Ejemplo"],
            total: 29.99,
            fecha: new Date(),
            metodoPago: "Efectivo",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('ventas').insertOne(ventaEjemplo);
        console.log('✅ Venta de ejemplo creada con ID: 001');
        
        // Crear instructor de ejemplo con ID 001 (si existe la colección)
        try {
            const instructorEjemplo = {
                _id: "001",
                nombre: "Instructor",
                apellidos: "Ejemplo",
                email: "instructor.ejemplo@gimnasio.com",
                especialidad: "Musculación",
                telefono: "123-456-7890",
                fechaContratacion: new Date(),
                estado: "Activo",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            await db.collection('instructores').insertOne(instructorEjemplo);
            console.log('✅ Instructor de ejemplo creado con ID: 001');
        } catch (error) {
            console.log('ℹ️ Colección de instructores no disponible');
        }
        
        // Crear configuración por defecto
        const configuracionEjemplo = {
            _id: "001",
            nombreGimnasio: "Gimnasio Ejemplo",
            direccion: "Dirección del Gimnasio",
            telefono: "123-456-7890",
            email: "info@gimnasio.com",
            horarioApertura: "06:00",
            horarioCierre: "22:00",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('configuracion').insertOne(configuracionEjemplo);
        console.log('✅ Configuración de ejemplo creada con ID: 001');
        
    } catch (error) {
        console.error('❌ Error al crear documentos de ejemplo:', error);
    }
}

// Ejecutar la función
limpiarBaseDatos().catch(console.error); 