// Variables globales
let currentUser = null;
let clientes = [];
let productos = [];
let ventas = [];
let administradores = [];
let instructores = [];
let currentContratoInstructor = null; // Variable para el instructor actual del contrato
let carrito = [];
let currentFilter = 'todos';
let isTableView = false;

// Variables para almacenar las instancias de las gráficas
let ventasMensualesChart = null;
let ventasMembresiaChart = null;

// Colores Neon para las gráficas
const neonPurple = '#9f2fff';
const neonCyan = '#00f2ff';
const neonLime = '#dfff00';
const textColor = '#f0f0f0';
const gridColor = 'rgba(159, 47, 255, 0.2)';

// --- Traducciones básicas ---
const translations = {
    es: {
        dashboard: 'Dashboard',
        clientes: 'Clientes',
        ventas: 'Ventas',
        productos: 'Productos',
        administradores: 'Administradores',
        reportes: 'Reportes',
        configuracion: 'Configuración',
        salir: 'Salir',
        bienvenida: nombre => `¡Bienvenido ${nombre}!`,
        notificaciones: 'Notificaciones',
        fuente: 'Fuente',
        idioma: 'Idioma',
        animaciones: 'Animaciones de Interfaz',
        restaurar: 'Restaurar Ajustes',
        restablecer: 'Restablecer',
        // ... puedes agregar más textos aquí ...
    },
    en: {
        dashboard: 'Dashboard',
        clientes: 'Clients',
        ventas: 'Sales',
        productos: 'Products',
        administradores: 'Admins',
        reportes: 'Reports',
        configuracion: 'Settings',
        salir: 'Logout',
        bienvenida: name => `Welcome ${name}!`,
        notificaciones: 'Notifications',
        fuente: 'Font',
        idioma: 'Language',
        animaciones: 'UI Animations',
        restaurar: 'Restore Settings',
        restablecer: 'Reset',
        // ... puedes agregar más textos aquí ...
    }
};

// Cargar datos desde MongoDB al iniciar
async function cargarDatosDesdeMongoDB() {
    try {
        // Cargar clientes
        const responseClientes = await fetch('/api/clientes');
        if (responseClientes.ok) {
            clientes = await responseClientes.json();
        }
        
        // Cargar productos
        const responseProductos = await fetch('/api/productos');
        if (responseProductos.ok) {
            productos = await responseProductos.json();
        }
        
        // Cargar administradores
        const responseAdmins = await fetch('/api/administradores');
        if (responseAdmins.ok) {
            administradores = await responseAdmins.json();
        }
        
        // Cargar instructores
        const responseInstructores = await fetch('/api/instructores');
        if (responseInstructores.ok) {
            instructores = await responseInstructores.json();
        }
        
        // Cargar ventas
        const responseVentas = await fetch('/api/ventas');
        if (responseVentas.ok) {
            ventas = await responseVentas.json();
        }
        
        console.log('✅ Datos cargados desde MongoDB');
        console.log(`   - Clientes: ${clientes.length}`);
        console.log(`   - Productos: ${productos.length}`);
        console.log(`   - Administradores: ${administradores.length}`);
        console.log(`   - Instructores: ${instructores.length}`);
        console.log(`   - Ventas: ${ventas.length}`);
        
    } catch (error) {
        console.error('❌ Error cargando datos desde MongoDB:', error);
        // Fallback: cargar datos de ejemplo
        cargarDatosEjemplo();
    }
}

// Función de fallback con datos de ejemplo
function cargarDatosEjemplo() {
    console.log('⚠️ Usando datos de ejemplo (fallback)');
    
    // Obtener fecha actual
    const hoy = new Date();
    
    // Calcular fechas para suscripciones que terminen pronto
    const fechaVenceHoy = new Date(hoy);
    fechaVenceHoy.setDate(hoy.getDate());
    
    const fechaVence3Dias = new Date(hoy);
    fechaVence3Dias.setDate(hoy.getDate() + 3);
    
    const fechaVence7Dias = new Date(hoy);
    fechaVence7Dias.setDate(hoy.getDate() + 7);
    
    const fechaVence15Dias = new Date(hoy);
    fechaVence15Dias.setDate(hoy.getDate() + 15);
    
    const fechaVence30Dias = new Date(hoy);
    fechaVence30Dias.setDate(hoy.getDate() + 30);
    
    const fechaVencida2Dias = new Date(hoy);
    fechaVencida2Dias.setDate(hoy.getDate() - 2);
    
    const fechaVencida5Dias = new Date(hoy);
    fechaVencida5Dias.setDate(hoy.getDate() - 5);
    
    // Datos de ejemplo para clientes con suscripciones próximas a vencer
    clientes = [
        {
            _id: '1',
            nombre: 'Juan',
            apellidos: 'Pérez García',
            edad: 28,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Mensual',
            direccion: 'Calle Principal 123, Ciudad',
            fechaInicio: fechaVenceHoy.toISOString().split('T')[0],
            fechaFin: fechaVenceHoy.toISOString().split('T')[0]
        },
        {
            _id: '2',
            nombre: 'María',
            apellidos: 'González López',
            edad: 32,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Trimestral',
            direccion: 'Av. Principal 456, Ciudad',
            fechaInicio: fechaVence3Dias.toISOString().split('T')[0],
            fechaFin: fechaVence3Dias.toISOString().split('T')[0]
        },
        {
            _id: '3',
            nombre: 'Carlos',
            apellidos: 'Rodríguez Martínez',
            edad: 25,
            enfermedadCronica: 'Ninguna',
            alergia: 'Polen',
            tipoMembresia: 'Semestral',
            direccion: 'Calle Secundaria 789, Ciudad',
            fechaInicio: fechaVence7Dias.toISOString().split('T')[0],
            fechaFin: fechaVence7Dias.toISOString().split('T')[0]
        },
        {
            _id: '4',
            nombre: 'Ana',
            apellidos: 'López Sánchez',
            edad: 29,
            enfermedadCronica: 'Asma',
            alergia: 'Ninguna',
            tipoMembresia: 'Anual',
            direccion: 'Plaza Mayor 321, Ciudad',
            fechaInicio: fechaVence15Dias.toISOString().split('T')[0],
            fechaFin: fechaVence15Dias.toISOString().split('T')[0]
        },
        {
            _id: '5',
            nombre: 'Roberto',
            apellidos: 'Fernández Díaz',
            edad: 35,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Mensual',
            direccion: 'Avenida Central 654, Ciudad',
            fechaInicio: fechaVence30Dias.toISOString().split('T')[0],
            fechaFin: fechaVence30Dias.toISOString().split('T')[0]
        },
        {
            _id: '6',
            nombre: 'Laura',
            apellidos: 'Martínez Ruiz',
            edad: 27,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Trimestral',
            direccion: 'Calle Nueva 987, Ciudad',
            fechaInicio: fechaVencida2Dias.toISOString().split('T')[0],
            fechaFin: fechaVencida2Dias.toISOString().split('T')[0]
        },
        {
            _id: '7',
            nombre: 'Miguel',
            apellidos: 'Sánchez Torres',
            edad: 31,
            enfermedadCronica: 'Diabetes',
            alergia: 'Ninguna',
            tipoMembresia: 'Semestral',
            direccion: 'Boulevard Principal 147, Ciudad',
            fechaInicio: fechaVencida5Dias.toISOString().split('T')[0],
            fechaFin: fechaVencida5Dias.toISOString().split('T')[0]
        },
        {
            _id: '8',
            nombre: 'Carmen',
            apellidos: 'García Morales',
            edad: 33,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Anual',
            direccion: 'Calle Antigua 258, Ciudad',
            fechaInicio: '2024-01-15',
            fechaFin: '2025-01-15'
        }
    ];
    
    // Datos de ejemplo para instructores
    instructores = [
        {
            _id: '1',
            nombre: 'Carlos Rodríguez',
            especialidad: 'gym',
            email: 'carlos.rodriguez@gimnasio.com',
            telefono: '555-0101',
            celular: '555-123-4567',
            descripcion: 'Instructor certificado en musculación y fitness con 5 años de experiencia.',
            foto: 'Imagenes/instructor-gym.jpg',
            contrato: 'contratos/carlos-rodriguez.pdf',
            estado: 'activo'
        },
        {
            _id: '2',
            nombre: 'María González',
            especialidad: 'zumba',
            email: 'maria.gonzalez@gimnasio.com',
            telefono: '555-0102',
            celular: '555-234-5678',
            descripcion: 'Instructora de Zumba certificada con especialidad en ritmos latinos.',
            foto: 'Imagenes/instructor-zumba.jpg',
            contrato: 'contratos/maria-gonzalez.pdf',
            estado: 'activo'
        },
        {
            _id: '3',
            nombre: 'Roberto Silva',
            especialidad: 'crossfit',
            email: 'roberto.silva@gimnasio.com',
            telefono: '555-0103',
            celular: '555-345-6789',
            descripcion: 'Entrenador CrossFit nivel 2 con experiencia en competiciones.',
            foto: 'Imagenes/instructor-crossfit.jpg',
            contrato: 'contratos/roberto-silva.pdf',
            estado: 'activo'
        },
        {
            _id: '4',
            nombre: 'Ana Martínez',
            especialidad: 'box',
            email: 'ana.martinez@gimnasio.com',
            telefono: '555-0104',
            celular: '555-456-7890',
            descripcion: 'Instructora de boxeo amateur con experiencia en defensa personal.',
            foto: 'Imagenes/instructor-box.jpg',
            contrato: 'contratos/ana-martinez.pdf',
            estado: 'activo'
        },
        {
            _id: '5',
            nombre: 'Laura Fernández',
            especialidad: 'danza',
            email: 'laura.fernandez@gimnasio.com',
            telefono: '555-0105',
            celular: '555-567-8901',
            descripcion: 'Bailarina profesional especializada en danza aérea y telas.',
            foto: 'Imagenes/instructor-danza.jpg',
            contrato: 'contratos/laura-fernandez.pdf',
            estado: 'activo'
        }
    ];
    
    // Datos de ejemplo para productos
    productos = [
        {
            _id: '1',
            nombre: 'Proteína Whey',
            precio: 45.99,
            stock: 50,
            categoria: 'Suplementos',
            descripcion: 'Proteína de suero de leche de alta calidad',
            imagen: 'proteina-whey.jpg'
        },
        {
            _id: '2',
            nombre: 'Creatina Monohidratada',
            precio: 29.99,
            stock: 30,
            categoria: 'Suplementos',
            descripcion: 'Creatina pura para ganancia muscular',
            imagen: 'creatina.jpg'
        }
    ];
    
    // Datos de ejemplo para administradores
    administradores = [
        {
            _id: '1',
            nombre: 'Administrador',
            email: 'admin@gimnasio.com',
            password: 'admin123',
            rol: 'admin'
        },
        {
            _id: '2',
            nombre: 'María',
            email: 'maria.admin@gimnasio.com',
            password: 'maria123',
            rol: 'admin'
        }
    ];
}

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', async function() {
    // 1. Configurar listeners y gráficas primero
    setupConfigurationListeners();
    initDashboardChart();
    initReportesCharts();

    // 2. Cargar configuraciones de usuario, lo que actualizará la UI y las gráficas
    loadSettings();

    // 3. Configurar el listener del formulario de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    // 4. Verificar si hay un usuario logueado en la sesión
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // 5. Si hay usuario, cargar todos los datos y mostrar el dashboard
        await cargarDatosDesdeMongoDB();
        actualizarUIporRol();
        showScreen('dashboard');
    } else {
        // 6. Si no hay usuario, mostrar la pantalla de login
        showScreen('login');
    }
});

