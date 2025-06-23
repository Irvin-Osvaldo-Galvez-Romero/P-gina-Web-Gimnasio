const { connectToMongoDB } = require('./mongodb-config');

async function fixMembresias() {
    try {
        console.log('🔧 Corrigiendo fechas de membresías...');
        
        const client = await connectToMongoDB('atlas');
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        // Obtener todos los clientes
        const clientes = await clientesCollection.find({}).toArray();
        console.log(`📊 Total de clientes encontrados: ${clientes.length}`);
        
        if (clientes.length === 0) {
            console.log('⚠️ No hay clientes para corregir.');
            return;
        }
        
        // Mostrar estado actual
        console.log('\n📋 Estado actual de los clientes:');
        clientes.forEach((cliente, index) => {
            console.log(`${index + 1}. ${cliente.nombre} ${cliente.apellidos}`);
            console.log(`   - Tipo: ${cliente.tipoMembresia}`);
            console.log(`   - Fecha fin: ${cliente.fechaFin ? new Date(cliente.fechaFin).toLocaleDateString() : 'NO DEFINIDA'}`);
            console.log(`   - ID: ${cliente.id || cliente._id}`);
            console.log('');
        });
        
        // Corregir fechas de fin según el tipo de membresía
        const today = new Date();
        let updatedCount = 0;
        
        for (const cliente of clientes) {
            let fechaFin;
            
            // Calcular fecha de fin según el tipo de membresía
            switch (cliente.tipoMembresia) {
                case 'Mensual':
                    fechaFin = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
                    break;
                case 'Trimestral':
                    fechaFin = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
                    break;
                case 'Semestral':
                    fechaFin = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
                    break;
                case 'Anual':
                    fechaFin = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
                    break;
                default:
                    // Por defecto, membresía mensual
                    fechaFin = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            }
            
            // Actualizar el cliente
            const result = await clientesCollection.updateOne(
                { _id: cliente._id },
                { 
                    $set: { 
                        fechaFin: fechaFin,
                        fechaInicio: today,
                        updatedAt: new Date()
                    } 
                }
            );
            
            if (result.modifiedCount > 0) {
                updatedCount++;
                console.log(`✅ Actualizado: ${cliente.nombre} ${cliente.apellidos} - ${cliente.tipoMembresia} hasta ${fechaFin.toLocaleDateString()}`);
            }
        }
        
        console.log(`\n🎉 Se actualizaron ${updatedCount} clientes.`);
        
        // Verificar el resultado
        console.log('\n🔍 Verificando resultado...');
        const membresiasActivas = await clientesCollection.find({
            fechaFin: { $gte: today }
        }).toArray();
        
        console.log(`✅ Membresías activas después de la corrección: ${membresiasActivas.length}`);
        
        // Mostrar las membresías activas
        console.log('\n📋 Membresías activas:');
        membresiasActivas.forEach((cliente, index) => {
            console.log(`${index + 1}. ${cliente.nombre} ${cliente.apellidos} (${cliente.tipoMembresia}) - Expira: ${new Date(cliente.fechaFin).toLocaleDateString()}`);
        });
        
        await client.close();
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Ejecutar la corrección
fixMembresias(); 