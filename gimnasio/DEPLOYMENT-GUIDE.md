# 🚀 Guía de Despliegue Completo - Sistema de Gimnasio

## 📋 Resumen del Sistema
- **Frontend**: HTML, CSS, JavaScript (Netlify)
- **Backend**: Node.js + Express (Render)
- **Base de Datos**: MongoDB Atlas

---

## 🔧 PASO 1: Configurar MongoDB Atlas

### 1.1 Crear cuenta en MongoDB Atlas
1. Ve a [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

### 1.2 Crear Cluster
1. Haz clic en "Build a Database"
2. Selecciona "FREE" tier (M0)
3. Elige tu proveedor de nube (AWS, Google Cloud, Azure)
4. Selecciona una región cercana
5. Haz clic en "Create"

### 1.3 Configurar Acceso
1. **Crear Usuario de Base de Datos:**
   - Username: `gimnasio_user`
   - Password: `TuContraseñaSegura123!`
   - Haz clic en "Create User"

2. **Configurar Acceso de Red:**
   - Ve a "Network Access"
   - Haz clic en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - Haz clic en "Confirm"

### 1.4 Obtener URI de Conexión
1. Ve a "Database" → "Connect"
2. Selecciona "Connect your application"
3. Copia la URI que aparece
4. **Reemplaza `<password>` con tu contraseña real**

**Ejemplo de URI:**
```
mongodb+srv://gimnasio_user:TuContraseñaSegura123!@cluster0.xxxxx.mongodb.net/gimnasio?retryWrites=true&w=majority
```

---

## 🌐 PASO 2: Desplegar Backend en Render

### 2.1 Crear cuenta en Render
1. Ve a [https://render.com](https://render.com)
2. Crea una cuenta (puedes usar GitHub)

### 2.2 Conectar Repositorio
1. Haz clic en "New" → "Web Service"
2. Conecta tu repositorio de GitHub (si no tienes uno, sube los archivos manualmente)
3. O usa "Deploy from existing code"

### 2.3 Configurar el Servicio
- **Name**: `gimnasio-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 2.4 Configurar Variables de Entorno
En la sección "Environment Variables":
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://gimnasio_user:TuContraseñaSegura123!@cluster0.xxxxx.mongodb.net/gimnasio?retryWrites=true&w=majority`

- **Key**: `NODE_ENV`
- **Value**: `production`

- **Key**: `PORT`
- **Value**: `10000`

### 2.5 Desplegar
1. Haz clic en "Create Web Service"
2. Espera a que termine el despliegue
3. Copia la URL que te da Render (ejemplo: `https://gimnasio-backend.onrender.com`)

---

## 🎨 PASO 3: Configurar Frontend

### 3.1 Actualizar URL del Backend
1. Abre el archivo `dist/config.js`
2. Cambia la URL de producción:
```javascript
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000'  // Desarrollo local
    : 'https://tu-backend-en-render.onrender.com';  // CAMBIA ESTA URL
```

### 3.2 Desplegar en Netlify
1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Crea una cuenta
3. Haz clic en "Add new site" → "Deploy manually"
4. Arrastra la carpeta `dist` al área de despliegue
5. Espera a que termine el despliegue
6. Copia la URL que te da Netlify

---

## 🔗 PASO 4: Probar el Sistema

### 4.1 Verificar Conexiones
1. Abre tu sitio en Netlify
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Console"
4. Verifica que no hay errores de conexión

### 4.2 Probar Funcionalidades
1. **Login**: Usa las credenciales por defecto
2. **Crear Cliente**: Verifica que se guarda en MongoDB
3. **Ver Dashboard**: Confirma que los datos se cargan

---

## 🛠️ Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola:
1. Verifica que el backend esté corriendo en Render
2. Confirma que la URL en `config.js` sea correcta
3. Asegúrate de que el backend tenga CORS configurado

### Error de Conexión a MongoDB
1. Verifica que la URI de MongoDB sea correcta
2. Confirma que el usuario y contraseña sean correctos
3. Verifica que el acceso desde cualquier IP esté habilitado

### Error 404 en el Frontend
1. Verifica que todos los archivos estén en la carpeta `dist`
2. Confirma que `index.html` esté en la raíz de `dist`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render (sección "Logs")
2. Verifica la consola del navegador
3. Confirma que todas las URLs sean correctas

---

## 🎉 ¡Listo!

Tu sistema completo estará funcionando con:
- ✅ Frontend en Netlify
- ✅ Backend en Render  
- ✅ Base de datos en MongoDB Atlas
- ✅ Conexiones seguras entre todos los componentes 