// Funciones de utilidad
function showAlert(message, type = 'success') {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (settings.notificationsEnabled === false) return;
    
    // Crear contenedor de notificaciones si no existe
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Determinar icono según el tipo
    let icon = 'fa-info-circle';
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        case 'error':
            icon = 'fa-times-circle';
            break;
        case 'info':
            icon = 'fa-info-circle';
            break;
    }
    
    notification.innerHTML = `
        <i class=\"fas ${icon} notification-icon\"></i>
        <span class=\"notification-message\">${message}</span>
        <button class=\"notification-close\" onclick=\"this.parentElement.remove()\">
            <i class=\"fas fa-times\"></i>
        </button>
    `;
    
    // Agregar al contenedor
    notificationContainer.appendChild(notification);
    
    // Remover automáticamente después de 2.5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }
    }, 2500);
}

function saveToLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('administradores', JSON.stringify(administradores));
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Funciones de navegación
function showScreen(screenName) {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(s => {
        s.classList.remove('active', 'slide-right', 'slide-left', 'fade-up', 'scale-in');
    });

    // Manejar casos especiales
    if (screenName === 'salir') {
        document.getElementById('salirScreen').classList.add('active', 'fade-up');
        return;
    }
    if (screenName === 'login') {
        document.getElementById('loginScreen').classList.add('active');
        return;
    }

    // Cargar datos y mostrar la pantalla correcta
    switch(screenName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'clientes':
            loadClientes();
            break;
        case 'historial':
            loadHistorial();
            break;
        case 'productos':
            loadProductos();
            break;
        case 'administradores':
            loadAdministradores();
            break;
        case 'instructores':
            loadInstructores();
            break;
        case 'ventas':
            loadVentas();
            break;
        case 'reportes':
            loadReportesData();
            break;
        case 'configuracion':
            // No se necesita una función de carga especial,
            // los listeners se encargan de todo.
            break;
    }

    const screenId = screenName + 'Screen';
    const screenElement = document.getElementById(screenId);
    
    if (!screenElement) {
        console.error(`Pantalla ${screenName} no encontrada`);
        return;
    }
    
    // Aplicar animación de entrada a la nueva pantalla
    setTimeout(() => {
        screenElement.classList.add('active');
        
        // Determinar el tipo de animación basado en la dirección
        if (screenName === 'dashboard') {
            screenElement.classList.add('scale-in');
        } else {
            screenElement.classList.add('fade-up');
        }
        
        // Remover la clase de animación después de completarse con transición suave
        setTimeout(() => {
            screenElement.style.transition = 'all 0.3s ease-out';
            screenElement.classList.remove('slide-right', 'slide-left', 'fade-up');
            setTimeout(() => {
                screenElement.style.transition = '';
            }, 300);
        }, 650);
    }, 500);
    
    // Actualizar botones de navegación con animación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.transform = 'scale(1)';
    });
    
    // Buscar todos los nav-menu visibles y marcar el botón correcto
    document.querySelectorAll('.nav-menu').forEach(menu => {
        const btns = menu.querySelectorAll('.nav-btn');
        btns.forEach(btn => {
            // Obtener el nombre de la vista asociada al botón
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(`showScreen('${screenName}')`)) {
                btn.classList.add('active');
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 300);
            }
        });
    });
}

// Función para actualizar la UI basada en el rol del usuario
function actualizarUIporRol() {
    if (!currentUser) return;

    const esAdmin = currentUser.rol === 'admin';
    const esSupervisor = currentUser.rol === 'supervisor';

    // El empleado es el rol con menos privilegios
    const esEmpleado = currentUser.rol === 'empleado';

    // Mostrar u ocultar el botón de navegación de Administradores
    const adminNavButton = document.querySelector('[onclick="showScreen(\'administradores\')]');
    if (adminNavButton) {
        // Solo admin y supervisor pueden ver la sección de Administradores
        adminNavButton.style.display = esAdmin || esSupervisor ? 'flex' : 'none';
    }

    // Ocultar el botón "Nuevo Administrador" para empleados
    const nuevoAdminButton = document.querySelector('#administradoresScreen .btn-primary');
    if (nuevoAdminButton) {
        // Solo admin y supervisor pueden agregar nuevos administradores
        nuevoAdminButton.style.display = esAdmin || esSupervisor ? 'flex' : 'none';
    }
}

// Función de login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showAlert('Por favor, completa todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: username, password })
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            
            // Guardar usuario en sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            
            showAlert(`¡Bienvenido ${userData.nombre}!`, 'success');
            
            // Cargar todos los datos de la aplicación
            await cargarDatosDesdeMongoDB();

            // <<--- APLICAR RESTRICCIONES DE UI --- >>
            actualizarUIporRol();

            // Mostrar dashboard
            showScreen('dashboard');
            
        } else {
            const errorData = await response.json();
            showAlert(errorData.error || 'Error en el login', 'error');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        showAlert('Error de conexión. Verifica que el servidor esté corriendo.', 'error');
    }
}

// Dashboard
function loadDashboard() {
    loadDashboardData();
}

async function updateDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
            const stats = await response.json();
            
            document.getElementById('totalClientes').textContent = stats.totalClientes || 0;
            document.getElementById('ventasDia').textContent = `$${(stats.ventasDia || 0).toFixed(2)}`;
            document.getElementById('productosStock').textContent = stats.stockTotal || 0;
            
            // Mostrar productos con stock bajo si hay
            if (stats.productosStockBajo > 0) {
                showAlert(`⚠️ ${stats.productosStockBajo} productos tienen stock bajo (< 10 unidades)`, 'warning');
            }
            
            console.log('📊 Estadísticas del dashboard actualizadas:', stats);
        } else {
            console.error('❌ Error obteniendo estadísticas del dashboard');
            // Fallback a datos locales
    document.getElementById('totalClientes').textContent = clientes.length;
            document.getElementById('ventasDia').textContent = '$0.00';
            document.getElementById('productosStock').textContent = productos.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
        }
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
        // Fallback a datos locales
        document.getElementById('totalClientes').textContent = clientes.length;
        document.getElementById('ventasDia').textContent = '$0.00';
        document.getElementById('productosStock').textContent = productos.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
    }
}

let dashboardChartInstance = null;

async function loadDashboardChart() {
    try {
        const response = await fetch('/api/dashboard/ventas-semanales');
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta');
        }
        const chartData = await response.json();

    const ctx = document.getElementById('dashboardChart').getContext('2d');
    
        if (dashboardChartInstance) {
            dashboardChartInstance.destroy();
        }
        
        dashboardChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
        datasets: [{
                    label: 'Ingresos (Últimos 7 Días)',
                    data: chartData.data,
                    backgroundColor: 'rgba(0, 242, 255, 0.2)',
                    borderColor: neonCyan,
                    borderWidth: 2,
                    pointBackgroundColor: neonCyan,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: neonCyan,
                    tension: 0.4,
                    fill: true
                }]
            },
        options: {
            responsive: true,
                maintainAspectRatio: false,
            scales: {
                y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    }
                }
            },
            plugins: {
                legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
            }
        }
    });
    } catch (error) {
        console.error('Error al cargar la gráfica del dashboard:', error);
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<p style="text-align: center; color: #ff0000;">No se pudo cargar la gráfica de ventas.</p>';
        }
    }
}

function selectStat(type) {
    // Cambiar a la pantalla correspondiente
    showScreen(type);
}

// Clientes
function loadClientes() {
    renderClientesTable();
    checkMembresias();
}

