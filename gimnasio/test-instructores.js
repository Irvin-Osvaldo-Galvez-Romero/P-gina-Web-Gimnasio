const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');

async function testInstructoresAPI() {
    try {
        console.log('🧪 Probando API de instructores...');
        
        // Test 1: GET instructores
        console.log('\n1. Probando GET /api/instructores');
        const getResponse = await fetch('http://localhost:3000/api/instructores');
        console.log('Status:', getResponse.status);
        if (getResponse.ok) {
            const instructores = await getResponse.json();
            console.log('✅ GET exitoso. Instructores encontrados:', instructores.length);
        } else {
            console.log('❌ GET falló');
        }
        
        // Test 2: POST instructor
        console.log('\n2. Probando POST /api/instructores');
        const formData = new FormData();
        formData.append('nombre', 'Test Instructor');
        formData.append('especialidad', 'gym');
        formData.append('email', 'test@test.com');
        formData.append('telefono', '123-456-7890');
        formData.append('celular', '098-765-4321');
        formData.append('descripcion', 'Test description');
        
        const postResponse = await fetch('http://localhost:3000/api/instructores', {
            method: 'POST',
            body: formData
        });
        
        console.log('Status:', postResponse.status);
        if (postResponse.ok) {
            const result = await postResponse.json();
            console.log('✅ POST exitoso. Instructor creado:', result._id);
        } else {
            const error = await postResponse.text();
            console.log('❌ POST falló:', error);
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
    }
}

testInstructoresAPI(); 