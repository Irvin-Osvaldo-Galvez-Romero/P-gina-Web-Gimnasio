# 🚀 Instalación Rápida - Sistema de Gimnasio

## ⚡ Instalación en 5 minutos

### Opción 1: Instalación Directa (Recomendada)

1. **Descarga los archivos**
   - Asegúrate de tener todos los archivos en tu carpeta del proyecto
   - Verifica que las imágenes estén en la carpeta `Imagenes/`

2. **Abre la aplicación**
   ```bash
   # Simplemente abre index.html en tu navegador
   # O usa un servidor local:
   python -m http.server 8000
   # Luego ve a http://localhost:8000
   ```

3. **Inicia sesión**
   - Usuario: `admin`
   - Contraseña: `admin123`

### Opción 2: Con Node.js (Para desarrollo)

1. **Instala Node.js**
   - Descarga desde: https://nodejs.org/
   - Versión recomendada: 16.x o superior

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor**
   ```bash
   npm start
   # O para desarrollo con recarga automática:
   npm run dev
   ```

4. **Abre en el navegador**
   - Ve a: http://localhost:8080

## 🔧 Configuración Inicial

### 1. Verificar Imágenes
Asegúrate de que tienes estos archivos en la carpeta `Imagenes/`:
- ✅ `1.jpg` - Fondo del login
- ✅ `2.jpg` - Fondo de las vistas principales
- ✅ `Logo.png` - Logo del gimnasio

### 2. Datos de Prueba
La aplicación incluye datos de ejemplo:
- **Clientes:** Juan Pérez, María García
- **Productos:** Proteína, Creatina, BCAA
- **Administrador:** Admin Principal

### 3. Credenciales de Acceso
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 🌐 Conexión a la Nube (Firebase)

### Configuración Básica

1. **Crea un proyecto en Firebase**
   - Ve a: https://console.firebase.google.com/
   - Crea un nuevo proyecto

2. **Habilita servicios**
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

3. **Configura credenciales**
   - Edita `firebase-config.js`
   - Reemplaza las credenciales de ejemplo

4. **Actualiza el HTML**
   - Descomenta las líneas de Firebase en `index.html`

### Configuración Avanzada

Ver el archivo `firebase-config.js` para instrucciones detalladas.

## 📱 Prueba de Funcionalidades

### Dashboard
- ✅ Ver estadísticas en tiempo real
- ✅ Hacer clic en las tarjetas para navegar

### Clientes
- ✅ Agregar nuevo cliente
- ✅ Editar cliente existente
- ✅ Buscar clientes
- ✅ Ver alertas de membresías

### Ventas
- ✅ Agregar productos al carrito
- ✅ Procesar venta
- ✅ Ver actualización de inventario

### Productos
- ✅ Agregar nuevo producto
- ✅ Subir imagen de producto
- ✅ Control de inventario

### Reportes
- ✅ Ver gráficas de ventas
- ✅ Estadísticas de membresías
- ✅ Ingresos mensuales

## 🛠️ Solución de Problemas

### Error: "No se pueden cargar las imágenes"
- Verifica que las imágenes estén en la carpeta `Imagenes/`
- Asegúrate de que los nombres coincidan exactamente

### Error: "No se guardan los datos"
- Verifica que el navegador tenga habilitado localStorage
- Intenta en modo incógnito

### Error: "No funciona el login"
- Usa las credenciales exactas: `admin` / `admin123`
- Verifica que no haya espacios extra

### Error: "No se muestran las gráficas"
- Verifica la conexión a internet (Chart.js se carga desde CDN)
- Revisa la consola del navegador para errores

## 🔄 Actualización de Datos

### Restablecer Datos de Ejemplo
```javascript
// En la consola del navegador:
localStorage.clear();
location.reload();
```

### Exportar Datos
```javascript
// En la consola del navegador:
console.log(JSON.stringify({
    clientes: JSON.parse(localStorage.getItem('clientes')),
    productos: JSON.parse(localStorage.getItem('productos')),
    ventas: JSON.parse(localStorage.getItem('ventas'))
}));
```

## 📞 Soporte

### Antes de pedir ayuda:
1. ✅ Verifica que todos los archivos estén presentes
2. ✅ Confirma que las imágenes estén en su lugar
3. ✅ Revisa la consola del navegador (F12)
4. ✅ Intenta en un navegador diferente

### Información útil para reportar problemas:
- Navegador y versión
- Sistema operativo
- Mensajes de error de la consola
- Pasos para reproducir el problema

## 🎯 Próximos Pasos

1. **Personaliza la aplicación**
   - Cambia colores en `styles.css`
   - Modifica el logo y fondos
   - Ajusta precios de membresías

2. **Conecta a Firebase**
   - Sigue las instrucciones en `firebase-config.js`
   - Configura autenticación real
   - Migra datos a la nube

3. **Despliega en producción**
   - Usa Firebase Hosting
   - O cualquier servicio de hosting web
   - Configura dominio personalizado

---

**¡Tu sistema de gimnasio está listo para usar! 🏋️‍♂️** 