function renderClientesTable() {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = '';
    const hoy = new Date();
    clientes.forEach(cliente => {
        const fechaFin = new Date(cliente.fechaFin);
        if (fechaFin < hoy) return; // Ocultar clientes con membresía vencida
        const row = document.createElement('tr');
        const clienteId = cliente.id || cliente._id;
        row.innerHTML = `
            <td>${clienteId}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.edad}</td>
            <td>${cliente.enfermedadCronica || 'Ninguna'}</td>
            <td>${cliente.alergia || 'Ninguna'}</td>
            <td><span class="badge badge-info">${cliente.tipoMembresia}</span></td>
            <td>${cliente.direccion}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editCliente('${clienteId}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteCliente('${clienteId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showClientForm(cliente = null, soloMembresia = false) {
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('clientModalTitle');
    const form = document.getElementById('clientForm');

    // Siempre habilitar todos los campos al abrir
    document.getElementById('clienteNombre').disabled = false;
    document.getElementById('clienteApellidos').disabled = false;
    document.getElementById('clienteEdad').disabled = false;
    document.getElementById('clienteEnfermedad').disabled = false;
    document.getElementById('clienteAlergia').disabled = false;
    document.getElementById('clienteDireccion').disabled = false;
    document.getElementById('clienteMembresia').disabled = false;

    if (cliente) {
        if (soloMembresia) {
            title.textContent = 'Editar Tipo de Membresía';
            // Deshabilitar todos los campos excepto tipo de membresía
            document.getElementById('clienteNombre').disabled = true;
            document.getElementById('clienteApellidos').disabled = true;
            document.getElementById('clienteEdad').disabled = true;
            document.getElementById('clienteEnfermedad').disabled = true;
            document.getElementById('clienteAlergia').disabled = true;
            document.getElementById('clienteDireccion').disabled = true;
            document.getElementById('clienteMembresia').disabled = false;
        } else {
            title.textContent = 'Editar Cliente';
        }
        document.getElementById('clienteId').value = cliente.id || cliente._id || '';
        document.getElementById('clienteNombre').value = cliente.nombre || '';
        document.getElementById('clienteApellidos').value = cliente.apellidos || '';
        document.getElementById('clienteEdad').value = cliente.edad || '';
        document.getElementById('clienteEnfermedad').value = cliente.enfermedadCronica || '';
        document.getElementById('clienteAlergia').value = cliente.alergia || '';
        document.getElementById('clienteMembresia').value = cliente.tipoMembresia || '';
        document.getElementById('clienteDireccion').value = cliente.direccion || '';
    } else {
        title.textContent = 'Nuevo Cliente';
        form.reset();
        // Generar ID temporal para nuevo cliente
        const tempId = 'TEMP_' + Date.now();
        document.getElementById('clienteId').value = tempId;
    }
    modal.style.display = 'block';
}

function closeClientModal() {
    document.getElementById('clientModal').style.display = 'none';
}

function editCliente(id) {
    const cliente = clientes.find(c => (c.id === id) || (c._id === id));
    if (cliente) {
        showClientForm(cliente, false); // Siempre edición completa
    } else {
        console.error('❌ Cliente no encontrado con ID:', id);
        showAlert('Cliente no encontrado', 'error');
    }
}

async function deleteCliente(id) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
        try {
            const response = await fetch(`/api/clientes/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                clientes = clientes.filter(c => (c.id !== id) && (c._id !== id));
        renderClientesTable();
                showAlert('Cliente eliminado correctamente', 'success');
            } else {
                showAlert('Error al eliminar cliente', 'error');
            }
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            showAlert('Error de conexión', 'error');
        }
    }
}

document.getElementById('clientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const clienteId = document.getElementById('clienteId').value;
    const cliente = {
        nombre: document.getElementById('clienteNombre').value,
        apellidos: document.getElementById('clienteApellidos').value,
        edad: parseInt(document.getElementById('clienteEdad').value),
        enfermedadCronica: document.getElementById('clienteEnfermedad').value || 'Ninguna',
        alergia: document.getElementById('clienteAlergia').value || 'Ninguna',
        tipoMembresia: document.getElementById('clienteMembresia').value,
        direccion: document.getElementById('clienteDireccion').value,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: calcularFechaFin(document.getElementById('clienteMembresia').value)
    };
    
    console.log('📝 Enviando datos del cliente:', cliente);
    
    try {
        let response;
        if (clienteId && !clienteId.startsWith('TEMP_')) {
            // Actualizar cliente existente
            console.log('🔄 Actualizando cliente con ID:', clienteId);
            response = await fetch(`/api/clientes/${clienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
    } else {
            // Crear nuevo cliente
            console.log('➕ Creando nuevo cliente');
            response = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        }
        
        console.log('📡 Respuesta del servidor:', response.status);
        
        if (response.ok) {
            if (clienteId) {
                showAlert('Cliente actualizado correctamente', 'success');
            } else {
                showAlert('Nuevo Usuario Creado', 'success');
            }
            
            // Recargar datos desde el servidor
            await cargarDatosDesdeMongoDB();
    renderClientesTable();
    closeClientModal();
        } else {
            const errorData = await response.json();
            console.error('❌ Error del servidor:', errorData);
            showAlert(errorData.error || 'Error al procesar cliente', 'error');
        }
    } catch (error) {
        console.error('❌ Error procesando cliente:', error);
        showAlert('Error de conexión: ' + error.message, 'error');
    }
});

function calcularFechaFin(tipoMembresia) {
    const fecha = new Date();
    switch(tipoMembresia) {
        case 'Mensual':
            fecha.setMonth(fecha.getMonth() + 1);
            break;
        case 'Trimestral':
            fecha.setMonth(fecha.getMonth() + 3);
            break;
        case 'Semestral':
            fecha.setMonth(fecha.getMonth() + 6);
            break;
        case 'Anual':
            fecha.setFullYear(fecha.getFullYear() + 1);
            break;
    }
    return fecha.toISOString().split('T')[0];
}

function checkMembresias() {
    const hoy = new Date();
    const unaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    clientes.forEach(cliente => {
        const fechaFin = new Date(cliente.fechaFin);
        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
        
        if (diasRestantes <= 7 && diasRestantes > 0) {
            showAlert(`¡Atención! La membresía de ${cliente.nombre} ${cliente.apellidos} expira en ${diasRestantes} días`, 'warning');
        } else if (diasRestantes <= 0) {
            showAlert(`¡Urgente! La membresía de ${cliente.nombre} ${cliente.apellidos} ha expirado`, 'danger');
        }
    });
}

// Búsqueda de clientes
document.getElementById('searchCliente').addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = '';

    const filteredClientes = clientes.filter(cliente => {
        const id = (cliente.id || '').toString().toLowerCase();
        const _id = (cliente._id || '').toString().toLowerCase();
        const nombre = (cliente.nombre || '').toLowerCase();
        const apellidos = (cliente.apellidos || '').toLowerCase();
        return (
            id.includes(searchTerm) ||
            _id.includes(searchTerm) ||
            nombre.includes(searchTerm) ||
            apellidos.includes(searchTerm)
        );
    });

    filteredClientes.forEach(cliente => {
        const row = document.createElement('tr');
        const clienteId = cliente.id || cliente._id || 'N/A';
        row.innerHTML = `
            <td>${clienteId}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.edad}</td>
            <td>${cliente.enfermedadCronica || 'Ninguna'}</td>
            <td>${cliente.alergia || 'Ninguna'}</td>
            <td><span class="badge badge-info">${cliente.tipoMembresia}</span></td>
            <td>${cliente.direccion}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editCliente('${clienteId}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteCliente('${clienteId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
});

// Ventas
function loadVentas() {
    renderProductosGrid();
    renderCarrito();
}

function renderProductosGrid() {
    const grid = document.getElementById('productosGrid');
    grid.innerHTML = '';
    
    productos.forEach(producto => {
        const stock = producto.stock || producto.piezas || 0;
        if (stock > 0) {
            const card = document.createElement('div');
            card.className = 'producto-card';
            card.onclick = () => agregarAlCarrito(producto);
            card.innerHTML = `
                <img src="${producto.imagen || 'Imagenes/Logo2.png'}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-precio">$${(producto.precio || 0).toFixed(2)}</div>
                <div class="producto-stock">Stock: ${stock}</div>
            `;
            grid.appendChild(card);
        }
    });
    
    // Mostrar mensaje si no hay productos con stock
    if (grid.children.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>No hay productos disponibles con stock</p>
            </div>
        `;
    }
}

function agregarAlCarrito(producto) {
    const stock = producto.stock || producto.piezas || 0;
    const productoId = producto.id || producto._id;
    const existingItem = carrito.find(item => (item.id === productoId) || (item._id === productoId));
    
    if (existingItem) {
        if (existingItem.cantidad < stock) {
            existingItem.cantidad++;
        } else {
            showAlert('No hay suficiente stock', 'warning');
            return;
        }
    } else {
        carrito.push({
            ...producto,
            id: productoId,
            cantidad: 1
        });
    }
    
    renderCarrito();
    showAlert(`${producto.nombre} agregado al carrito`);
}

function renderCarrito() {
    const container = document.getElementById('carritoItems');
    const totalElement = document.getElementById('carritoTotal');
    
    container.innerHTML = '';
    
    if (carrito.length === 0) {
        container.innerHTML = '<p>El carrito está vacío</p>';
        totalElement.textContent = '$0.00';
        return;
    }
    
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                <small>$${item.precio.toFixed(2)} x ${item.cantidad}</small>
            </div>
            <div>
                <strong>$${(item.precio * item.cantidad).toFixed(2)}</strong>
                <button onclick="removerDelCarrito('${item.id}')" style="margin-left: 10px; background: #dc3545; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(itemElement);
    });
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function removerDelCarrito(productoId) {
    carrito = carrito.filter(item => (item.id !== productoId) && (item._id !== productoId));
    renderCarrito();
}

async function procesarVenta() {
    if (carrito.length === 0) {
        showAlert('El carrito está vacío', 'warning');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Preparar datos para el servidor
    const ventaData = {
        productos: carrito.map(item => ({
            id: item._id || item.id, // Usar _id si está disponible, sino id
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad
        })),
        total: total,
        cliente: 'Cliente General' // Por ahora cliente general
    };
    
    console.log('🛒 Enviando venta al servidor:', ventaData);
    
    try {
        const response = await fetch('/api/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ventaData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Venta procesada exitosamente:', result);
            
            // Limpiar carrito
    carrito = [];
    renderCarrito();
            
            // Recargar productos para actualizar stock
            await cargarDatosDesdeMongoDB();
    renderProductosGrid();
    
            showAlert('Venta procesada exitosamente', 'success');
        } else {
            const errorData = await response.json();
            console.error('❌ Error procesando venta:', errorData);
            showAlert(errorData.error || 'Error al procesar la venta', 'error');
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        showAlert('Error de conexión al procesar la venta', 'error');
    }
}

// Productos
function loadProductos() {
    renderProductosTable();
}

function renderProductosTable() {
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        const productoId = producto.id || producto._id;
        const stock = producto.stock || producto.piezas || 0;
        const stockClass = stock > 10 ? 'success' : stock > 0 ? 'warning' : 'danger';
        
        let actionButtons = '';
        // Solo mostrar botones de acción si el usuario NO es un empleado
        if (currentUser && currentUser.rol !== 'empleado') {
            actionButtons = `
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProducto('${productoId}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProducto('${productoId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }

        row.innerHTML = `
            <td>${productoId}</td>
            <td><img src="${producto.imagen || 'Imagenes/Logo2.png'}" alt="${producto.nombre}" class="producto-imagen-tabla"></td>
            <td>${producto.nombre}</td>
            <td>$${(producto.precio || 0).toFixed(2)}</td>
            <td>${stock}</td>
            <td>
                ${actionButtons}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showProductForm(producto = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');
    
    if (producto) {
        title.textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id || producto._id || '';
        document.getElementById('productoNombre').value = producto.nombre || '';
        document.getElementById('productoPrecio').value = producto.precio || '';
        document.getElementById('productoPiezas').value = producto.stock || producto.piezas || '';
    } else {
        title.textContent = 'Nuevo Producto';
        form.reset();
        // Generar ID temporal para nuevo producto
        const tempId = 'TEMP_' + Date.now();
        document.getElementById('productoId').value = tempId;
    }
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function editProducto(id) {
    const producto = productos.find(p => (p.id === id) || (p._id === id));
    if (producto) {
        showProductForm(producto);
    } else {
        console.error('❌ Producto no encontrado con ID:', id);
        showAlert('Producto no encontrado', 'error');
    }
}

async function deleteProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            const response = await fetch(`/api/productos/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                productos = productos.filter(p => (p.id !== id) && (p._id !== id));
        renderProductosTable();
                showAlert('Producto eliminado correctamente', 'success');
            } else {
                showAlert('Error al eliminar producto', 'error');
            }
        } catch (error) {
            console.error('Error eliminando producto:', error);
            showAlert('Error de conexión', 'error');
        }
    }
}

document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const productoId = document.getElementById('productoId').value;
    const imagenInput = document.getElementById('productoImagen');
    
    const formData = new FormData();
    formData.append('nombre', document.getElementById('productoNombre').value);
    formData.append('precio', parseFloat(document.getElementById('productoPrecio').value));
    formData.append('stock', parseInt(document.getElementById('productoPiezas').value));
    
    // Adjuntar la imagen solo si se seleccionó una
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }
    
    console.log('📦 Enviando datos del producto con FormData...');
    
    try {
        let response;
        const isUpdate = productoId && !productoId.startsWith('TEMP_');
        
        const url = isUpdate ? `/api/productos/${productoId}` : '/api/productos';
        const method = isUpdate ? 'PUT' : 'POST';
        
        console.log(`📡 Realizando petición: ${method} a ${url}`);
        
        response = await fetch(url, {
            method: method,
            body: formData // No se necesita 'Content-Type', el navegador lo establece automáticamente para FormData
        });
        
        console.log('📡 Respuesta del servidor:', response.status);
        
        if (response.ok) {
            if (isUpdate) {
                showAlert('Producto actualizado correctamente', 'success');
            } else {
                showAlert('Nuevo Producto Creado', 'success');
            }
            
            // Recargar datos desde el servidor para reflejar los cambios
            await cargarDatosDesdeMongoDB();
            
            // Actualizar vistas
            renderProductosTable();
            if (document.getElementById('ventasScreen').classList.contains('active')) {
                renderProductosGrid();
            }
            
            closeProductModal();
        } else {
            const errorData = await response.json();
            console.error('❌ Error del servidor:', errorData);
            showAlert(errorData.error || 'Error al procesar producto', 'error');
        }
    } catch (error) {
        console.error('❌ Error procesando producto:', error);
        showAlert('Error de conexión: ' + error.message, 'error');
    }
});

