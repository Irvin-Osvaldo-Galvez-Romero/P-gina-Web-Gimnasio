const express = require('express');
const cors = require('cors');
const path = require('path');
const {
    connectToMongoDB,
    getCollection,
    closeConnection,
    getDatabase,
    crearProducto,
    obtenerProductos
} = require('./mongodb-config');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Variable global para mantener la conexión
let mongoClient = null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Servir archivos estáticos desde la carpeta 'public' y 'Imagenes'
app.use(express.static(path.join(__dirname, 'public')));

// Crear carpetas si no existen
const imagenesDir = path.join(__dirname, 'Imagenes');
const contratosDir = path.join(__dirname, 'contratos');
if (!fs.existsSync(imagenesDir)) fs.mkdirSync(imagenesDir, { recursive: true });
if (!fs.existsSync(contratosDir)) fs.mkdirSync(contratosDir, { recursive: true });

// Configuración de Multer para almacenamiento en disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, contratosDir);
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, imagenesDir);
        } else {
            cb(new Error('Tipo de archivo no permitido'), null);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, base + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB límite
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes y PDFs'), false);
        }
    }
});

// Función para obtener conexión a MongoDB
async function getMongoConnection() {
    try {
        if (!mongoClient || !mongoClient.topology || !mongoClient.topology.isConnected()) {
            console.log('🔄 Conectando a MongoDB Atlas...');
            mongoClient = await connectToMongoDB('atlas');
        }
        return mongoClient;
    } catch (error) {
        console.error('❌ Error en getMongoConnection:', error);
        throw error;
    }
}

// Función para generar ID personalizado
async function generarIdPersonalizado(collection, prefix) {
    const client = await getMongoConnection();
    const db = client.db();
    const configCollection = db.collection('configuracion');
    
    // Obtener el último número usado
    const config = await configCollection.findOne({ tipo: `${prefix}_counter` });
    let ultimoNumero = config ? config.ultimoNumero : 0;
    
    // Incrementar el número
    ultimoNumero++;
    
    // Actualizar el contador
    await configCollection.updateOne(
        { tipo: `${prefix}_counter` },
        { $set: { ultimoNumero: ultimoNumero } },
        { upsert: true }
    );
    
    // Generar ID con formato: C001, P001, A001, etc.
    return `${prefix}${ultimoNumero.toString().padStart(3, '0')}`;
}

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API de autenticación
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }
        
        console.log('🔐 Intentando login para:', email);
        
        // Conectar a MongoDB
        const client = await getMongoConnection();
        const db = client.db();
        const usuariosCollection = db.collection('usuarios');
        
        // Buscar usuario
        const usuario = await usuariosCollection.findOne({ email: email });
        
        if (!usuario) {
            console.log('❌ Usuario no encontrado:', email);
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        
        // Verificar contraseña (en producción debería estar hasheada)
        if (usuario.password !== password) {
            console.log('❌ Contraseña incorrecta para:', email);
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        
        console.log('✅ Login exitoso para:', email);
        
        // Usuario autenticado exitosamente
        const userData = {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };
        
        res.json(userData);
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
});

