const { connectToMongoDB } = require('./mongodb-config');

async function testMembresias() {
    try {
        console.log('🔍 Verificando membresías activas...');
        
        const client = await connectToMongoDB('atlas');
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        // Verificar si hay clientes
        const totalClientes = await clientesCollection.countDocuments();
        console.log(`📊 Total de clientes en la base de datos: ${totalClientes}`);
        
        if (totalClientes === 0) {
            console.log('⚠️ No hay clientes en la base de datos. Ejecutando seeding...');
            // Aquí podríamos ejecutar el seeding, pero por ahora solo informamos
            console.log('💡 Por favor, reinicia el servidor para que se ejecute el seeding automático.');
            return;
        }
        
        // Obtener fecha actual
        const today = new Date();
        console.log(`📅 Fecha actual: ${today.toISOString()}`);
        
        // Buscar membresías activas
        const membresiasActivas = await clientesCollection.find({
            fechaFin: { $gte: today }
        }).toArray();
        
        console.log(`✅ Membresías activas encontradas: ${membresiasActivas.length}`);
        
        // Mostrar detalles de cada membresía activa
        console.log('\n📋 Detalles de membresías activas:');
        membresiasActivas.forEach((cliente, index) => {
            console.log(`${index + 1}. ${cliente.nombre} ${cliente.apellidos}`);
            console.log(`   - Tipo: ${cliente.tipoMembresia}`);
            console.log(`   - Fecha fin: ${new Date(cliente.fechaFin).toLocaleDateString()}`);
            console.log(`   - ID: ${cliente.id || cliente._id}`);
            console.log('');
        });
        
        // Buscar membresías expiradas
        const membresiasExpiradas = await clientesCollection.find({
            fechaFin: { $lt: today }
        }).toArray();
        
        console.log(`❌ Membresías expiradas: ${membresiasExpiradas.length}`);
        
        // Probar el endpoint de reportes
        console.log('\n🧪 Probando endpoint de reportes...');
        const response = await fetch('http://localhost:3000/api/reportes/all');
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Datos del endpoint de reportes:');
            console.log(`   - Ventas mensuales: ${data.cardStats.ventasMensuales}`);
            console.log(`   - Membresías activas: ${data.cardStats.membresiasActivas}`);
            console.log(`   - Ingresos mensuales: $${data.cardStats.ingresosMensuales}`);
        } else {
            console.log('❌ Error al obtener datos del endpoint de reportes');
        }
        
        await client.close();
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Ejecutar la prueba
testMembresias(); 