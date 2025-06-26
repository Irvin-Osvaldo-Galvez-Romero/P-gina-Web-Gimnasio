#!/usr/bin/env node

/**
 * Script de verificación para despliegue del backend
 * Verifica que todos los archivos necesarios estén presentes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando archivos para despliegue del backend...\n');

// Archivos requeridos para el despliegue
const requiredFiles = [
    'package.json',
    'server.js',
    'mongodb-config.js',
    'render.yaml'
];

// Verificar archivos requeridos
let allFilesPresent = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} - Presente`);
    } else {
        console.log(`❌ ${file} - FALTANTE`);
        allFilesPresent = false;
    }
});

// Verificar package.json
if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    console.log('\n📦 Verificando package.json:');
    console.log(`   - Nombre: ${packageJson.name}`);
    console.log(`   - Script start: ${packageJson.scripts.start}`);
    console.log(`   - Dependencias principales:`);
    
    const mainDeps = ['express', 'mongodb', 'cors', 'dotenv'];
    mainDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`     ✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`     ❌ ${dep}: FALTANTE`);
            allFilesPresent = false;
        }
    });
}

// Verificar variables de entorno
console.log('\n🌍 Variables de entorno necesarias:');
console.log('   - MONGODB_URI (configurar en Render)');
console.log('   - NODE_ENV=production');
console.log('   - PORT=10000');

// Verificar configuración de CORS
if (fs.existsSync('server.js')) {
    const serverContent = fs.readFileSync('server.js', 'utf8');
    if (serverContent.includes('cors()')) {
        console.log('\n✅ CORS configurado correctamente');
    } else {
        console.log('\n❌ CORS no está configurado');
        allFilesPresent = false;
    }
}

console.log('\n📋 Pasos para desplegar:');
console.log('1. Ve a https://render.com');
console.log('2. Crea una cuenta');
console.log('3. Haz clic en "New" → "Web Service"');
console.log('4. Conecta tu repositorio o sube los archivos');
console.log('5. Configura las variables de entorno:');
console.log('   - MONGODB_URI: tu URI de MongoDB Atlas');
console.log('   - NODE_ENV: production');
console.log('   - PORT: 10000');
console.log('6. Build Command: npm install');
console.log('7. Start Command: npm start');

if (allFilesPresent) {
    console.log('\n🎉 ¡Todo listo para el despliegue!');
} else {
    console.log('\n⚠️  Hay archivos faltantes. Revisa los errores arriba.');
}

console.log('\n🔗 URLs importantes:');
console.log('- MongoDB Atlas: https://cloud.mongodb.com');
console.log('- Render: https://render.com');
console.log('- Netlify: https://app.netlify.com'); 