// API para obtener datos del dashboard
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        
        const clientesCollection = db.collection('clientes');
        const productosCollection = db.collection('productos');
        const ventasCollection = db.collection('ventas');
        
        const totalClientes = await clientesCollection.countDocuments();
        const totalProductos = await productosCollection.countDocuments();
        
        // Calcular stock total
        const productos = await productosCollection.find({}).toArray();
        const stockTotal = productos.reduce((sum, producto) => sum + (parseInt(producto.stock) || 0), 0);
        
        // Productos con stock bajo (menos de 10)
        const productosStockBajo = productos.filter(producto => (parseInt(producto.stock) || 0) < 10).length;
        
        // Ventas del día
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ventasHoy = await ventasCollection.find({
            fecha: { $gte: today }
        }).toArray();
        
        const ventasDia = ventasHoy.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
        
        res.json({
            totalClientes,
            totalProductos,
            stockTotal,
            productosStockBajo,
            ventasDia
        });
        
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para obtener datos de ventas semanales para la gráfica
app.get('/api/dashboard/ventas-semanales', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const ventasCollection = db.collection('ventas');

        const labels = [];
        const data = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const ventasDia = await ventasCollection.find({
                fecha: {
                    $gte: date,
                    $lt: nextDay
                }
            }).toArray();

            const totalVentas = ventasDia.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
            
            labels.push(`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`);
            data.push(totalVentas);
        }

        res.json({ labels, data });

    } catch (error) {
        console.error('Error obteniendo datos de ventas semanales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API consolidada para todos los datos de Reportes
app.get('/api/reportes/all', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const ventasCollection = db.collection('ventas');
        const clientesCollection = db.collection('clientes');

        // 1. Card Stats
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        const ventasMes = await ventasCollection.find({
            fecha: { $gte: startOfMonth, $lte: endOfMonth }
        }).toArray();
        
        const ingresosMensuales = ventasMes.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
        const ventasMensualesCount = ventasMes.length;

        // Cambiar el cálculo de membresías activas para que use la misma lógica que el historial
        // (clientes con más de 7 días restantes)
        const clientes = await clientesCollection.find({}).toArray();
        
        const membresiasActivas = clientes.filter(cliente => {
            const fechaFin = new Date(cliente.fechaFin);
            const diasRestantes = Math.ceil((fechaFin - today) / (1000 * 60 * 60 * 24));
            return diasRestantes > 7; // Más de 7 días restantes = ACTIVA
        }).length;

        const cardStats = {
            ventasMensuales: ventasMensualesCount,
            ingresosMensuales,
            membresiasActivas
        };
        
        // 2. Monthly Sales Chart
        const monthlyLabels = [];
        const monthlyData = [];
        const currentYear = today.getFullYear();
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        for (let month = 0; month < 12; month++) {
            const startDate = new Date(currentYear, month, 1);
            const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);

            const ventasDelMes = await ventasCollection.find({
                fecha: { $gte: startDate, $lte: endDate }
            }).toArray();

            const totalVentasMes = ventasDelMes.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
            
            monthlyLabels.push(monthNames[month]);
            monthlyData.push(totalVentasMes);
        }
        const monthlyChartData = { labels: monthlyLabels, data: monthlyData };

        // 3. Membership Sales Chart
        const membresias = await clientesCollection.aggregate([
            { $group: { _id: '$tipoMembresia', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        const membershipLabels = membresias.map(m => m._id || 'Sin especificar');
        const membershipData = membresias.map(m => m.count);
        const membershipChartData = { labels: membershipLabels, data: membershipData };

        // 4. Send all data
        res.json({
            cardStats,
            monthlyChartData,
            membershipChartData
        });

    } catch (error) {
        console.error('Error obteniendo datos de reportes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        const clientes = await clientesCollection.find({}).toArray();
        res.json(clientes);
    } catch (error) {
        console.error('Error obteniendo clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/clientes', async (req, res) => {
    try {
        console.log('📝 Creando nuevo cliente...');
        
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        // Generar ID personalizado
        const idPersonalizado = await generarIdPersonalizado('clientes', 'C');
        console.log('🆔 ID generado:', idPersonalizado);
        
        const nuevoCliente = {
            id: idPersonalizado,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            edad: req.body.edad,
            enfermedadCronica: req.body.enfermedadCronica,
            alergia: req.body.alergia,
            tipoMembresia: req.body.tipoMembresia,
            direccion: req.body.direccion,
            fechaInicio: req.body.fechaInicio,
            fechaFin: req.body.fechaFin,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('📋 Datos del cliente:', nuevoCliente);
        
        const result = await clientesCollection.insertOne(nuevoCliente);
        console.log('✅ Cliente creado con éxito');
        
        res.json({ _id: result.insertedId, ...nuevoCliente });
    } catch (error) {
        console.error('❌ Error creando cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
});

// Actualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        const { id } = req.params;
        
        // Crear objeto de actualización solo con los campos que se envían
        const updateData = {};
        
        // Solo agregar campos que no sean null, undefined o vacíos
        if (req.body.nombre !== null && req.body.nombre !== undefined && req.body.nombre !== '') {
            updateData.nombre = req.body.nombre;
        }
        if (req.body.apellidos !== null && req.body.apellidos !== undefined && req.body.apellidos !== '') {
            updateData.apellidos = req.body.apellidos;
        }
        if (req.body.edad !== null && req.body.edad !== undefined && req.body.edad !== '') {
            updateData.edad = req.body.edad;
        }
        if (req.body.enfermedadCronica !== null && req.body.enfermedadCronica !== undefined && req.body.enfermedadCronica !== '') {
            updateData.enfermedadCronica = req.body.enfermedadCronica;
        }
        if (req.body.alergia !== null && req.body.alergia !== undefined && req.body.alergia !== '') {
            updateData.alergia = req.body.alergia;
        }
        if (req.body.tipoMembresia !== null && req.body.tipoMembresia !== undefined && req.body.tipoMembresia !== '') {
            updateData.tipoMembresia = req.body.tipoMembresia;
        }
        if (req.body.direccion !== null && req.body.direccion !== undefined && req.body.direccion !== '') {
            updateData.direccion = req.body.direccion;
        }
        if (req.body.fechaInicio !== null && req.body.fechaInicio !== undefined && req.body.fechaInicio !== '') {
            updateData.fechaInicio = req.body.fechaInicio;
        }
        if (req.body.fechaFin !== null && req.body.fechaFin !== undefined && req.body.fechaFin !== '') {
            updateData.fechaFin = req.body.fechaFin;
        }
        
        // Siempre actualizar la fecha de modificación
        updateData.updatedAt = new Date();
        
        console.log('📝 Datos a actualizar:', updateData);
        
        // Buscar por id personalizado o _id de MongoDB
        let result;
        
        // Primero intentar buscar por id personalizado (como "001")
        result = await clientesCollection.updateOne(
            { id: id },
            { $set: updateData }
        );
        
        if (result.modifiedCount === 0) {
            // Si no se encontró por id personalizado, intentar por ObjectId
            try {
                const { ObjectId } = require('mongodb');
                result = await clientesCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );
            } catch (error) {
                console.log('⚠️ No es un ObjectId válido:', id);
            }
        }
        
        if (result.modifiedCount > 0) {
            console.log('✅ Cliente actualizado correctamente');
            res.json({ message: 'Cliente actualizado correctamente' });
        } else {
            console.log('⚠️ Cliente no encontrado o no se modificó');
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error actualizando cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar cliente
app.delete('/api/clientes/:id', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        const { id } = req.params;
        
        console.log('🗑️ Intentando eliminar cliente con ID:', id);
        
        // Buscar por id personalizado o _id de MongoDB
        let result;
        
        // Primero intentar buscar por id personalizado (como "001")
        result = await clientesCollection.deleteOne({ id: id });
        
        if (result.deletedCount === 0) {
            // Si no se encontró por id personalizado, intentar por ObjectId
            try {
                const { ObjectId } = require('mongodb');
                result = await clientesCollection.deleteOne({ _id: new ObjectId(id) });
            } catch (error) {
                console.log('⚠️ No es un ObjectId válido:', id);
            }
        }
        
        if (result.deletedCount > 0) {
            console.log('✅ Cliente eliminado correctamente');
            res.json({ message: 'Cliente eliminado correctamente' });
        } else {
            console.log('⚠️ Cliente no encontrado para eliminar');
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error eliminando cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para productos
app.get('/api/productos', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const productosCollection = db.collection('productos');
        const productos = await productosCollection.find({}).toArray();
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/productos', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        
        const datosProducto = {
            nombre,
            precio: parseFloat(precio),
            stock: parseInt(stock),
            // Si hay un archivo, guarda su ruta, si no, usa el logo por defecto
            imagen: req.file ? `Imagenes/${req.file.filename}` : 'Imagenes/Logo2.png'
        };

        const nuevoProducto = await crearProducto(datosProducto);
        res.status(201).json(nuevoProducto);

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear producto' });
    }
});

app.put('/api/productos/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock } = req.body;

        const datosActualizados = {
            nombre,
            precio: parseFloat(precio),
            stock: parseInt(stock)
        };
        
        // Si se sube una nueva imagen, añadirla a los datos a actualizar
        if (req.file) {
            datosActualizados.imagen = `Imagenes/${req.file.filename}`;
        }

        const productoActualizado = await obtenerProductos(id, datosActualizados);

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(productoActualizado);

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar producto' });
    }
});

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const productosCollection = db.collection('productos');
        
        const { id } = req.params;
        
        // Buscar por id personalizado o _id de MongoDB
        let result;
        try {
            const { ObjectId } = require('mongodb');
            result = await productosCollection.deleteOne({ _id: new ObjectId(id) });
        } catch (error) {
            // Si falla la conversión, buscar por id personalizado
            result = await productosCollection.deleteOne({ id: id });
        }
        
        if (result.deletedCount > 0) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para administradores
app.get('/api/administradores', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const usuariosCollection = db.collection('usuarios');
        const administradores = await usuariosCollection.find({}).toArray();
        res.json(administradores);
    } catch (error) {
        console.error('Error obteniendo administradores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/administradores', async (req, res) => {
    try {
        console.log('👨‍💼 Creando nuevo administrador...');
        
        const client = await getMongoConnection();
        const db = client.db();
        const usuariosCollection = db.collection('usuarios');
        
        const { nombre, email, password, rol } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        
        // Verificar si el email ya existe
        const usuarioExistente = await usuariosCollection.findOne({ email: email });
        if (usuarioExistente) {
            console.log('❌ Email ya registrado:', email);
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        
        // Generar ID personalizado
        const idPersonalizado = await generarIdPersonalizado('usuarios', 'A');
        console.log('🆔 ID generado:', idPersonalizado);
        
        const nuevoAdmin = {
            id: idPersonalizado,
            nombre,
            email,
            password,
            rol,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('📋 Datos del administrador:', nuevoAdmin);
        
        const result = await usuariosCollection.insertOne(nuevoAdmin);
        console.log('✅ Administrador creado con éxito');
        
        res.json({ _id: result.insertedId, ...nuevoAdmin });
    } catch (error) {
        console.error('❌ Error creando administrador:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
});

// Actualizar administrador
app.put('/api/administradores/:id', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const usuariosCollection = db.collection('usuarios');
        
        const { id } = req.params;
        const { nombre, email, password, rol } = req.body;
        
        const updateData = {
            nombre,
            email,
            password,
            rol,
            updatedAt: new Date()
        };
        
        // Buscar por id personalizado o _id de MongoDB
        let result;
        try {
            const { ObjectId } = require('mongodb');
            result = await usuariosCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
        } catch (error) {
            // Si falla la conversión, buscar por id personalizado
            result = await usuariosCollection.updateOne(
                { id: id },
                { $set: updateData }
            );
        }
        
        if (result.modifiedCount > 0) {
            res.json({ message: 'Administrador actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        console.error('Error actualizando administrador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar administrador
app.delete('/api/administradores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getMongoConnection();
        const db = client.db();
        const usuariosCollection = db.collection('usuarios');
        
        const result = await usuariosCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount > 0) {
            res.json({ message: 'Administrador eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        console.error('Error eliminando administrador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para ventas
app.get('/api/ventas', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const ventasCollection = db.collection('ventas');
        const ventas = await ventasCollection.find({}).toArray();
        res.json(ventas);
    } catch (error) {
        console.error('Error obteniendo ventas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/ventas', async (req, res) => {
    try {
        console.log('🛒 Procesando nueva venta...');
        
        const client = await getMongoConnection();
        const db = client.db();
        const ventasCollection = db.collection('ventas');
        const productosCollection = db.collection('productos');
        
        const { productos: productosVenta, total, cliente } = req.body;
        
        console.log('📋 Productos en venta:', productosVenta);
        
        // Verificar stock y actualizar productos
        for (const item of productosVenta) {
            console.log(`🔍 Buscando producto con ID: ${item.id}`);
            
            // Buscar por _id de MongoDB (convertir string a ObjectId)
            let producto;
            try {
                const { ObjectId } = require('mongodb');
                producto = await productosCollection.findOne({ _id: new ObjectId(item.id) });
            } catch (error) {
                console.log(`❌ Error convirtiendo ID a ObjectId: ${item.id}`);
                // Si falla la conversión, buscar por id personalizado
                producto = await productosCollection.findOne({ id: item.id });
            }
            
            if (!producto) {
                console.log(`❌ Producto no encontrado con ID: ${item.id}`);
                return res.status(404).json({ error: `Producto ${item.id} no encontrado` });
            }
            
            console.log(`✅ Producto encontrado: ${producto.nombre} (Stock actual: ${producto.stock})`);
            
            const stockActual = parseInt(producto.stock) || 0;
            const cantidadSolicitada = parseInt(item.cantidad) || 0;
            
            if (stockActual < cantidadSolicitada) {
                return res.status(400).json({ 
                    error: `Stock insuficiente para ${producto.nombre}. Disponible: ${stockActual}, Solicitado: ${cantidadSolicitada}` 
                });
            }
            
            // Descontar stock
            const nuevoStock = stockActual - cantidadSolicitada;
            const updateResult = await productosCollection.updateOne(
                { _id: producto._id },
                { $set: { stock: nuevoStock, updatedAt: new Date() } }
            );
            
            console.log(`📦 Stock actualizado para ${producto.nombre}: ${stockActual} → ${nuevoStock} (Modificado: ${updateResult.modifiedCount})`);
        }
        
        const nuevaVenta = {
            productos: productosVenta,
            total: parseFloat(total),
            cliente: cliente,
            fecha: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await ventasCollection.insertOne(nuevaVenta);
        console.log('✅ Venta procesada exitosamente');
        
        res.json({ _id: result.insertedId, ...nuevaVenta });
    } catch (error) {
        console.error('❌ Error procesando venta:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
});

// Endpoint para obtener suscripciones que terminan pronto o ya expiraron
app.get('/api/suscripciones/terminan-pronto', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        const hoy = new Date();
        const unaSemanaDespues = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Buscar clientes cuya membresía expira en <= 7 días o ya expiró
        const clientes = await clientesCollection.find({
            fechaFin: { $lte: unaSemanaDespues }
        }).toArray();

        // Formatear respuesta
        const resultado = clientes.map(cliente => {
            const fechaFin = new Date(cliente.fechaFin);
            const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
            return {
                id: cliente.id || cliente._id,
                nombre: cliente.nombre,
                apellidos: cliente.apellidos,
                tipoMembresia: cliente.tipoMembresia,
                fechaInicio: cliente.fechaInicio,
                fechaFin: cliente.fechaFin,
                diasRestantes: diasRestantes,
                estado: diasRestantes < 0 ? 'VENCIDA' : (diasRestantes <= 7 ? 'PRÓXIMO A VENCER' : 'ACTIVA')
            };
        });

        res.json(resultado);
    } catch (error) {
        console.error('Error obteniendo suscripciones que terminan pronto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🔄 Cerrando servidor...');
    if (mongoClient) {
        await mongoClient.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
    process.exit(0);
});

// --- FUNCIONES DE SEEDING (GENERACIÓN DE DATOS DE EJEMPLO) ---

// Función para generar productos de ejemplo
async function seedProductos() {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const productosCollection = db.collection('productos');

        const productCount = await productosCollection.countDocuments();
        if (productCount > 0) {
            console.log('📦 La base de datos de productos ya tiene datos.');
            return;
        }

        console.log('🌱 Generando productos de ejemplo...');
        const productosEjemplo = [
            { nombre: 'Proteína Whey', precio: 50.99, stock: 100, imagen: 'Imagenes/Creatina.jpeg', createdAt: new Date(), updatedAt: new Date() },
            { nombre: 'Creatina Monohidratada', precio: 25.50, stock: 150, imagen: 'Imagenes/Creatina.jpeg', createdAt: new Date(), updatedAt: new Date() },
            { nombre: 'Barra Energética', precio: 2.99, stock: 200, imagen: 'Imagenes/Creatina.jpeg', createdAt: new Date(), updatedAt: new Date() },
            { nombre: 'Bebida Isotónica', precio: 1.99, stock: 300, imagen: 'Imagenes/Creatina.jpeg', createdAt: new Date(), updatedAt: new Date() },
            { nombre: 'Guantes de Gimnasio', precio: 15.00, stock: 50, imagen: 'Imagenes/Creatina.jpeg', createdAt: new Date(), updatedAt: new Date() }
        ];
        await productosCollection.insertMany(productosEjemplo);
        console.log(`✅ Se han insertado ${productosEjemplo.length} productos de ejemplo.`);

    } catch (error) {
        console.error('❌ Error al generar productos de ejemplo:', error);
    }
}

// Función para generar clientes de ejemplo
async function seedClientes() {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');

        const clientCount = await clientesCollection.countDocuments();
        if (clientCount > 0) {
            console.log('👥 La base de datos de clientes ya tiene datos.');
            return;
        }

        console.log('🌱 Generando clientes de ejemplo...');
        
        const today = new Date();
        const clientesEjemplo = [
            // Membresías Anuales (Activas)
            { nombre: 'Ana', apellidos: 'García', edad: 28, tipoMembresia: 'Anual', fechaInicio: new Date(), fechaFin: new Date(new Date().setFullYear(today.getFullYear() + 1)) },
            { nombre: 'Sofia', apellidos: 'Hernandez', edad: 29, tipoMembresia: 'Anual', fechaInicio: new Date(), fechaFin: new Date(new Date().setFullYear(today.getFullYear() + 1)) },
            { nombre: 'Carlos', apellidos: 'Lopez', edad: 31, tipoMembresia: 'Anual', fechaInicio: new Date(), fechaFin: new Date(new Date().setFullYear(today.getFullYear() + 1)) },
            
            // Membresías Semestrales (Activas)
            { nombre: 'Jorge', apellidos: 'Perez', edad: 41, tipoMembresia: 'Semestral', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 6)) },
            { nombre: 'María', apellidos: 'Gonzalez', edad: 26, tipoMembresia: 'Semestral', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 6)) },
            
            // Membresías Trimestrales (Activas)
            { nombre: 'Carla', apellidos: 'Rodriguez', edad: 22, tipoMembresia: 'Trimestral', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 3)) },
            { nombre: 'Roberto', apellidos: 'Diaz', edad: 33, tipoMembresia: 'Trimestral', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 3)) },
            
            // Membresías Mensuales (Activas)
            { nombre: 'Luis', apellidos: 'Martinez', edad: 35, tipoMembresia: 'Mensual', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 1)) },
            { nombre: 'Patricia', apellidos: 'Sanchez', edad: 27, tipoMembresia: 'Mensual', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 1)) },
            { nombre: 'Fernando', apellidos: 'Torres', edad: 24, tipoMembresia: 'Mensual', fechaInicio: new Date(), fechaFin: new Date(new Date().setMonth(today.getMonth() + 1)) },
            
            // Algunas membresías expiradas para realismo
            { nombre: 'Juan', apellidos: 'Expired', edad: 30, tipoMembresia: 'Mensual', fechaInicio: new Date(new Date().setMonth(today.getMonth() - 2)), fechaFin: new Date(new Date().setMonth(today.getMonth() - 1)) },
            { nombre: 'Laura', apellidos: 'Expired', edad: 25, tipoMembresia: 'Trimestral', fechaInicio: new Date(new Date().setMonth(today.getMonth() - 4)), fechaFin: new Date(new Date().setMonth(today.getMonth() - 1)) }
        ];
        
        for (let i = 0; i < clientesEjemplo.length; i++) {
            clientesEjemplo[i].id = `C${(i + 1).toString().padStart(3, '0')}`;
            clientesEjemplo[i].enfermedadCronica = 'Ninguna';
            clientesEjemplo[i].alergia = 'Ninguna';
            clientesEjemplo[i].direccion = `Dirección ${i + 1}, Ciudad`;
            clientesEjemplo[i].createdAt = new Date();
            clientesEjemplo[i].updatedAt = new Date();
        }

        await clientesCollection.insertMany(clientesEjemplo);
        const configCollection = db.collection('configuracion');
        await configCollection.updateOne({ tipo: 'clientes_counter' }, { $set: { ultimoNumero: clientesEjemplo.length } }, { upsert: true });
        console.log(`✅ Se han insertado ${clientesEjemplo.length} clientes de ejemplo.`);
        console.log(`📊 Membresías activas esperadas: ${clientesEjemplo.length - 2} (excluyendo 2 expiradas)`);

    } catch (error) {
        console.error('❌ Error al generar clientes de ejemplo:', error);
    }
}

// Función para generar datos de ventas de ejemplo si la colección está vacía
async function seedVentas() {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const ventasCollection = db.collection('ventas');
        const productosCollection = db.collection('productos');

        const salesCount = await ventasCollection.countDocuments();
        if (salesCount > 0) {
            console.log('📈 La base de datos de ventas ya tiene datos.');
            return;
        }

        console.log('🌱 Generando datos de ventas de ejemplo para los últimos 3 meses...');

        const productos = await productosCollection.find({}).limit(5).toArray();
        if (productos.length === 0) {
            console.log('⚠️ No hay productos en la base de datos. No se pueden generar ventas de ejemplo.');
            return;
        }

        const ventas = [];
        const today = new Date();
        for (let i = 89; i >= 0; i--) { // Generar datos para los últimos 90 días
            // Simular días con y sin ventas para mayor realismo
            if (Math.random() > 0.4) { // 60% de probabilidad de tener ventas en un día
                const numSales = Math.floor(Math.random() * 3) + 1; // Entre 1 y 3 ventas por día
                for (let j = 0; j < numSales; j++) {
                    const date = new Date();
                    date.setDate(today.getDate() - i);
                    
                    const productoVendido = productos[Math.floor(Math.random() * productos.length)];
                    const cantidad = Math.floor(Math.random() * 3) + 1;
                    const total = cantidad * parseFloat(productoVendido.precio);

                    const nuevaVenta = {
                        productos: [{
                            id: productoVendido._id.toString(),
                            nombre: productoVendido.nombre,
                            cantidad: cantidad,
                            precio: productoVendido.precio
                        }],
                        total: total,
                        cliente: 'Cliente de Ejemplo',
                        fecha: date,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    ventas.push(nuevaVenta);
                }
            }
        }

        if (ventas.length > 0) {
            await ventasCollection.insertMany(ventas);
            console.log(`✅ Se han insertado ${ventas.length} ventas de ejemplo.`);
        }

    } catch (error) {
        console.error('❌ Error al generar datos de ventas de ejemplo:', error);
    }
}

// Función principal para poblar la base de datos
async function seedDatabase() {
    await seedProductos();
    await seedClientes();
    await seedVentas();
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('📊 Sistema de Gestión de Gimnasio');
    seedDatabase();
});

// Endpoint de debug para verificar membresías activas
app.get('/api/debug/membresias', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const clientesCollection = db.collection('clientes');
        
        const today = new Date();
        const clientes = await clientesCollection.find({}).toArray();
        
        const membresiasActivas = clientes.filter(cliente => {
            const fechaFin = new Date(cliente.fechaFin);
            const diasRestantes = Math.ceil((fechaFin - today) / (1000 * 60 * 60 * 24));
            return diasRestantes > 7; // Más de 7 días restantes = ACTIVA
        }).length;
        
        const totalClientes = await clientesCollection.countDocuments();
        const membresiasExpiradas = await clientesCollection.countDocuments({
            fechaFin: { $lt: today }
        });
        
        res.json({
            totalClientes,
            membresiasActivas,
            membresiasExpiradas,
            fechaActual: today,
            detalles: membresiasActivas.map(cliente => ({
                id: cliente.id,
                nombre: cliente.nombre + ' ' + cliente.apellidos,
                tipoMembresia: cliente.tipoMembresia,
                fechaFin: cliente.fechaFin
            }))
        });
        
    } catch (error) {
        console.error('Error obteniendo debug de membresías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================================================
// API DE INSTRUCTORES
// ============================================================================

// API para obtener todos los instructores
app.get('/api/instructores', async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const instructores = await instructoresCollection.find({}).toArray();
        res.json(instructores);
    } catch (error) {
        console.error('Error obteniendo instructores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para obtener instructor por ID
app.get('/api/instructores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const instructor = await instructoresCollection.findOne({ _id: new ObjectId(id) });
        
        if (instructor) {
            res.json(instructor);
        } else {
            res.status(404).json({ error: 'Instructor no encontrado' });
        }
    } catch (error) {
        console.error('Error obteniendo instructor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para crear instructor
app.post('/api/instructores', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'contrato', maxCount: 1 }
]), async (req, res) => {
    try {
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const instructorData = {
            nombre: req.body.nombre,
            especialidad: req.body.especialidad,
            email: req.body.email,
            telefono: req.body.telefono,
            celular: req.body.celular,
            descripcion: req.body.descripcion || '',
            estado: 'activo',
            fechaContratacion: new Date(),
            salario: req.body.salario || 2500,
            certificaciones: req.body.certificaciones || [],
            experiencia: req.body.experiencia || 0,
            horarios: req.body.horarios || 'Lunes a Viernes 6:00 AM - 10:00 PM',
            especialidadesAdicionales: req.body.especialidadesAdicionales || [],
            notas: req.body.notas || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Procesar archivos subidos
        if (req.files) {
            if (req.files.foto) {
                const fotoFile = req.files.foto[0];
                // Guardar ruta y buffer en la base de datos
                instructorData.foto = {
                    path: 'Imagenes/' + path.basename(fotoFile.path),
                    data: fs.readFileSync(fotoFile.path),
                    contentType: fotoFile.mimetype,
                    filename: fotoFile.originalname
                };
            }
            if (req.files.contrato) {
                const contratoFile = req.files.contrato[0];
                // Guardar ruta y buffer en la base de datos
                instructorData.contrato = {
                    path: 'contratos/' + path.basename(contratoFile.path),
                    data: fs.readFileSync(contratoFile.path),
                    contentType: contratoFile.mimetype,
                    filename: contratoFile.originalname
                };
            }
        }
        
        const result = await instructoresCollection.insertOne(instructorData);
        instructorData._id = result.insertedId;
        res.status(201).json(instructorData);
    } catch (error) {
        console.error('Error al crear instructor:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear instructor' });
    }
});

// API para actualizar instructor
app.put('/api/instructores/:id', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'contrato', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const updateData = {
            nombre: req.body.nombre,
            especialidad: req.body.especialidad,
            email: req.body.email,
            telefono: req.body.telefono,
            celular: req.body.celular,
            descripcion: req.body.descripcion || '',
            salario: req.body.salario || 2500,
            certificaciones: req.body.certificaciones || [],
            experiencia: req.body.experiencia || 0,
            horarios: req.body.horarios || 'Lunes a Viernes 6:00 AM - 10:00 PM',
            especialidadesAdicionales: req.body.especialidadesAdicionales || [],
            notas: req.body.notas || '',
            updatedAt: new Date()
        };
        
        // Procesar archivos subidos
        if (req.files) {
            if (req.files.foto) {
                const fotoFile = req.files.foto[0];
                updateData.foto = {
                    path: 'Imagenes/' + path.basename(fotoFile.path),
                    data: fs.readFileSync(fotoFile.path),
                    contentType: fotoFile.mimetype,
                    filename: fotoFile.originalname
                };
            }
            if (req.files.contrato) {
                const contratoFile = req.files.contrato[0];
                updateData.contrato = {
                    path: 'contratos/' + path.basename(contratoFile.path),
                    data: fs.readFileSync(contratoFile.path),
                    contentType: contratoFile.mimetype,
                    filename: contratoFile.originalname
                };
            }
        }
        
        const result = await instructoresCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.json({ message: 'Instructor actualizado', result });
    } catch (error) {
        console.error('Error al actualizar instructor:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar instructor' });
    }
});

// API para eliminar instructor
app.delete('/api/instructores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const result = await instructoresCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount > 0) {
            res.json({ message: 'Instructor eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Instructor no encontrado' });
        }
    } catch (error) {
        console.error('Error eliminando instructor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Rutas para servir archivos desde MongoDB
app.get('/api/instructores/:id/foto', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const instructor = await instructoresCollection.findOne({ _id: new ObjectId(id) });
        
        if (instructor && instructor.foto && instructor.foto.data) {
            res.set('Content-Type', instructor.foto.contentType);
            res.set('Content-Disposition', `inline; filename="${instructor.foto.filename}"`);
            res.send(instructor.foto.data.buffer);
        } else {
            res.status(404).json({ error: 'Foto no encontrada' });
        }
    } catch (error) {
        console.error('Error sirviendo foto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/instructores/:id/contrato', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getMongoConnection();
        const db = client.db();
        const instructoresCollection = db.collection('instructores');
        
        const instructor = await instructoresCollection.findOne({ _id: new ObjectId(id) });
        
        if (instructor && instructor.contrato && instructor.contrato.data) {
            res.set('Content-Type', instructor.contrato.contentType);
            res.set('Content-Disposition', `inline; filename="${instructor.contrato.filename}"`);
            res.send(instructor.contrato.data.buffer);
        } else {
            res.status(404).json({ error: 'Contrato no encontrado' });
        }
    } catch (error) {
        console.error('Error sirviendo contrato:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Servir archivos estáticos para imágenes y contratos
app.use('/Imagenes', express.static(imagenesDir));
app.use('/contratos', express.static(contratosDir));

module.exports = app; 