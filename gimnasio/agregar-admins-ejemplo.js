// Script para agregar administradores de ejemplo a MongoDB
// Este archivo agrega usuarios administradores adicionales para pruebas

const {
    connectToMongoDB,
    getCollection,
    closeConnection
} = require('./mongodb-config');

async function agregarAdministradoresEjemplo() {
    try {
        await connectToMongoDB('atlas');
        console.log('✅ Conectado a MongoDB Atlas');
        
        const usuariosCollection = await getCollection('usuarios', 'atlas');
        
        // Administradores de ejemplo
        const administradores = [
            {
                nombre: "María",
                email: "maria.admin@gimnasio.com",
                password: "maria123",
                rol: "admin",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Carlos",
                email: "carlos.supervisor@gimnasio.com",
                password: "carlos123",
                rol: "supervisor",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Ana",
                email: "ana.empleado@gimnasio.com",
                password: "ana123",
                rol: "empleado",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: "Luis",
                email: "luis.admin@gimnasio.com",
                password: "luis123",
                rol: "admin",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        console.log('📝 Agregando administradores de ejemplo...');
        
        for (const admin of administradores) {
            // Verificar si ya existe
            const existe = await usuariosCollection.findOne({ email: admin.email });
            
            if (!existe) {
                await usuariosCollection.insertOne(admin);
                console.log(`✅ Administrador agregado: ${admin.nombre} (${admin.email})`);
            } else {
                console.log(`⚠️ Administrador ya existe: ${admin.nombre} (${admin.email})`);
            }
        }
        
        // Mostrar todos los usuarios
        const todosLosUsuarios = await usuariosCollection.find({}).toArray();
        console.log('\n📊 Usuarios en la base de datos:');
        todosLosUsuarios.forEach(user => {
            console.log(`   - ${user.nombre} (${user.email}) - Rol: ${user.rol}`);
        });
        
        console.log('\n🎉 ¡Administradores de ejemplo agregados exitosamente!');
        console.log('\n🔑 Credenciales para pruebas:');
        console.log('   - admin@gimnasio.com / admin123 (Administrador principal)');
        console.log('   - maria.admin@gimnasio.com / maria123 (Administrador)');
        console.log('   - carlos.supervisor@gimnasio.com / carlos123 (Supervisor)');
        console.log('   - ana.empleado@gimnasio.com / ana123 (Empleado)');
        console.log('   - luis.admin@gimnasio.com / luis123 (Administrador)');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await closeConnection();
        console.log('🔌 Conexión cerrada');
    }
}

// Ejecutar la función
agregarAdministradoresEjemplo().catch(console.error); 