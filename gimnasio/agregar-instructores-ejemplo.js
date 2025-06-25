// Script para agregar instructores de ejemplo al sistema
const { connectToMongoDB } = require('./mongodb-config');

async function agregarInstructoresEjemplo() {
    let client;
    
    try {
        console.log('🔄 Conectando a MongoDB Atlas...');
        client = await connectToMongoDB('atlas');
        console.log('✅ Conectado a MongoDB Atlas');
        
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        // Datos de instructores de ejemplo
        const instructoresEjemplo = [
            {
                nombre: 'Carlos Rodríguez',
                especialidad: 'gym',
                email: 'carlos.rodriguez@gimnasio.com',
                telefono: '555-0101',
                celular: '555-123-4567',
                descripcion: 'Instructor certificado en musculación y fitness con 5 años de experiencia. Especialista en entrenamiento funcional y pérdida de peso.',
                foto: 'Imagenes/instructor-gym.jpg',
                contrato: 'contratos/carlos-rodriguez.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'María González',
                especialidad: 'zumba',
                email: 'maria.gonzalez@gimnasio.com',
                telefono: '555-0102',
                celular: '555-234-5678',
                descripcion: 'Instructora de Zumba certificada con especialidad en ritmos latinos. Más de 3 años de experiencia en clases grupales.',
                foto: 'Imagenes/instructor-zumba.jpg',
                contrato: 'contratos/maria-gonzalez.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'Roberto Silva',
                especialidad: 'crossfit',
                email: 'roberto.silva@gimnasio.com',
                telefono: '555-0103',
                celular: '555-345-6789',
                descripcion: 'Entrenador CrossFit nivel 2 con experiencia en competiciones. Especialista en entrenamiento de alta intensidad.',
                foto: 'Imagenes/instructor-crossfit.jpg',
                contrato: 'contratos/roberto-silva.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'Ana Martínez',
                especialidad: 'box',
                email: 'ana.martinez@gimnasio.com',
                telefono: '555-0104',
                celular: '555-456-7890',
                descripcion: 'Instructora de boxeo amateur con experiencia en defensa personal. Certificada en técnicas de combate.',
                foto: 'Imagenes/instructor-box.jpg',
                contrato: 'contratos/ana-martinez.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'Laura Fernández',
                especialidad: 'danza',
                email: 'laura.fernandez@gimnasio.com',
                telefono: '555-0105',
                celular: '555-567-8901',
                descripcion: 'Bailarina profesional especializada en danza aérea y telas. Más de 8 años de experiencia en artes circenses.',
                foto: 'Imagenes/instructor-danza.jpg',
                contrato: 'contratos/laura-fernandez.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'Miguel Torres',
                especialidad: 'gym',
                email: 'miguel.torres@gimnasio.com',
                telefono: '555-0106',
                celular: '555-678-9012',
                descripcion: 'Entrenador personal especializado en ganancia muscular y nutrición deportiva. Certificado en fisicoculturismo.',
                foto: 'Imagenes/instructor-gym2.jpg',
                contrato: 'contratos/miguel-torres.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'Carmen Ruiz',
                especialidad: 'zumba',
                email: 'carmen.ruiz@gimnasio.com',
                telefono: '555-0107',
                celular: '555-789-0123',
                descripcion: 'Instructora de Zumba Gold para adultos mayores. Especialista en rutinas de bajo impacto y rehabilitación.',
                foto: 'Imagenes/instructor-zumba2.jpg',
                contrato: 'contratos/carmen-ruiz.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nombre: 'Diego Morales',
                especialidad: 'crossfit',
                email: 'diego.morales@gimnasio.com',
                telefono: '555-0108',
                celular: '555-890-1234',
                descripcion: 'Entrenador CrossFit especializado en principiantes. Certificado en primeros auxilios y RCP.',
                foto: 'Imagenes/instructor-crossfit2.jpg',
                contrato: 'contratos/diego-morales.pdf',
                estado: 'activo',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        console.log('📝 Agregando instructores de ejemplo...');
        
        let instructoresAgregados = 0;
        let instructoresExistentes = 0;
        
        for (const instructor of instructoresEjemplo) {
            // Verificar si el instructor ya existe
            const instructorExistente = await instructoresCollection.findOne({ 
                email: instructor.email 
            });
            
            if (instructorExistente) {
                console.log(`⚠️ Instructor ya existe: ${instructor.nombre} (${instructor.email})`);
                instructoresExistentes++;
            } else {
                await instructoresCollection.insertOne(instructor);
                console.log(`✅ Instructor agregado: ${instructor.nombre} (${instructor.email})`);
                instructoresAgregados++;
            }
        }
        
        // Obtener estadísticas finales
        const totalInstructores = await instructoresCollection.countDocuments();
        
        console.log('\n📊 Resumen de instructores:');
        console.log(`   - Instructores agregados: ${instructoresAgregados}`);
        console.log(`   - Instructores existentes: ${instructoresExistentes}`);
        console.log(`   - Total en la base de datos: ${totalInstructores}`);
        
        console.log('\n🎉 ¡Instructores de ejemplo agregados exitosamente!');
        
        console.log('\n📋 Lista de instructores disponibles:');
        const todosInstructores = await instructoresCollection.find({}).toArray();
        todosInstructores.forEach((instructor, index) => {
            console.log(`   ${index + 1}. ${instructor.nombre} - ${instructor.especialidad} (${instructor.email})`);
        });
        
    } catch (error) {
        console.error('❌ Error al agregar instructores de ejemplo:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar el script
if (require.main === module) {
    agregarInstructoresEjemplo();
}

module.exports = { agregarInstructoresEjemplo }; 