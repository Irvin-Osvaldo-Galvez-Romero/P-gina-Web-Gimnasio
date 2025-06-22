const { MongoClient } = require('mongodb');
require('dotenv').config();

async function verificarSistema() {
    console.log('🔍 Verificando sistema de gimnasio...\n');
    
    try {
        // 1. Verificar conexión a MongoDB Atlas
        console.log('1️⃣ Verificando conexión a MongoDB Atlas...');
        const client = new MongoClient(process.env.MONGODB_ATLAS_URI);
        await client.connect();
        console.log('✅ Conexión a MongoDB Atlas exitosa');
        
        const db = client.db();
        
        // 2. Verificar colecciones
        console.log('\n2️⃣ Verificando colecciones...');
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        console.log('📋 Colecciones encontradas:', collectionNames);
        
        // 3. Verificar datos en cada colección
        console.log('\n3️⃣ Verificando datos...');
        
        // Usuarios/Administradores
        const usuariosCollection = db.collection('usuarios');
        const usuariosCount = await usuariosCollection.countDocuments();
        console.log(`👥 Usuarios/Administradores: ${usuariosCount}`);
        
        // Clientes
        const clientesCollection = db.collection('clientes');
        const clientesCount = await clientesCollection.countDocuments();
        console.log(`👤 Clientes: ${clientesCount}`);
        
        // Productos
        const productosCollection = db.collection('productos');
        const productosCount = await productosCollection.countDocuments();
        console.log(`📦 Productos: ${productosCount}`);
        
        // Ventas
        const ventasCollection = db.collection('ventas');
        const ventasCount = await ventasCollection.countDocuments();
        console.log(`🛒 Ventas: ${ventasCount}`);
        
        // 4. Verificar estructura de datos
        console.log('\n4️⃣ Verificando estructura de datos...');
        
        // Verificar un usuario
        const usuario = await usuariosCollection.findOne();
        if (usuario) {
            console.log('✅ Usuario encontrado:', {
                id: usuario.id || usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            });
        }
        
        // Verificar un producto
        const producto = await productosCollection.findOne();
        if (producto) {
            console.log('✅ Producto encontrado:', {
                id: producto.id || producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                stock: producto.stock || producto.piezas
            });
        }
        
        // Verificar un cliente
        const cliente = await clientesCollection.findOne();
        if (cliente) {
            console.log('✅ Cliente encontrado:', {
                id: cliente.id || cliente._id,
                nombre: cliente.nombre,
                apellidos: cliente.apellidos,
                tipoMembresia: cliente.tipoMembresia
            });
        }
        
        // 5. Verificar stock de productos
        console.log('\n5️⃣ Verificando stock de productos...');
        const productosConStock = await productosCollection.find({}).toArray();
        productosConStock.forEach(p => {
            const stock = p.stock || p.piezas || 0;
            const status = stock > 10 ? '✅' : stock > 0 ? '⚠️' : '❌';
            console.log(`${status} ${p.nombre}: ${stock} unidades`);
        });
        
        // 6. Verificar ventas recientes
        console.log('\n6️⃣ Verificando ventas recientes...');
        const ventasRecientes = await ventasCollection.find({}).sort({ fecha: -1 }).limit(5).toArray();
        if (ventasRecientes.length > 0) {
            ventasRecientes.forEach(v => {
                console.log(`🛒 Venta: $${v.total} - ${v.productos.length} productos - ${new Date(v.fecha).toLocaleDateString()}`);
            });
        } else {
            console.log('📝 No hay ventas registradas');
        }
        
        await client.close();
        console.log('\n🎉 Verificación completada exitosamente');
        console.log('\n📋 Resumen:');
        console.log(`- Usuarios: ${usuariosCount}`);
        console.log(`- Clientes: ${clientesCount}`);
        console.log(`- Productos: ${productosCount}`);
        console.log(`- Ventas: ${ventasCount}`);
        console.log('\n✅ El sistema está funcionando correctamente');
        
    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
        process.exit(1);
    }
}

// Ejecutar verificación
verificarSistema(); 