// Búsqueda de productos
document.getElementById('searchProducto').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '';
    
    const filteredProductos = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) ||
        (producto.id || producto._id || '').toLowerCase().includes(searchTerm)
    );
    
    filteredProductos.forEach(producto => {
        const row = document.createElement('tr');
        const productoId = producto.id || producto._id;
        const stock = producto.stock || producto.piezas || 0;
        const stockClass = stock > 10 ? 'success' : stock > 0 ? 'warning' : 'danger';
        
        row.innerHTML = `
            <td>${productoId}</td>
            <td><img src="${producto.imagen || 'Imagenes/Logo2.png'}" alt="${producto.nombre}" class="producto-imagen-tabla"></td>
            <td>${producto.nombre}</td>
            <td>$${(producto.precio || 0).toFixed(2)}</td>
            <td>${stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProducto('${productoId}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProducto('${productoId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
});

// Administradores
function loadAdministradores() {
    renderAdministradoresTable();
}

function renderAdministradoresTable() {
    const tbody = document.getElementById('adminsTableBody');
    tbody.innerHTML = '';
    
    administradores.forEach(admin => {
        const row = document.createElement('tr');
        const adminId = admin.id || admin._id;
        const rolClass = admin.rol === 'admin' ? 'danger' : admin.rol === 'empleado' ? 'warning' : 'info';
        
        let actionButtons = '';
        const canEdit = (
            // Un admin puede editar a todos
            currentUser.rol === 'admin' || 
            // Un supervisor puede editar a supervisores y empleados, pero no a admins
            (currentUser.rol === 'supervisor' && admin.rol !== 'admin')
        );

        // Solo mostrar botones de acción si el usuario tiene permiso
        if (currentUser && canEdit) {
            actionButtons = `
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editAdmin('${adminId}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteAdmin('${adminId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        
        row.innerHTML = `
            <td>${adminId}</td>
            <td>${admin.nombre}</td>
            <td>${admin.email}</td>
            <td><span class="badge badge-${rolClass}">${admin.rol}</span></td>
            <td>
                ${actionButtons}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAdminForm(admin = null) {
    const modal = document.getElementById('adminModal');
    const title = document.getElementById('adminModalTitle');
    const form = document.getElementById('adminForm');
    
    if (admin) {
        title.textContent = 'Editar Administrador';
        document.getElementById('adminId').value = admin.id || admin._id || '';
        document.getElementById('adminNombre').value = admin.nombre || '';
        document.getElementById('adminEmail').value = admin.email || '';
        document.getElementById('adminPassword').value = admin.password || '';
        document.getElementById('adminRol').value = admin.rol || 'empleado';
    } else {
        title.textContent = 'Nuevo Administrador';
        form.reset();
        // Generar ID temporal para nuevo administrador
        const tempId = 'TEMP_' + Date.now();
        document.getElementById('adminId').value = tempId;
    }
    
    modal.style.display = 'block';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function editAdmin(id) {
    const admin = administradores.find(a => (a.id === id) || (a._id === id));
    if (admin) {
        showAdminForm(admin);
    } else {
        console.error('❌ Administrador no encontrado con ID:', id);
        showAlert('Administrador no encontrado', 'error');
    }
}

async function deleteAdmin(id) {
    if (confirm('¿Está seguro de que desea eliminar este administrador?')) {
        try {
            const response = await fetch(`/api/administradores/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                administradores = administradores.filter(a => (a.id !== id) && (a._id !== id));
        renderAdministradoresTable();
                showAlert('Administrador eliminado correctamente', 'success');
            } else {
                showAlert('Error al eliminar administrador', 'error');
            }
        } catch (error) {
            console.error('Error eliminando administrador:', error);
            showAlert('Error de conexión', 'error');
        }
    }
}

