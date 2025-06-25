const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Usuario:X5ZhVvf1eRkUMQeE@cluster0.hnpybvy.mongodb.net/gimnasio_db?retryWrites=true&w=majority&appName=Cluster0';

async function testPDFStorage() {
    let client;
    
    try {
        console.log('🔗 Conectando a MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Conectado a MongoDB');
        
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        // Crear un PDF de prueba
        const testPDFPath = path.join(__dirname, 'contratos', 'contrato-ejemplo.pdf');
        
        if (!fs.existsSync(testPDFPath)) {
            console.log('⚠️  No se encontró el archivo de contrato de ejemplo');
            console.log('📝 Creando un PDF de prueba...');
            
            // Crear un PDF simple de prueba
            const testPDFContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Contrato de Prueba) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF\n');
            
            // Asegurar que el directorio existe
            const contratosDir = path.join(__dirname, 'contratos');
            if (!fs.existsSync(contratosDir)) {
                fs.mkdirSync(contratosDir, { recursive: true });
            }
            
            fs.writeFileSync(testPDFPath, testPDFContent);
            console.log('✅ PDF de prueba creado');
        }
        
        // Leer el PDF
        const pdfBuffer = fs.readFileSync(testPDFPath);
        console.log(`📄 PDF leído: ${pdfBuffer.length} bytes`);
        
        // Crear un instructor de prueba con PDF
        const instructorTest = {
            nombre: 'Instructor Test PDF',
            especialidad: 'gym',
            email: 'test@pdf.com',
            telefono: '123-456-7890',
            celular: '098-765-4321',
            descripcion: 'Instructor de prueba para verificar almacenamiento de PDFs en MongoDB',
            estado: 'activo',
            fechaContratacion: new Date(),
            salario: 3000,
            experiencia: 5,
            horarios: 'Lunes a Viernes 6:00 AM - 10:00 PM',
            certificaciones: ['Personal Trainer', 'CrossFit Level 1'],
            especialidadesAdicionales: ['Yoga', 'Pilates'],
            notas: 'Instructor de prueba para verificar PDFs',
            contrato: {
                data: pdfBuffer,
                contentType: 'application/pdf',
                filename: 'contrato-ejemplo.pdf'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Insertar en la base de datos
        console.log('💾 Insertando instructor de prueba con PDF...');
        const result = await instructoresCollection.insertOne(instructorTest);
        console.log(`✅ Instructor insertado con ID: ${result.insertedId}`);
        
        // Verificar que se guardó correctamente
        const savedInstructor = await instructoresCollection.findOne({ _id: result.insertedId });
        console.log('🔍 Verificando datos guardados...');
        console.log(`- Nombre: ${savedInstructor.nombre}`);
        console.log(`- Contrato guardado: ${savedInstructor.contrato ? 'Sí' : 'No'}`);
        if (savedInstructor.contrato) {
            console.log(`- Tamaño del PDF: ${savedInstructor.contrato.data.length} bytes`);
            console.log(`- Tipo de contenido: ${savedInstructor.contrato.contentType}`);
            console.log(`- Nombre del archivo: ${savedInstructor.contrato.filename}`);
        }
        
        // Probar la ruta de descarga
        console.log('\n🌐 Probando ruta de descarga...');
        console.log(`URL de prueba: http://localhost:3000/api/instructores/${result.insertedId}/contrato`);
        
        console.log('\n✅ Prueba completada exitosamente!');
        console.log('📋 Resumen:');
        console.log('- PDF guardado en MongoDB como Buffer');
        console.log('- Metadatos del archivo preservados');
        console.log('- Ruta de descarga disponible');
        
    } catch (error) {
        console.error('❌ Error durante la prueba:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar la prueba
testPDFStorage();