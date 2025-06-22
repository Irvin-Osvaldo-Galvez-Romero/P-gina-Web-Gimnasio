# Sistema de Gestión de Gimnasio

Una aplicación web completa para la gestión de un gimnasio, desarrollada con HTML, CSS y JavaScript vanilla, con MongoDB como base de datos.

## 🏋️ Características Principales

### 🔐 Sistema de Autenticación
- Login seguro con validación de credenciales
- Interfaz moderna con fondo personalizable
- Autenticación basada en MongoDB

### 📊 Dashboard
- Estadísticas en tiempo real
- Tarjetas interactivas con totales de:
  - Clientes registrados
  - Ventas del día
  - Productos en stock
- Gráficas dinámicas con Chart.js

### 👥 Gestión de Clientes
- CRUD completo de clientes
- Campos: ID, Nombre, Apellidos, Email, Edad, Enfermedad Crónica, Alergia, Tipo de Membresía, Dirección
- Sistema de alertas automáticas para membresías próximas a vencer
- Buscador en tiempo real
- Diferentes tipos de membresía (Básica, Premium, Familiar)

### 🛒 Sistema de Ventas
- Punto de venta intuitivo
- Carrito de compras dinámico
- Gestión automática de inventario
- Cálculo automático de totales
- Imágenes de productos

### 📦 Gestión de Productos
- CRUD completo de productos
- Campos: ID, Nombre, Precio, Stock, Categoría, Descripción, Imagen
- Control de inventario automático
- Buscador de productos
- Carga de imágenes de productos

### 👨‍💼 Gestión de Administradores
- CRUD completo de administradores
- Campos: ID, Nombre, Email, Rol
- Buscador de administradores

### 📈 Reportes
- Ventas mensuales
- Reporte de membresías activas
- Ingresos mensuales (membresías + ventas)
- Gráficas de barras y pastel
- Estadísticas detalladas

## 🗄️ Base de Datos MongoDB

### 🍃 MongoDB Atlas (Producción)
- Base de datos NoSQL en la nube
- Escalabilidad automática
- Backup automático
- Monitoreo en tiempo real

### 📊 Estructura de la Base de Datos

#### Colecciones creadas:
1. **clientes** - Información de los miembros del gimnasio
2. **productos** - Inventario de productos y suplementos
3. **ventas** - Registro de todas las transacciones
4. **membresias** - Tipos de membresías disponibles
5. **usuarios** - Administradores y personal
6. **configuracion** - Configuración del sistema

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Node.js (para MongoDB)
- MongoDB Atlas (recomendado) o MongoDB local

### Instalación Rápida

1. **Clona o descarga el proyecto**
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:**
   ```bash
   copy env.example .env
   ```
4. **Crea las bases de datos:**
   ```bash
   node crear-bases-datos.js
   ```
5. **Prueba la conexión:**
   ```bash
   npm run mongodb:test -- --atlas
   ```
6. **Abre la aplicación:**
   ```bash
   npm start
   ```

### Configuración de MongoDB Atlas

1. Crea cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Configura usuario y red
4. Obtén el string de conexión
5. Agrega a tu archivo `.env`

### Configuración
1. Abre `index.html` en tu navegador
2. Usa las credenciales por defecto:
   - **Email:** `admin@gimnasio.com`
   - **Contraseña:** `admin123`

## 🗄️ Configuración de Base de Datos

### Archivos de Configuración
- `mongodb-config.js` - Configuración principal de MongoDB
- `mongodb-test.js` - Pruebas de conexión
- `crear-bases-datos.js` - Script para crear la estructura de la BD

### Comandos Útiles
```bash
# Probar conexión local
npm run mongodb:test

# Probar conexión Atlas
npm run mongodb:test -- --atlas

# Ver configuración
npm run mongodb:test -- --config

# Crear bases de datos
node crear-bases-datos.js
```

### Variables de Entorno (.env)
```env
# MongoDB Local
MONGODB_LOCAL_URI=mongodb://localhost:27017/gimnasio_db

# MongoDB Atlas
MONGODB_ATLAS_URI=mongodb+srv://usuario:password@cluster.mongodb.net/gimnasio_db

# Entorno
NODE_ENV=development
```