document.getElementById('adminForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const adminId = document.getElementById('adminId').value;
    const admin = {
        nombre: document.getElementById('adminNombre').value,
        email: document.getElementById('adminEmail').value,
        password: document.getElementById('adminPassword').value,
        rol: document.getElementById('adminRol').value
    };
    
    console.log('👨‍💼 Enviando datos del administrador:', admin);
    
    try {
        let response;
        if (adminId && !adminId.startsWith('TEMP_')) {
            // Actualizar administrador existente
            console.log('🔄 Actualizando administrador con ID:', adminId);
            response = await fetch(`/api/administradores/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(admin)
            });
    } else {
            // Crear nuevo administrador
            console.log('➕ Creando nuevo administrador');
            response = await fetch('/api/administradores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(admin)
            });
        }
        
        console.log('📡 Respuesta del servidor:', response.status);
        
        if (response.ok) {
            if (adminId) {
                showAlert('Administrador actualizado correctamente', 'success');
            } else {
                showAlert('Nuevo Administrador Creado', 'success');
            }
            
            // Recargar datos desde el servidor
            await cargarDatosDesdeMongoDB();
    renderAdministradoresTable();
    closeAdminModal();
        } else {
            const errorData = await response.json();
            console.error('❌ Error del servidor:', errorData);
            showAlert(errorData.error || 'Error al procesar administrador', 'error');
        }
    } catch (error) {
        console.error('❌ Error procesando administrador:', error);
        showAlert('Error de conexión: ' + error.message, 'error');
    }
});

// Búsqueda de administradores
document.getElementById('searchAdmin').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tbody = document.getElementById('adminsTableBody');
    tbody.innerHTML = '';
    
    const filteredAdmins = administradores.filter(admin => 
        admin.nombre.toLowerCase().includes(searchTerm) ||
        admin.email.toLowerCase().includes(searchTerm) ||
        (admin._id || admin.id || '').toLowerCase().includes(searchTerm)
    );
    
    filteredAdmins.forEach(admin => {
        const row = document.createElement('tr');
        const adminId = admin.id || admin._id;
        const rolClass = admin.rol === 'admin' ? 'danger' : admin.rol === 'empleado' ? 'warning' : 'info';
        
        row.innerHTML = `
            <td>${adminId}</td>
            <td>${admin.nombre}</td>
            <td>${admin.email}</td>
            <td><span class="badge badge-${rolClass}">${admin.rol}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editAdmin('${adminId}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteAdmin('${adminId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
});

// Reportes
async function loadReportesData() {
    try {
        const response = await fetch('/api/reportes/all');
        if (!response.ok) {
            throw new Error(`Error al cargar los datos de reportes: ${response.statusText}`);
        }
        const data = await response.json();

        // 1. Poblar las tarjetas de estadísticas
        const { cardStats } = data;
        document.getElementById('ventasMensuales').textContent = cardStats.ventasMensuales; // CORREGIDO: Usar el recuento de ventas
        document.getElementById('membresiasActivas').textContent = cardStats.membresiasActivas;
        document.getElementById('ingresosMensuales').textContent = `$${cardStats.ingresosMensuales.toFixed(2)}`;

        // Debug: Mostrar información de membresías en consola
        console.log('📊 Datos de reportes cargados:', {
            ventasMensuales: cardStats.ventasMensuales,
            membresiasActivas: cardStats.membresiasActivas,
            ingresosMensuales: cardStats.ingresosMensuales
        });

        // 2. Poblar la gráfica de Ventas Mensuales (Barras)
        const { monthlyChartData } = data;
        if (ventasChart) {
            ventasChart.data.labels = monthlyChartData.labels;
            ventasChart.data.datasets[0].data = monthlyChartData.data;
            ventasChart.update();
        }

        // 3. Poblar la gráfica de Ventas por Membresía (Pastel)
        const { membershipChartData } = data;
        if (membresiasChart) {
            membresiasChart.data.labels = membershipChartData.labels;
            membresiasChart.data.datasets[0].data = membershipChartData.data;
            membresiasChart.update();
        }

    } catch (error) {
        console.error('Error cargando datos de reportes:', error);
        // Mostrar error en las tarjetas
        document.getElementById('ventasMensuales').textContent = 'Error';
        document.getElementById('membresiasActivas').textContent = 'Error';
        document.getElementById('ingresosMensuales').textContent = 'Error';
    }
}

// Función de debug para verificar membresías activas
async function debugMembresias() {
    try {
        const response = await fetch('/api/debug/membresias');
        if (!response.ok) {
            throw new Error('Error al obtener datos de debug');
        }
        const data = await response.json();
        
        console.log('🔍 Debug de Membresías:', data);
        console.log('📋 Detalles de membresías activas:');
        data.detalles.forEach(cliente => {
            console.log(`   - ${cliente.nombre} (${cliente.tipoMembresia}): Expira ${new Date(cliente.fechaFin).toLocaleDateString()}`);
        });
        
        // Mostrar alerta con información
        showAlert(`Membresías Activas: ${data.membresiasActivas} de ${data.totalClientes} total`, 'info');
        
    } catch (error) {
        console.error('Error en debug de membresías:', error);
        showAlert('Error al verificar membresías', 'error');
    }
}

// Agregar función de debug al objeto window para poder llamarla desde la consola
window.debugMembresias = debugMembresias;

// Logout
function logout() {
    // Obtener la pantalla actual
    const currentScreen = document.querySelector('.screen.active');
    const loginScreen = document.getElementById('loginScreen');
    
    if (currentScreen && loginScreen) {
        // Animación de salida de la pantalla actual
        currentScreen.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        currentScreen.style.opacity = '0';
        currentScreen.style.transform = 'scale(0.9) translateY(50px)';
        
        // Después de la animación de salida, mostrar login
        setTimeout(() => {
            currentScreen.classList.remove('active');
            currentScreen.style.transition = '';
            currentScreen.style.opacity = '';
            currentScreen.style.transform = '';
            
            // Limpiar datos de sesión
            currentUser = null;
            carrito = [];
            
            // Mostrar login con animación
            loginScreen.classList.add('active');
            loginScreen.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            loginScreen.style.opacity = '0';
            loginScreen.style.transform = 'scale(0.9)';
            
            // Animar entrada del login
            setTimeout(() => {
                loginScreen.style.opacity = '1';
                loginScreen.style.transform = 'scale(1)';
                
                // Limpiar estilos después de la animación
                setTimeout(() => {
                    loginScreen.style.transition = '';
                    loginScreen.style.opacity = '';
                    loginScreen.style.transform = '';
                }, 700);
            }, 50);
            
            // Mostrar mensaje de logout
            showAlert('Sesión cerrada correctamente');
            
            // Limpiar formulario de login
            document.getElementById('loginForm').reset();
            document.getElementById('loginForm').style.display = 'block';
            
        }, 700);
    } else {
        // Fallback si no se encuentran las pantallas
        currentUser = null;
        carrito = [];
        showAlert('Sesión cerrada correctamente');
        showScreen('login');
    }
}

// Cerrar modales al hacer clic fuera de ellos
window.onclick = function(event) {
    const clientModal = document.getElementById('clientModal');
    const productModal = document.getElementById('productModal');
    const adminModal = document.getElementById('adminModal');
    
    if (event.target === clientModal) {
        closeClientModal();
    }
    if (event.target === productModal) {
        closeProductModal();
    }
    if (event.target === adminModal) {
        closeAdminModal();
    }
}

// --- Lógica de Configuración ---

function updateChartFontSizes(multiplier = null) {
    if (multiplier === null) {
        const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        multiplier = savedSettings.fontSize || 1;
    }

    // Base sizes in pixels
    const baseTickSize = 14;
    const baseLegendSize = 16;
    const baseReportLegendSize = 14;

    const newTickSize = baseTickSize * multiplier;
    const newLegendSize = baseLegendSize * multiplier;
    const newReportLegendSize = baseReportLegendSize * multiplier;

    const charts = [dashboardChart, ventasChart, membresiasChart];
    
    charts.forEach(chart => {
        if (chart) {
            if (chart.options.scales && chart.options.scales.x && chart.options.scales.y) {
                chart.options.scales.x.ticks.font.size = newTickSize;
                chart.options.scales.y.ticks.font.size = newTickSize;
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                 if (chart === dashboardChart) {
                    chart.options.plugins.legend.labels.font.size = newLegendSize;
                } else {
                    chart.options.plugins.legend.labels.font.size = newReportLegendSize;
                }
            }
            chart.update('none'); // 'none' para evitar la animación de redibujado
        }
    });
}

function applyLanguage(lang) {
    const t = translations[lang] || translations['es'];
    // Navbar
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.textContent.includes('Dashboard')) btn.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${t.dashboard}`;
        if (btn.textContent.includes('Clientes') || btn.textContent.includes('Clients')) btn.innerHTML = `<i class="fas fa-users"></i> ${t.clientes}`;
        if (btn.textContent.includes('Ventas') || btn.textContent.includes('Sales')) btn.innerHTML = `<i class="fas fa-shopping-cart"></i> ${t.ventas}`;
        if (btn.textContent.includes('Productos') || btn.textContent.includes('Products')) btn.innerHTML = `<i class="fas fa-box"></i> ${t.productos}`;
        if (btn.textContent.includes('Administradores') || btn.textContent.includes('Admins')) btn.innerHTML = `<i class="fas fa-user-shield"></i> ${t.administradores}`;
        if (btn.textContent.includes('Reportes') || btn.textContent.includes('Reports')) btn.innerHTML = `<i class="fas fa-chart-bar"></i> ${t.reportes}`;
        if (btn.textContent.includes('Configuración') || btn.textContent.includes('Settings')) btn.innerHTML = `<i class="fas fa-cog"></i> ${t.configuracion}`;
        if (btn.textContent.includes('Salir') || btn.textContent.includes('Logout')) btn.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${t.salir}`;
    });
    // Títulos principales
    const mainTitles = [
        { id: 'dashboardScreen', key: 'dashboard' },
        { id: 'clientesScreen', key: 'clientes' },
        { id: 'ventasScreen', key: 'ventas' },
        { id: 'productosScreen', key: 'productos' },
        { id: 'administradoresScreen', key: 'administradores' },
        { id: 'reportesScreen', key: 'reportes' },
        { id: 'configuracionScreen', key: 'configuracion' }
    ];
    mainTitles.forEach(({ id, key }) => {
        const el = document.querySelector(`#${id} h1`);
        if (el) el.textContent = t[key];
    });
    // Otros textos de configuración
    document.querySelector('label[for="fontFamilySelect"]').innerHTML = `<i class="fas fa-font"></i> ${t.fuente}`;
    document.querySelector('label[for="languageSelect"]').innerHTML = `<i class="fas fa-language"></i> ${t.idioma}`;
    document.querySelector('label[for="notificationsToggle"]').innerHTML = `<i class="fas fa-bell"></i> ${t.notificaciones}`;
    document.querySelector('label[for="animationsToggle"]').innerHTML = `<i class="fas fa-magic"></i> ${t.animaciones}`;
    document.querySelector('#resetSettingsBtn').innerHTML = `<i class="fas fa-trash-alt"></i> ${t.restablecer}`;
    document.querySelector('.config-section.glass-box h2').textContent = t.apariencia || 'Apariencia';
    document.querySelectorAll('.config-section.glass-box h2')[1].textContent = t.preferencias || 'Preferencias';
    document.querySelectorAll('.config-section.glass-box h2')[2].textContent = t.sistema || 'Sistema';
}

function applyFont(font) {
    let family = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
    if (font === 'serif') family = 'Georgia, Times New Roman, serif';
    if (font === 'monospace') family = 'Consolas, Courier New, monospace';
    document.body.style.fontFamily = family;
}

function applySettings(settings) {
    // Tamaño de fuente
    const fontSizePercentage = parseFloat(settings.fontSize) * 100;
    document.documentElement.style.fontSize = `${fontSizePercentage}%`;
    // Fuente
    applyFont(settings.fontFamily || 'sans-serif');
    // Animaciones
    if (settings.animationsEnabled) {
        document.body.classList.remove('animations-disabled');
    } else {
        document.body.classList.add('animations-disabled');
    }
    // Idioma
    applyLanguage(settings.language || 'es');
    // Actualizar fuentes de las gráficas
    updateChartFontSizes(settings.fontSize);
}

function saveSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    let settings = {
        fontSize: 1,
        fontFamily: 'sans-serif',
        language: 'es',
        animationsEnabled: true,
        notificationsEnabled: true
    };
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    applySettings(settings);
    // Actualizar controles
    document.getElementById('fontSizeSlider').value = settings.fontSize;
    document.getElementById('fontFamilySelect').value = settings.fontFamily;
    document.getElementById('languageSelect').value = settings.language;
    document.getElementById('animationsToggle').checked = settings.animationsEnabled;
    document.getElementById('notificationsToggle').checked = settings.notificationsEnabled;
}

function resetSettings() {
    if (confirm('¿Está seguro de que desea restablecer todos los ajustes a sus valores predeterminados?')) {
        const defaultSettings = {
            fontSize: 1,
            fontFamily: 'sans-serif',
            language: 'es',
            animationsEnabled: true,
            notificationsEnabled: true
        };
        saveSettings(defaultSettings);
        applySettings(defaultSettings);
        document.getElementById('fontSizeSlider').value = defaultSettings.fontSize;
        document.getElementById('fontFamilySelect').value = defaultSettings.fontFamily;
        document.getElementById('languageSelect').value = defaultSettings.language;
        document.getElementById('animationsToggle').checked = defaultSettings.animationsEnabled;
        document.getElementById('notificationsToggle').checked = defaultSettings.notificationsEnabled;
        showAlert('Los ajustes se han restablecido.', 'info');
    }
}

