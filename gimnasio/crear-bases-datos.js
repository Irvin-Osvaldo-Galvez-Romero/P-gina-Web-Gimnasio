// Script para crear las bases de datos y colecciones necesarias en MongoDB
// Este archivo crea la estructura de datos para el sistema de gimnasio

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_ATLAS_URI || "mongodb+srv://Usuario:X5ZhVvf1eRkUMQeE@cluster0.hnpybvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function crearBasesDatos() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB Atlas');
        
        // Crear base de datos principal
        const db = client.db('gimnasio_db');
        console.log('📊 Base de datos: gimnasio_db');
        
        // 1. Colección: clientes
        console.log('\n👥 Creando colección: clientes');
        await db.createCollection('clientes');
        
        // Crear índices para clientes
        await db.collection('clientes').createIndex({ "nombre": 1 });
        await db.collection('clientes').createIndex({ "email": 1 }, { unique: true, sparse: true });
        await db.collection('clientes').createIndex({ "fechaFin": 1 }); // Para alertas de membresía
        
        // 2. Colección: productos
        console.log('🛒 Creando colección: productos');
        await db.createCollection('productos');
        
        // Crear índices para productos
        await db.collection('productos').createIndex({ "nombre": 1 });
        await db.collection('productos').createIndex({ "categoria": 1 });
        await db.collection('productos').createIndex({ "stock": 1 }); // Para alertas de stock bajo
        
        // 3. Colección: ventas
        console.log('💰 Creando colección: ventas');
        await db.createCollection('ventas');
        
        // Crear índices para ventas
        await db.collection('ventas').createIndex({ "fecha": 1 });
        await db.collection('ventas').createIndex({ "total": 1 });
        
        // 4. Colección: membresias
        console.log('🎫 Creando colección: membresias');
        await db.createCollection('membresias');
        
        // Crear índices para membresías
        await db.collection('membresias').createIndex({ "nombre": 1 });
        await db.collection('membresias').createIndex({ "precio": 1 });
        
        // 5. Colección: usuarios (administradores)
        console.log('👨‍💼 Creando colección: usuarios');
        await db.createCollection('usuarios');
        
        // Crear índices para usuarios
        await db.collection('usuarios').createIndex({ "email": 1 }, { unique: true });
        await db.collection('usuarios').createIndex({ "rol": 1 });
        
        // 6. Colección: configuracion
        console.log('⚙️ Creando colección: configuracion');
        await db.createCollection('configuracion');
        
        console.log('\n✅ Todas las colecciones creadas exitosamente');
        
        // Insertar datos de ejemplo
        await insertarDatosEjemplo(db);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('🔌 Conexión cerrada');
    }
}

async function insertarDatosEjemplo(db) {
    console.log('\n📝 Insertando datos de ejemplo...');
    
    try {
        // Usuario administrador por defecto
        const admin = {
            nombre: "Administrador",
            email: "admin@gimnasio.com",
            password: "admin123", // En producción debería estar hasheada
            rol: "admin",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('usuarios').insertOne(admin);
        console.log('✅ Usuario administrador creado');
        
        // Membresías de ejemplo
        const membresias = [
            {
                nombre: "Básica",
                precio: 49.99,
                duracion: 30,
                descripcion: "Acceso básico al gimnasio",
                beneficios: ["Gimnasio completo", "Vestidores"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Premium",
                precio: 89.99,
                duracion: 30,
                descripcion: "Acceso completo con beneficios adicionales",
                beneficios: ["Gimnasio completo", "Clases grupales", "Entrenador personal", "Spa"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Familiar",
                precio: 129.99,
                duracion: 30,
                descripcion: "Membresía para toda la familia",
                beneficios: ["Gimnasio completo", "Clases grupales", "Acceso familiar", "Descuentos en productos"],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        await db.collection('membresias').insertMany(membresias);
        console.log('✅ Membresías de ejemplo creadas');
        
        // Productos de ejemplo
        const productos = [
            {
                nombre: "Proteína Whey",
                precio: 45.99,
                stock: 50,
                categoria: "Suplementos",
                descripcion: "Proteína de suero de leche de alta calidad",
                imagen: "proteina-whey.jpg",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Creatina Monohidratada",
                precio: 29.99,
                stock: 30,
                categoria: "Suplementos",
                descripcion: "Creatina pura para ganancia muscular",
                imagen: "creatina.jpg",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "BCAA",
                precio: 35.50,
                stock: 25,
                categoria: "Suplementos",
                descripcion: "Aminoácidos ramificados",
                imagen: "bcaa.jpg",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Toalla de Gimnasio",
                precio: 15.99,
                stock: 100,
                categoria: "Accesorios",
                descripcion: "Toalla absorbente para gimnasio",
                imagen: "toalla.jpg",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        await db.collection('productos').insertMany(productos);
        console.log('✅ Productos de ejemplo creados');
        
        // Clientes de ejemplo
        const clientes = [
            {
                nombre: "Juan",
                apellidos: "Pérez García",
                email: "juan.perez@email.com",
                edad: 28,
                enfermedadCronica: "Ninguna",
                alergia: "Ninguna",
                tipoMembresia: "Premium",
                direccion: "Calle Principal 123, Ciudad",
                fechaInicio: new Date('2024-01-15'),
                fechaFin: new Date('2024-02-15'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "María",
                apellidos: "González López",
                email: "maria.gonzalez@email.com",
                edad: 32,
                enfermedadCronica: "Ninguna",
                alergia: "Ninguna",
                tipoMembresia: "Básica",
                direccion: "Av. Principal 456, Ciudad",
                fechaInicio: new Date('2024-01-01'),
                fechaFin: new Date('2024-02-01'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        await db.collection('clientes').insertMany(clientes);
        console.log('✅ Clientes de ejemplo creados');
        
        // Configuración del sistema
        const configuracion = {
            nombreGimnasio: "Gimnasio Fitness Pro",
            direccion: "Calle Principal 123, Ciudad",
            telefono: "+1 234 567 8900",
            email: "info@gimnasiofitnesspro.com",
            horario: "Lunes a Domingo: 6:00 AM - 10:00 PM",
            moneda: "USD",
            impuesto: 0.08, // 8%
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('configuracion').insertOne(configuracion);
        console.log('✅ Configuración del sistema creada');
        
        console.log('\n🎉 ¡Datos de ejemplo insertados exitosamente!');
        
    } catch (error) {
        console.error('❌ Error insertando datos:', error);
    }
}

// Ejecutar la función
crearBasesDatos().catch(console.error); 