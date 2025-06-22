// Archivo de prueba para MongoDB
// Este archivo permite probar la conexión y funcionalidad básica de MongoDB

const {
    connectToMongoDB,
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente,
    crearProducto,
    obtenerProductos,
    crearMembresia,
    obtenerMembresias,
    obtenerEstadisticas,
    closeConnection
} = require('./mongodb-config');

// Datos de prueba
const clientePrueba = {
    nombre: "Juan",
    apellidos: "Pérez García",
    edad: 28,
    enfermedadCronica: "Ninguna",
    alergia: "Ninguna",
    tipoMembresia: "Mensual",
    direccion: "Calle Principal 123, Ciudad",
    fechaInicio: new Date(),
    fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
};

const productoPrueba = {
    nombre: "Proteína Whey",
    precio: 45.99,
    stock: 50,
    categoria: "Suplementos",
    descripcion: "Proteína de suero de leche de alta calidad",
    imagen: "proteina-whey.jpg"
};

const membresiaPrueba = {
    nombre: "Membresía Premium",
    precio: 89.99,
    duracion: 30,
    descripcion: "Acceso completo a todas las instalaciones",
    beneficios: ["Gimnasio completo", "Clases grupales", "Entrenador personal", "Spa"]
};

// Función principal de prueba
async function ejecutarPruebas(environment = 'local') {
    console.log(`🚀 Iniciando pruebas de MongoDB (${environment})...\n`);
    
    try {
        // 1. Probar conexión
        console.log('1️⃣ Probando conexión a MongoDB...');
        await connectToMongoDB(environment);
        console.log('✅ Conexión exitosa\n');
        
        // 2. Probar creación de cliente
        console.log('2️⃣ Probando creación de cliente...');
        const clienteId = await crearCliente(clientePrueba, environment);
        console.log(`✅ Cliente creado con ID: ${clienteId}\n`);
        
        // 3. Probar obtención de clientes
        console.log('3️⃣ Probando obtención de clientes...');
        const clientes = await obtenerClientes(environment);
        console.log(`✅ Total de clientes: ${clientes.length}\n`);
        
        // 4. Probar obtención de cliente por ID
        console.log('4️⃣ Probando obtención de cliente por ID...');
        const cliente = await obtenerClientePorId(clienteId, environment);
        if (cliente) {
            console.log(`✅ Cliente encontrado: ${cliente.nombre} ${cliente.apellidos}\n`);
        }
        
        // 5. Probar actualización de cliente
        console.log('5️⃣ Probando actualización de cliente...');
        const actualizado = await actualizarCliente(clienteId, {
            edad: 29,
            tipoMembresia: "Anual"
        }, environment);
        console.log(`✅ Cliente actualizado: ${actualizado}\n`);
        
        // 6. Probar creación de producto
        console.log('6️⃣ Probando creación de producto...');
        const productoId = await crearProducto(productoPrueba, environment);
        console.log(`✅ Producto creado con ID: ${productoId}\n`);
        
        // 7. Probar obtención de productos
        console.log('7️⃣ Probando obtención de productos...');
        const productos = await obtenerProductos(environment);
        console.log(`✅ Total de productos: ${productos.length}\n`);
        
        // 8. Probar creación de membresía
        console.log('8️⃣ Probando creación de membresía...');
        const membresiaId = await crearMembresia(membresiaPrueba, environment);
        console.log(`✅ Membresía creada con ID: ${membresiaId}\n`);
        
        // 9. Probar obtención de membresías
        console.log('9️⃣ Probando obtención de membresías...');
        const membresias = await obtenerMembresias(environment);
        console.log(`✅ Total de membresías: ${membresias.length}\n`);
        
        // 10. Probar estadísticas
        console.log('🔟 Probando obtención de estadísticas...');
        const estadisticas = await obtenerEstadisticas(environment);
        console.log('✅ Estadísticas obtenidas:');
        console.log(`   - Total clientes: ${estadisticas.totalClientes}`);
        console.log(`   - Total productos: ${estadisticas.totalProductos}`);
        console.log(`   - Total membresías: ${estadisticas.totalMembresias}`);
        console.log(`   - Clientes activos: ${estadisticas.clientesActivos}`);
        console.log(`   - Productos bajo stock: ${estadisticas.productosBajoStock}\n`);
        
        // 11. Probar eliminación de cliente
        console.log('1️⃣1️⃣ Probando eliminación de cliente...');
        const eliminado = await eliminarCliente(clienteId, environment);
        console.log(`✅ Cliente eliminado: ${eliminado}\n`);
        
        console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
    } finally {
        // Cerrar conexión
        await closeConnection();
        console.log('🔌 Conexión cerrada');
    }
}

// Función para probar MongoDB Atlas
async function probarMongoDBAtlas() {
    console.log('☁️ Probando conexión a MongoDB Atlas...\n');
    
    try {
        // Verificar si existe la variable de entorno para Atlas
        if (!process.env.MONGODB_ATLAS_URI) {
            console.log('⚠️ No se encontró la variable MONGODB_ATLAS_URI');
            console.log('   Para probar Atlas, agrega tu string de conexión al archivo .env');
            return;
        }
        
        // Ejecutar todas las pruebas con Atlas
        await ejecutarPruebas('atlas');
        
    } catch (error) {
        console.error('❌ Error conectando a Atlas:', error);
    }
}

// Función para mostrar información de configuración
function mostrarConfiguracion() {
    console.log('📋 Configuración de MongoDB:');
    console.log('============================');
    
    if (process.env.MONGODB_LOCAL_URI) {
        console.log('✅ MONGODB_LOCAL_URI: Configurado');
    } else {
        console.log('⚠️ MONGODB_LOCAL_URI: No configurado (usando valor por defecto)');
    }
    
    if (process.env.MONGODB_ATLAS_URI) {
        console.log('✅ MONGODB_ATLAS_URI: Configurado');
    } else {
        console.log('⚠️ MONGODB_ATLAS_URI: No configurado');
    }
    
    console.log('');
}

// Ejecutar pruebas según argumentos
const args = process.argv.slice(2);

if (args.includes('--atlas')) {
    mostrarConfiguracion();
    probarMongoDBAtlas();
} else if (args.includes('--config')) {
    mostrarConfiguracion();
} else {
    mostrarConfiguracion();
    ejecutarPruebas('local');
}

// Exportar funciones para uso en otros archivos
module.exports = {
    ejecutarPruebas,
    probarMongoDBAtlas,
    mostrarConfiguracion
}; 