function setupConfigurationListeners() {
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const languageSelect = document.getElementById('languageSelect');
    const animationsToggle = document.getElementById('animationsToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const resetBtn = document.getElementById('resetSettingsBtn');

    fontSizeSlider.addEventListener('input', (e) => {
        const newSizeMultiplier = e.target.value;
        const fontSizePercentage = parseFloat(newSizeMultiplier) * 100;
        document.documentElement.style.fontSize = `${fontSizePercentage}%`;
        updateChartFontSizes(newSizeMultiplier);
    });
    fontSizeSlider.addEventListener('change', (e) => {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings.fontSize = e.target.value;
        saveSettings(settings);
        showAlert('Tamaño de fuente guardado.', 'success');
    });
    fontFamilySelect.addEventListener('change', (e) => {
        const font = e.target.value;
        applyFont(font);
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings.fontFamily = font;
        saveSettings(settings);
        showAlert('Fuente guardada.', 'success');
    });
    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        applyLanguage(lang);
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings.language = lang;
        saveSettings(settings);
        showAlert('Idioma guardado.', 'success');
    });
    animationsToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings.animationsEnabled = enabled;
        if (enabled) {
            document.body.classList.remove('animations-disabled');
        } else {
            document.body.classList.add('animations-disabled');
        }
        saveSettings(settings);
        showAlert(`Animaciones ${enabled ? 'activadas' : 'desactivadas'}.`, 'success');
    });
    notificationsToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings.notificationsEnabled = enabled;
        saveSettings(settings);
        showAlert(`Notificaciones ${enabled ? 'activadas' : 'desactivadas'}.`, 'success');
    });
    resetBtn.addEventListener('click', resetSettings);
}

// Variables para las gráficas
let dashboardChart = null;
let ventasChart = null;
let membresiasChart = null;

// Función para inicializar la gráfica del Dashboard
function initDashboardChart() {
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    const data = {
        labels: [],
        datasets: [{
            label: 'Ingresos (Últimos 7 Días)',
            data: [],
            backgroundColor: 'rgba(0, 242, 255, 0.2)',
            borderColor: neonCyan,
            borderWidth: 3,
            pointBackgroundColor: neonCyan,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: neonCyan,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: true
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 2, 33, 0.9)',
                    titleColor: neonCyan,
                    bodyColor: textColor,
                    borderColor: neonCyan,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Ingresos: $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            }
        }
    };

    dashboardChart = new Chart(ctx, config);
}