## 🎨 Características de Diseño

### Interfaz Moderna
- Diseño responsive que se adapta a diferentes tamaños de pantalla
- Gradientes y efectos visuales atractivos
- Iconos de Font Awesome
- Animaciones suaves y transiciones

### Experiencia de Usuario
- Navegación intuitiva entre secciones
- Alertas y notificaciones informativas
- Modales para formularios
- Búsquedas en tiempo real
- Confirmaciones para acciones importantes

### Colores y Temas
- Paleta de colores profesional
- Gradientes azules para elementos principales
- Verde para elementos positivos
- Amarillo para advertencias
- Rojo para errores y eliminaciones

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Desktop:** Pantallas grandes con navegación horizontal
- **Tablet:** Adaptación automática de layouts
- **Mobile:** Navegación vertical y elementos táctiles

## 🔧 Funcionalidades Técnicas

### Almacenamiento
- **MongoDB Atlas:** Base de datos NoSQL en la nube
- **MongoDB Local:** Para desarrollo local
- **localStorage:** Almacenamiento local del navegador (fallback)

### Validaciones
- Validación de formularios en tiempo real
- Verificación de campos obligatorios
- Prevención de duplicados
- Validación de tipos de datos

### Alertas y Notificaciones
- Sistema de alertas automáticas para membresías
- Notificaciones de éxito y error
- Confirmaciones para acciones destructivas

## 🚀 Funcionalidades Avanzadas

### Sistema de Membresías
- Cálculo automático de fechas de vencimiento
- Alertas una semana antes del vencimiento
- Alertas cuando la membresía ha expirado
- Diferentes tipos de membresía con precios variables

### Gestión de Inventario
- Control automático de stock
- Prevención de ventas sin stock
- Actualización en tiempo real del inventario

### Reportes Inteligentes
- Cálculo automático de estadísticas
- Gráficas interactivas
- Filtros por período
- Exportación de datos

## 🔒 Seguridad

### Autenticación
- Sistema de login basado en MongoDB
- Sesiones persistentes
- Logout seguro

### Validación de Datos
- Sanitización de entradas
- Validación de tipos
- Prevención de inyección de código

## 📊 Estructura de Datos

### Cliente
```javascript
{
  _id: ObjectId,
  nombre: "Juan",
  apellidos: "Pérez García",
  email: "juan.perez@email.com",
  edad: 28,
  enfermedadCronica: "Ninguna",
  alergia: "Ninguna",
  tipoMembresia: "Premium",
  direccion: "Calle Principal 123, Ciudad",
  fechaInicio: Date,
  fechaFin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Producto
```javascript
{
  _id: ObjectId,
  nombre: "Proteína Whey",
  precio: 45.99,
  stock: 50,
  categoria: "Suplementos",
  descripcion: "Proteína de suero de leche de alta calidad",
  imagen: "proteina-whey.jpg",
  createdAt: Date,
  updatedAt: Date
}
```

### Venta
```javascript
{
  _id: ObjectId,
  fecha: Date,
  items: [...],
  total: 125.50,
  createdAt: Date
}
```

## 🎯 Próximos Pasos

1. **Configurar MongoDB Atlas** con tu string de conexión
2. **Ejecutar el script de creación de bases de datos**
3. **Probar la conexión** con `npm run mongodb:test -- --atlas`
4. **Iniciar la aplicación** con `npm start`
5. **Personalizar** la configuración según tus necesidades

## 🔗 Enlaces Útiles

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Node.js](https://nodejs.org/)

## 📞 Soporte

Si tienes problemas durante la instalación:

1. **Verifica la conexión a MongoDB Atlas**
2. **Revisa las variables de entorno en `.env`**
3. **Ejecuta las pruebas de conexión**
4. **Consulta la documentación de MongoDB**

---

¡Tu sistema de gimnasio está listo para usar con MongoDB! 🎉 