// Función para inicializar las gráficas de Reportes
function initReportesCharts() {
    // Gráfica de Ventas Mensuales (Barras)
    const ventasCtx = document.getElementById('ventasChart').getContext('2d');
    const ventasData = {
        labels: [],
        datasets: [{
            label: 'Ventas Mensuales',
            data: [],
            backgroundColor: [
                'rgba(159, 47, 255, 0.8)',
                'rgba(0, 242, 255, 0.8)',
                'rgba(223, 255, 0, 0.8)',
                'rgba(255, 58, 87, 0.8)',
                'rgba(40, 201, 151, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(108, 117, 125, 0.8)',
                'rgba(23, 162, 184, 0.8)',
                'rgba(40, 167, 69, 0.8)',
                'rgba(220, 53, 69, 0.8)',
                'rgba(102, 16, 242, 0.8)',
                'rgba(255, 64, 129, 0.8)'
            ],
            borderColor: neonPurple,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: 'rgba(159, 47, 255, 1)',
            hoverBorderColor: neonCyan,
            hoverBorderWidth: 3
        }]
    };
    ventasChart = new Chart(ventasCtx, {
        type: 'bar',
        data: ventasData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { 
                        color: textColor, 
                        font: { 
                            weight: 'bold',
                            size: 14
                        },
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    }
                },
                x: { 
                    ticks: { 
                        color: textColor, 
                        font: { 
                            weight: 'bold',
                            size: 14
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    }
                }
            },
            plugins: {
                legend: {
                    labels: { 
                        color: textColor, 
                        font: { 
                            size: 14, 
                            weight: 'bold' 
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 2, 33, 0.9)',
                    titleColor: neonPurple,
                    bodyColor: textColor,
                    borderColor: neonPurple,
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Gráfica de Ventas por Membresía (Pastel)
    const membresiasCtx = document.getElementById('membresiasChart').getContext('2d');
    const membresiasData = {
        labels: [],
        datasets: [{
            label: 'Clientes por Membresía',
            data: [],
            backgroundColor: [
                'rgba(159, 47, 255, 0.8)',
                'rgba(0, 242, 255, 0.8)',
                'rgba(223, 255, 0, 0.8)',
                'rgba(255, 58, 87, 0.8)',
                'rgba(40, 201, 151, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(108, 117, 125, 0.8)',
                'rgba(23, 162, 184, 0.8)'
            ],
            borderColor: [
                'rgba(159, 47, 255, 1)',
                'rgba(0, 242, 255, 1)',
                'rgba(223, 255, 0, 1)',
                'rgba(255, 58, 87, 1)',
                'rgba(40, 201, 151, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(108, 117, 125, 1)',
                'rgba(23, 162, 184, 1)'
            ],
            borderWidth: 2,
            hoverBorderWidth: 4,
            hoverOffset: 10
        }]
    };
    membresiasChart = new Chart(membresiasCtx, {
        type: 'doughnut',
        data: membresiasData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 2, 33, 0.9)',
                    titleColor: neonCyan,
                    bodyColor: textColor,
                    borderColor: neonCyan,
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Función para cargar todos los datos del dashboard
async function loadDashboardData() {
    try {
        const responseStats = await fetch('/api/dashboard/stats');
        const stats = await responseStats.json();
        document.getElementById('totalClientes').textContent = stats.totalClientes;
        document.getElementById('ventasDia').textContent = `$${(stats.ventasDia || 0).toFixed(2)}`;
        document.getElementById('productosStock').textContent = stats.stockTotal || 0;

        const responseChart = await fetch('/api/dashboard/ventas-semanales');
        const chartData = await responseChart.json();
        if (dashboardChart) {
            dashboardChart.data.labels = chartData.labels;
            dashboardChart.data.datasets[0].data = chartData.data;
            dashboardChart.update('active');
        }

    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        document.getElementById('totalClientes').textContent = 'N/A';
        document.getElementById('ventasDia').textContent = 'N/A';
        document.getElementById('productosStock').textContent = 'N/A';
    }
}

// --- FUNCIONES DEL HISTORIAL ---

// Función para cargar el historial
async function loadHistorial() {
    console.log('📋 Cargando historial... (DEBUG)');
    await renderSuscripcionesTable();
    renderHistorialTable();
    setupHistorialSearch();
}

// Función para renderizar la tabla de suscripciones que terminan pronto
async function renderSuscripcionesTable() {
    const tbody = document.getElementById('suscripcionesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    try {
        const response = await fetch('/api/suscripciones/terminan-pronto');
        if (!response.ok) throw new Error('Error al obtener suscripciones');
        const suscripcionesProximas = await response.json();

        suscripcionesProximas.sort((a, b) => a.diasRestantes - b.diasRestantes);

        suscripcionesProximas.forEach(cliente => {
            const row = document.createElement('tr');
            const estado = getEstadoSuscripcion(cliente.diasRestantes);
            const diasClass = getDiasClass(cliente.diasRestantes);

            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellidos}</td>
                <td>${cliente.tipoMembresia}</td>
                <td>${formatearFecha(cliente.fechaInicio)}</td>
                <td>${formatearFecha(cliente.fechaFin)}</td>
                <td class="${diasClass}">${cliente.diasRestantes > 0 ? cliente.diasRestantes + ' días' : 'Vencida hace ' + Math.abs(cliente.diasRestantes) + ' días'}</td>
                <td><span class="${estado}">${getEstadoTexto(cliente.diasRestantes)}</span></td>
                <td>
                    <button class="btn-edit" onclick="editarTipoMembresia('${cliente.id}')" title="Editar tipo de membresía">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        if (suscripcionesProximas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-color);">No hay suscripciones próximas a vencer</td></tr>';
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-color);">Error al cargar suscripciones</td></tr>';
        console.error('Error al cargar suscripciones que terminan pronto:', error);
    }
}

// Función para renderizar la tabla de historial completo
function renderHistorialTable() {
    const tbody = document.getElementById('historialTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    const historialCompleto = clientes.map(cliente => {
        const fechaInicio = new Date(cliente.fechaInicio || new Date());
        const fechaFin = new Date(cliente.fechaFin);
        const diasRestantes = Math.ceil((fechaFin - new Date()) / (1000 * 60 * 60 * 24));
        
        return {
            ...cliente,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            diasRestantes: diasRestantes
        };
    })
    // Solo mostrar clientes con membresía ACTIVA (más de 7 días restantes)
    .filter(cliente => cliente.diasRestantes > 7)
    .sort((a, b) => b.fechaInicio - a.fechaInicio); // Ordenar por fecha de registro más reciente

    if (historialCompleto.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-color);">No hay clientes con membresía activa</td></tr>';
        return;
    }

    historialCompleto.forEach(cliente => {
        const row = document.createElement('tr');
        const estado = getEstadoSuscripcion(cliente.diasRestantes);
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.edad}</td>
            <td>${cliente.tipoMembresia}</td>
            <td>${formatearFecha(cliente.fechaInicio)}</td>
            <td>${formatearFecha(cliente.fechaFin)}</td>
            <td><span class="${estado}">${getEstadoTexto(cliente.diasRestantes)}</span></td>
            <td>${formatearFecha(cliente.fechaInicio)}</td>
            <td>
                <button class="btn-edit" onclick="editarTipoMembresia('${cliente.id}')" title="Editar tipo de membresía">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para configurar la búsqueda del historial
function setupHistorialSearch() {
    const searchInput = document.getElementById('searchHistorial');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#historialTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Función para obtener el estado de la suscripción
function getEstadoSuscripcion(diasRestantes) {
    if (diasRestantes < 0) {
        return 'estado-vencida';
    } else if (diasRestantes <= 7) {
        return 'estado-proximo-vencer';
    } else {
        return 'estado-activa';
    }
}

// Función para obtener la clase CSS de días restantes
function getDiasClass(diasRestantes) {
    if (diasRestantes < 0) {
        return 'dias-criticos';
    } else if (diasRestantes <= 7) {
        return 'dias-advertencia';
    } else {
        return 'dias-normales';
    }
}

// Función para obtener el texto del estado
function getEstadoTexto(diasRestantes) {
    if (diasRestantes < 0) {
        return 'VENCIDA';
    } else if (diasRestantes <= 7) {
        return 'PRÓXIMO A VENCER';
    } else {
        return 'ACTIVA';
    }
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// --- FUNCIONES DE INSTRUCTORES ---

// Función para cargar instructores
function loadInstructores() {
    renderInstructoresGrid();
    renderInstructoresTable();
    setupInstructoresFilters();
    setupInstructoresSearch();
    actualizarContadoresFiltros();
    
    // Restaurar filtro guardado
    const filtroGuardado = localStorage.getItem('instructoresFilter');
    if (filtroGuardado) {
        filterInstructores(filtroGuardado);
    } else {
        filterInstructores('todos');
    }
}

// Función para renderizar la vista de catálogo de instructores
function renderInstructoresGrid() {
    const grid = document.getElementById('instructoresGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    instructores.forEach(instructor => {
        const card = document.createElement('div');
        card.className = 'instructor-card';
        card.setAttribute('data-especialidad', instructor.especialidad);
        
        const especialidadText = getEspecialidadText(instructor.especialidad);
        const especialidadIcon = getEspecialidadIcon(instructor.especialidad);
        
        // Determinar URL de la foto
        let fotoUrl = 'Imagenes/Logo2.png'; // Usar el logo como imagen por defecto
        if (instructor.foto) {
            if (instructor.foto.data) {
                // Si es un archivo guardado en MongoDB
                fotoUrl = `/api/instructores/${instructor._id}/foto`;
            } else if (typeof instructor.foto === 'string') {
                // Si es una URL de archivo (compatibilidad con datos existentes)
                fotoUrl = instructor.foto;
            }
        }
        
        card.innerHTML = `
            <div class="instructor-header">
                <img src="${fotoUrl}" 
                     alt="${instructor.nombre}" 
                     class="instructor-foto"
                     onerror="this.src='Imagenes/Logo2.png'">
                <div class="instructor-info">
                    <h3>${instructor.nombre}</h3>
                    <span class="instructor-especialidad">
                        <i class="${especialidadIcon}"></i> ${especialidadText}
                    </span>
                </div>
            </div>
            <div class="instructor-contacto">
                <div class="contacto-item">
                    <i class="fas fa-phone"></i>
                    <span>${instructor.telefono || 'No disponible'}</span>
                </div>
                <div class="contacto-item">
                    <i class="fas fa-mobile-alt"></i>
                    <span>${instructor.celular || 'No disponible'}</span>
                </div>
                <div class="contacto-item">
                    <i class="fas fa-envelope"></i>
                    <span>${instructor.email || 'No disponible'}</span>
                </div>
            </div>
            <div class="instructor-descripcion">
                ${instructor.descripcion || 'Sin descripción disponible.'}
            </div>
            <div class="instructor-actions">
                ${instructor.contrato ? 
                    `<button class="instructor-btn ver-contrato" onclick="verContrato('${instructor._id}')" title="Ver Contrato">
                        <i class="fas fa-file-contract"></i> Contrato
                    </button>` : ''
                }
                <button class="instructor-btn editar" onclick="editInstructor('${instructor._id}')" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="instructor-btn eliminar" onclick="deleteInstructor('${instructor._id}')" title="Eliminar">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Función para renderizar la tabla de instructores
function renderInstructoresTable() {
    const tbody = document.getElementById('instructoresTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    instructores.forEach(instructor => {
        const row = document.createElement('tr');
        
        // Determinar URL de la foto
        let fotoUrl = 'Imagenes/default-instructor.jpg';
        if (instructor.foto) {
            if (instructor.foto.data) {
                // Si es un archivo guardado en MongoDB
                fotoUrl = `/api/instructores/${instructor._id}/foto`;
            } else if (typeof instructor.foto === 'string') {
                // Si es una URL de archivo (compatibilidad con datos existentes)
                fotoUrl = instructor.foto;
            }
        }
        
        row.innerHTML = `
            <td>${instructor._id}</td>
            <td>
                <img src="${fotoUrl}" 
                     alt="${instructor.nombre}" 
                     class="producto-imagen-tabla"
                     onerror="this.src='Imagenes/Logo2.png'">
            </td>
            <td>${instructor.nombre}</td>
            <td><span class="badge badge-primary">${getEspecialidadText(instructor.especialidad)}</span></td>
            <td>${instructor.telefono}</td>
            <td>${instructor.celular}</td>
            <td>${instructor.email}</td>
            <td><span class="badge badge-success">${instructor.estado || 'Activo'}</span></td>
            <td>
                <div class="action-buttons">
                    ${instructor.contrato ? 
                        `<button class="btn-edit" onclick="verContrato('${instructor._id}')" title="Ver Contrato">
                            <i class="fas fa-file-contract"></i>
                        </button>` : ''
                    }
                    <button class="btn-edit" onclick="editInstructor('${instructor._id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteInstructor('${instructor._id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Función para configurar filtros de instructores
function setupInstructoresFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterInstructores(filter);
            
            // Limpiar búsqueda cuando se cambia de filtro
            const searchInput = document.getElementById('searchInstructor');
            if (searchInput) {
                searchInput.value = '';
            }
        });
    });
}

// Función para filtrar instructores
function filterInstructores(filter) {
    const cards = document.querySelectorAll('.instructor-card');
    const tbody = document.getElementById('instructoresTableBody');
    
    // Filtrar tarjetas
    cards.forEach(card => {
        if (filter === 'todos') {
            card.style.display = 'block';
        } else {
            const especialidad = card.getAttribute('data-especialidad');
            if (especialidad === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Filtrar tabla si está visible
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const especialidadCell = row.querySelector('td:nth-child(4)');
            if (especialidadCell) {
                const especialidadText = especialidadCell.textContent.toLowerCase();
                if (filter === 'todos') {
                    row.style.display = '';
                } else {
                    const filterText = getEspecialidadText(filter).toLowerCase();
                    if (especialidadText.includes(filterText)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            }
        });
    }
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Guardar filtro actual en localStorage
    localStorage.setItem('instructoresFilter', filter);
}

// Función para aplicar filtro automáticamente después de agregar/editar instructor
function aplicarFiltroAutomatico(especialidad) {
    if (especialidad && especialidad !== '') {
        filterInstructores(especialidad);
        
        // Mostrar mensaje informativo
        const especialidadText = getEspecialidadText(especialidad);
        showModalMessage(`Instructor agregado a la categoría: ${especialidadText}`, 'success');
    } else {
        filterInstructores('todos');
    }
}

// Función para cambiar entre vista de catálogo y tabla
function toggleInstructoresView() {
    const grid = document.getElementById('instructoresGrid');
    const tableContainer = document.getElementById('instructoresTableContainer');
    const toggleText = document.getElementById('viewToggleText');
    
    if (grid.style.display === 'none') {
        grid.style.display = 'grid';
        tableContainer.style.display = 'none';
        toggleText.textContent = 'Vista Tabla';
    } else {
        grid.style.display = 'none';
        tableContainer.style.display = 'block';
        toggleText.textContent = 'Vista Catálogo';
    }
}

// Función para mostrar formulario de instructor
function showInstructorForm(instructor = null) {
    const modal = document.getElementById('instructorModal');
    const title = document.getElementById('instructorModalTitle');
    const form = document.getElementById('instructorForm');
    
    if (instructor) {
        title.textContent = 'Editar Instructor';
        document.getElementById('instructorId').value = instructor._id || '';
        document.getElementById('instructorNombre').value = instructor.nombre || '';
        document.getElementById('instructorEmail').value = instructor.email || '';
        document.getElementById('instructorTelefono').value = instructor.telefono || '';
        document.getElementById('instructorCelular').value = instructor.celular || '';
        document.getElementById('instructorDescripcion').value = instructor.descripcion || '';
        
        // Nuevos campos
        document.getElementById('instructorSalario').value = instructor.salario || 2500;
        document.getElementById('instructorExperiencia').value = instructor.experiencia || 0;
        document.getElementById('instructorHorarios').value = instructor.horarios || 'Lunes a Viernes 6:00 AM - 10:00 PM';
        document.getElementById('instructorCertificaciones').value = instructor.certificaciones || '';
        document.getElementById('instructorEspecialidadesAdicionales').value = instructor.especialidadesAdicionales || '';
        document.getElementById('instructorNotas').value = instructor.notas || '';
    } else {
        title.textContent = 'Nuevo Instructor';
        form.reset();
        
        // Establecer valores por defecto para nuevos campos
        document.getElementById('instructorSalario').value = 2500;
        document.getElementById('instructorExperiencia').value = 0;
        document.getElementById('instructorHorarios').value = 'Lunes a Viernes 6:00 AM - 10:00 PM';
        document.getElementById('instructorCertificaciones').value = '';
        document.getElementById('instructorEspecialidadesAdicionales').value = '';
        document.getElementById('instructorNotas').value = '';
        
        // Generar ID temporal para nuevo instructor
        const tempId = 'TEMP_' + Date.now();
        document.getElementById('instructorId').value = tempId;
    }
    
    modal.style.display = 'block';
}

// Función para cerrar modal de instructor
function closeInstructorModal() {
    document.getElementById('instructorModal').style.display = 'none';
}

// Función para editar instructor
function editInstructor(id) {
    const instructor = instructores.find(i => i._id === id);
    if (instructor) {
        showInstructorForm(instructor);
    } else {
        console.error('❌ Instructor no encontrado con ID:', id);
        showAlert('Instructor no encontrado', 'error');
    }
}

// Función para eliminar instructor
async function deleteInstructor(id) {
    if (confirm('¿Está seguro de que desea eliminar este instructor?')) {
        try {
            const response = await fetch(`/api/instructores/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                instructores = instructores.filter(i => i._id !== id);
                renderInstructoresGrid();
                renderInstructoresTable();
                showAlert('Instructor eliminado correctamente', 'success');
            } else {
                showAlert('Error al eliminar instructor', 'error');
            }
        } catch (error) {
            console.error('Error eliminando instructor:', error);
            showAlert('Error de conexión', 'error');
        }
    }
}

// Función para ver contrato
function verContrato(instructorId) {
    const instructor = instructores.find(i => i._id === instructorId);
    if (!instructor || !instructor.contrato) {
        showAlert('No hay contrato disponible para este instructor', 'warning');
        return;
    }
    
    // Determinar URL del contrato
    let contratoUrl;
    if (instructor.contrato.data) {
        // Si es un archivo guardado en MongoDB
        contratoUrl = `/api/instructores/${instructorId}/contrato`;
    } else if (typeof instructor.contrato === 'string') {
        // Si es una URL de archivo (compatibilidad con datos existentes)
        contratoUrl = instructor.contrato;
    } else {
        showAlert('Formato de contrato no válido', 'error');
        return;
    }
    
    const iframe = document.getElementById('contratoIframe');
    if (iframe) {
        iframe.src = contratoUrl;
    }
    
    const modal = document.getElementById('contratoModal');
    if (modal) {
        modal.style.display = 'block';
        currentContratoInstructor = instructorId;
    }
}

// Función para cerrar modal de contrato
function closeContratoModal() {
    document.getElementById('contratoModal').style.display = 'none';
    document.getElementById('contratoIframe').src = 'about:blank';
}

// Función para descargar contrato
function downloadContrato() {
    if (!currentContratoInstructor) {
        showAlert('No hay contrato seleccionado para descargar', 'warning');
        return;
    }
    
    const instructor = instructores.find(i => i._id === currentContratoInstructor);
    if (!instructor || !instructor.contrato) {
        showAlert('No hay contrato disponible para descargar', 'warning');
        return;
    }
    
    // Crear URL para descarga
    const downloadUrl = `/api/instructores/${currentContratoInstructor}/contrato`;
    
    // Crear elemento de descarga
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = instructor.contrato.filename || 'contrato.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Descarga iniciada', 'success');
}

// Función para obtener texto de especialidad
function getEspecialidadText(especialidad) {
    const especialidades = {
        'gym': 'Gym',
        'zumba': 'Zumba',
        'crossfit': 'CrossFit',
        'box': 'Box',
        'danza': 'Danza en Telas'
    };
    return especialidades[especialidad] || especialidad;
}

// Función para obtener icono de especialidad
function getEspecialidadIcon(especialidad) {
    const iconos = {
        'gym': 'fas fa-dumbbell',
        'zumba': 'fas fa-music',
        'crossfit': 'fas fa-fire',
        'box': 'fas fa-fist-raised',
        'danza': 'fas fa-ballet'
    };
    return iconos[especialidad] || 'fas fa-user';
}

// Event listener para el formulario de instructor
document.addEventListener('DOMContentLoaded', function() {
    const instructorForm = document.getElementById('instructorForm');
    if (instructorForm) {
        instructorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar indicador de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitBtn.disabled = true;
            
            const instructorId = document.getElementById('instructorId').value;
            const formData = new FormData();
            
            formData.append('nombre', document.getElementById('instructorNombre').value);
            formData.append('especialidad', document.getElementById('instructorEspecialidad').value);
            formData.append('email', document.getElementById('instructorEmail').value);
            formData.append('telefono', document.getElementById('instructorTelefono').value);
            formData.append('celular', document.getElementById('instructorCelular').value);
            formData.append('descripcion', document.getElementById('instructorDescripcion').value);
            
            // Nuevos campos
            formData.append('salario', document.getElementById('instructorSalario').value || 2500);
            formData.append('experiencia', document.getElementById('instructorExperiencia').value || 0);
            formData.append('horarios', document.getElementById('instructorHorarios').value || 'Lunes a Viernes 6:00 AM - 10:00 PM');
            formData.append('certificaciones', document.getElementById('instructorCertificaciones').value || '');
            formData.append('especialidadesAdicionales', document.getElementById('instructorEspecialidadesAdicionales').value || '');
            formData.append('notas', document.getElementById('instructorNotas').value || '');
            
            // Adjuntar archivos si se seleccionaron
            const fotoInput = document.getElementById('instructorFoto');
            const contratoInput = document.getElementById('instructorContrato');
            
            if (fotoInput.files.length > 0) {
                formData.append('foto', fotoInput.files[0]);
            }
            if (contratoInput.files.length > 0) {
                formData.append('contrato', contratoInput.files[0]);
            }
            
            try {
                let response;
                const isUpdate = instructorId && !instructorId.startsWith('TEMP_');
                
                const url = isUpdate ? `/api/instructores/${instructorId}` : '/api/instructores';
                const method = isUpdate ? 'PUT' : 'POST';
                
                console.log('Enviando solicitud a:', url, 'con método:', method);
                
                response = await fetch(url, {
                    method: method,
                    body: formData
                });
                
                console.log('Respuesta recibida:', response.status, response.statusText);
                
                if (response.ok) {
                    const successMessage = isUpdate ? 'Instructor actualizado correctamente' : 'Instructor agregado correctamente';
                    
                    // Obtener la especialidad del instructor agregado/editado
                    const especialidadInstructor = document.getElementById('instructorEspecialidad').value;
                    
                    // Cerrar el modal inmediatamente
                    closeInstructorModal();
                    
                    // Mostrar mensaje de éxito
                    showModalMessage(successMessage, 'success');
                    
                    // Recargar datos desde el servidor
                    await cargarDatosDesdeMongoDB();
                    
                    // Actualizar vistas
                    renderInstructoresGrid();
                    renderInstructoresTable();
                    actualizarContadoresFiltros();
                    
                    // Aplicar filtro automático según la especialidad del instructor
                    aplicarFiltroAutomatico(especialidadInstructor);
                    
                    // Limpiar el formulario
                    instructorForm.reset();
                    
                } else {
                    let errorMessage = 'Error al procesar instructor';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                    } catch (parseError) {
                        console.error('Error parseando respuesta de error:', parseError);
                        errorMessage = `Error ${response.status}: ${response.statusText}`;
                    }
                    showModalMessage(errorMessage, 'error');
                }
            } catch (error) {
                console.error('❌ Error procesando instructor:', error);
                showModalMessage('Error de conexión: ' + error.message, 'error');
            } finally {
                // Restaurar el botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Función para mostrar mensajes en el modal
function showModalMessage(message, type = 'success') {
    // Usar el mismo sistema de notificaciones que showAlert
    showAlert(message, type);
}

// Función para cerrar modal de instructor mejorada
function closeInstructorModal() {
    const modal = document.getElementById('instructorModal');
    const form = document.getElementById('instructorForm');
    
    // Limpiar el formulario
    if (form) {
        form.reset();
    }
    
    // Limpiar campos específicos
    const idField = document.getElementById('instructorId');
    if (idField) {
        idField.value = '';
    }
    
    // Ocultar el modal con animación
    modal.style.display = 'none';
    
    // Remover mensajes de error/éxito que puedan estar mostrándose
    const existingMessage = document.querySelector('.modal-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Función para configurar búsqueda de instructores
function setupInstructoresSearch() {
    const searchInput = document.getElementById('searchInstructor');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.instructor-card');
        const tbody = document.getElementById('instructoresTableBody');
        
        // Filtrar tarjetas
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Filtrar tabla si está visible
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        // Si hay término de búsqueda, mostrar todos los resultados que coincidan
        // Si no hay término, restaurar el filtro anterior
        if (searchTerm === '') {
            const filtroAnterior = localStorage.getItem('instructoresFilter') || 'todos';
            filterInstructores(filtroAnterior);
        }
    });
}

// Función para actualizar contadores en los filtros
function actualizarContadoresFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        const filter = button.getAttribute('data-filter');
        let count = 0;
        
        if (filter === 'todos') {
            count = instructores.length;
        } else {
            count = instructores.filter(instructor => instructor.especialidad === filter).length;
        }
        
        // Actualizar el texto del botón con el contador
        const icon = button.querySelector('i');
        const originalText = button.textContent.replace(/\d+$/, '').trim();
        button.innerHTML = `${icon.outerHTML} ${originalText} <span class="filter-count">(${count})</span>`;
    });
}

// Nueva función para editar solo el tipo de membresía desde la tabla de suscripciones
function editarTipoMembresia(clienteId) {
    const cliente = clientes.find(c => (c.id === clienteId || c._id === clienteId));
    if (!cliente) return;
    document.getElementById('membresiaModalTitle').textContent = 'Editar Tipo de Membresía';
    document.getElementById('membresiaTipo').value = cliente.tipoMembresia || '';
    document.getElementById('membresiaModal').setAttribute('data-cliente-id', clienteId);
    document.getElementById('membresiaModal').style.display = 'block';
}

function closeMembresiaModal() {
    document.getElementById('membresiaModal').style.display = 'none';
    document.getElementById('membresiaModal').removeAttribute('data-cliente-id');
}

document.getElementById('membresiaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const clienteId = document.getElementById('membresiaModal').getAttribute('data-cliente-id');
    const nuevoTipo = document.getElementById('membresiaTipo').value;
    if (!clienteId || !nuevoTipo) return;
    try {
        const response = await fetch(`/api/clientes/${clienteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipoMembresia: nuevoTipo })
        });
        if (response.ok) {
            showAlert('Tipo de membresía actualizado correctamente', 'success');
            await cargarDatosDesdeMongoDB();
            renderHistorialTable();
            closeMembresiaModal();
        } else {
            showAlert('Error al actualizar membresía', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión', 'error');
    }
});

// Al cerrar el modal, volver a habilitar los campos
function closeClientModal() {
    const modal = document.getElementById('clientModal');
    modal.style.display = 'none';
    document.getElementById('clienteNombre').disabled = false;
    document.getElementById('clienteApellidos').disabled = false;
    document.getElementById('clienteEdad').disabled = false;
    document.getElementById('clienteEnfermedad').disabled = false;
    document.getElementById('clienteAlergia').disabled = false;
    document.getElementById('clienteDireccion').disabled = false;
    document.getElementById('clienteMembresia').disabled = false;
}

// Función para mostrar/ocultar contraseñas
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleButton = input.parentElement.querySelector('.password-toggle');
    const icon = toggleButton.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
        toggleButton.classList.add('showing');
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
        toggleButton.classList.remove('showing');
    }
}