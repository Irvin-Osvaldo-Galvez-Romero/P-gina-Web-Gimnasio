// Variables globales
let currentUser = null;
let clientes = [];
let productos = [];
let ventas = [];
let administradores = [];
let carrito = [];

// Variables para almacenar las instancias de las gráficas
let ventasMensualesChart = null;
let ventasMembresiaChart = null;

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
        
        // Cargar ventas
        const responseVentas = await fetch('/api/ventas');
        if (responseVentas.ok) {
            ventas = await responseVentas.json();
        }
        
        console.log('✅ Datos cargados desde MongoDB');
        console.log(`   - Clientes: ${clientes.length}`);
        console.log(`   - Productos: ${productos.length}`);
        console.log(`   - Administradores: ${administradores.length}`);
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
    
    // Datos de ejemplo para clientes
    clientes = [
        {
            _id: '1',
            nombre: 'Juan',
            apellidos: 'Pérez García',
            edad: 28,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Premium',
            direccion: 'Calle Principal 123, Ciudad',
            fechaInicio: '2024-01-15',
            fechaFin: '2024-02-15'
        },
        {
            _id: '2',
            nombre: 'María',
            apellidos: 'González López',
            edad: 32,
            enfermedadCronica: 'Ninguna',
            alergia: 'Ninguna',
            tipoMembresia: 'Básica',
            direccion: 'Av. Principal 456, Ciudad',
            fechaInicio: '2024-01-01',
            fechaFin: '2024-02-01'
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
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosDesdeMongoDB();
    
    // Event listener para el formulario de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    // Verificar si ya hay un usuario logueado
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        mostrarDashboard();
    }
});

// Funciones de utilidad
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('administradores', JSON.stringify(administradores));
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Funciones de navegación
function showScreen(screenName) {
    // Obtener la pantalla actual activa
    const currentScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(`${screenName}Screen`);
    
    if (!targetScreen) {
        console.error(`Pantalla ${screenName} no encontrada`);
        return;
    }
    
    // Si es la misma pantalla, no hacer nada
    if (currentScreen === targetScreen) {
        return;
    }
    
    // Determinar la dirección de la transición
    const screens = ['dashboard', 'clientes', 'ventas', 'productos', 'administradores', 'reportes'];
    const currentIndex = screens.indexOf(currentScreen.id.replace('Screen', ''));
    const targetIndex = screens.indexOf(screenName);
    
    // Remover clases de animación previas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('slide-right', 'slide-left', 'fade-up', 'scale-in');
    });
    
    // Aplicar animación de salida a la pantalla actual
    if (currentScreen) {
        currentScreen.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        currentScreen.style.opacity = '0';
        currentScreen.style.transform = 'translateY(-20px)';
        
        // Remover la clase active después de la animación de salida
        setTimeout(() => {
            currentScreen.classList.remove('active');
            currentScreen.style.transition = '';
            currentScreen.style.opacity = '';
            currentScreen.style.transform = '';
        }, 500);
    }
    
    // Aplicar animación de entrada a la nueva pantalla
    setTimeout(() => {
        targetScreen.classList.add('active');
        
        // Determinar el tipo de animación basado en la dirección
        if (targetIndex > currentIndex) {
            targetScreen.classList.add('slide-right');
        } else if (targetIndex < currentIndex) {
            targetScreen.classList.add('slide-left');
        } else {
            targetScreen.classList.add('fade-up');
        }
        
        // Remover la clase de animación después de completarse con transición suave
        setTimeout(() => {
            targetScreen.style.transition = 'all 0.3s ease-out';
            targetScreen.classList.remove('slide-right', 'slide-left', 'fade-up');
            setTimeout(() => {
                targetScreen.style.transition = '';
            }, 300);
        }, 650);
    }, 500);
    
    // Actualizar botones de navegación con animación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.transform = 'scale(1)';
    });
    
    const activeBtn = document.querySelector(`[onclick="showScreen('${screenName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            activeBtn.style.transform = '';
        }, 300);
    }
    
    // Cargar datos específicos de la pantalla
    switch(screenName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'clientes':
            loadClientes();
            break;
        case 'ventas':
            loadVentas();
            break;
        case 'productos':
            loadProductos();
            break;
        case 'administradores':
            loadAdministradores();
            break;
        case 'reportes':
            loadReportes();
            break;
    }
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
        mostrarMensaje('Por favor, completa todos los campos', 'error');
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
            
            mostrarMensaje(`¡Bienvenido ${userData.nombre}!`, 'success');
            
            // Ocultar formulario de login
            document.getElementById('loginForm').style.display = 'none';
            
            // <<--- APLICAR RESTRICCIONES DE UI --- >>
            actualizarUIporRol();

            // Mostrar dashboard
            mostrarDashboard();
            
            // Cargar datos después del login
            await cargarDatosDesdeMongoDB();
            
        } else {
            const errorData = await response.json();
            mostrarMensaje(errorData.error || 'Error en el login', 'error');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        mostrarMensaje('Error de conexión. Verifica que el servidor esté corriendo.', 'error');
    }
}

// Dashboard
function loadDashboard() {
    updateDashboardStats();
    loadDashboardChart();
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
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
        options: {
            responsive: true,
                maintainAspectRatio: false,
            scales: {
                y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString('es-MX');
                            }
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
    
    clientes.forEach(cliente => {
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

function showClientForm(cliente = null) {
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('clientModalTitle');
    const form = document.getElementById('clientForm');
    
    if (cliente) {
        title.textContent = 'Editar Cliente';
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
        showClientForm(cliente);
    } else {
        console.error('❌ Cliente no encontrado con ID:', id);
        mostrarMensaje('Cliente no encontrado', 'error');
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
                mostrarMensaje('Cliente eliminado correctamente', 'success');
            } else {
                mostrarMensaje('Error al eliminar cliente', 'error');
            }
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            mostrarMensaje('Error de conexión', 'error');
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
                mostrarMensaje('Cliente actualizado correctamente', 'success');
            } else {
                const nuevoCliente = await response.json();
                console.log('✅ Nuevo cliente creado:', nuevoCliente);
                clientes.push(nuevoCliente);
                mostrarMensaje('Cliente agregado correctamente', 'success');
            }
            
            // Recargar datos desde el servidor
            await cargarDatosDesdeMongoDB();
    renderClientesTable();
    closeClientModal();
        } else {
            const errorData = await response.json();
            console.error('❌ Error del servidor:', errorData);
            mostrarMensaje(errorData.error || 'Error al procesar cliente', 'error');
        }
    } catch (error) {
        console.error('❌ Error procesando cliente:', error);
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
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
    const searchTerm = e.target.value.toLowerCase();
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = '';
    
    const filteredClientes = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchTerm) ||
        cliente.apellidos.toLowerCase().includes(searchTerm) ||
        (cliente.id || '').toLowerCase().includes(searchTerm)
    );
    
    filteredClientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id || 'N/A'}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.edad}</td>
            <td>${cliente.enfermedadCronica || 'Ninguna'}</td>
            <td>${cliente.alergia || 'Ninguna'}</td>
            <td><span class="badge badge-info">${cliente.tipoMembresia}</span></td>
            <td>${cliente.direccion}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editCliente('${cliente.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteCliente('${cliente.id}')" title="Eliminar">
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
                <img src="${producto.imagen || 'Imagenes/Logo.png'}" alt="${producto.nombre}" class="producto-imagen">
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
            <td><img src="${producto.imagen || 'Imagenes/Logo.png'}" alt="${producto.nombre}" class="producto-imagen-tabla"></td>
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
        mostrarMensaje('Producto no encontrado', 'error');
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
                mostrarMensaje('Producto eliminado correctamente', 'success');
            } else {
                mostrarMensaje('Error al eliminar producto', 'error');
            }
        } catch (error) {
            console.error('Error eliminando producto:', error);
            mostrarMensaje('Error de conexión', 'error');
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
            const successMessage = isUpdate ? 'Producto actualizado correctamente' : 'Producto agregado correctamente';
            mostrarMensaje(successMessage, 'success');
            
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
            mostrarMensaje(errorData.error || 'Error al procesar producto', 'error');
        }
    } catch (error) {
        console.error('❌ Error procesando producto:', error);
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
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
            <td><img src="${producto.imagen || 'Imagenes/Logo.png'}" alt="${producto.nombre}" class="producto-imagen-tabla"></td>
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
        mostrarMensaje('Administrador no encontrado', 'error');
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
                mostrarMensaje('Administrador eliminado correctamente', 'success');
            } else {
                mostrarMensaje('Error al eliminar administrador', 'error');
            }
        } catch (error) {
            console.error('Error eliminando administrador:', error);
            mostrarMensaje('Error de conexión', 'error');
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
                mostrarMensaje('Administrador actualizado correctamente', 'success');
            } else {
                const nuevoAdmin = await response.json();
                console.log('✅ Nuevo administrador creado:', nuevoAdmin);
                administradores.push(nuevoAdmin);
                mostrarMensaje('Administrador agregado correctamente', 'success');
            }
            
            // Recargar datos desde el servidor
            await cargarDatosDesdeMongoDB();
    renderAdministradoresTable();
    closeAdminModal();
        } else {
            const errorData = await response.json();
            console.error('❌ Error del servidor:', errorData);
            mostrarMensaje(errorData.error || 'Error al procesar administrador', 'error');
        }
    } catch (error) {
        console.error('❌ Error procesando administrador:', error);
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
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
function loadReportes() {
    loadReportesStats();
    loadVentasMensualesChart();
    loadVentasMembresiaChart();
}

// Función para cargar estadísticas de reportes
async function loadReportesStats() {
    try {
        const response = await fetch('/api/dashboard/stats');
        const stats = await response.json();
        
        document.getElementById('ventasMensuales').textContent = '$' + stats.ventasDia.toLocaleString('es-MX');
        document.getElementById('membresiasActivas').textContent = stats.totalClientes;
        document.getElementById('ingresosMensuales').textContent = '$' + stats.ventasDia.toLocaleString('es-MX');
    } catch (error) {
        console.error('Error al cargar estadísticas de reportes:', error);
    }
}

// Función para cargar gráfica de ventas mensuales
async function loadVentasMensualesChart() {
    const canvasContainer = document.querySelector('#ventasChart').parentElement;
    canvasContainer.innerHTML = '<p style="color: #000; font-weight: bold;">Cargando datos...</p>';

    try {
        const response = await fetch('/api/reportes/ventas-mensuales');
        if (!response.ok) throw new Error('No se pudieron obtener los datos de ventas.');
        
        const chartData = await response.json();
        
        // Limpiar contenedor y recrear el canvas
        canvasContainer.innerHTML = '<canvas id="ventasChart"></canvas>';
        const ctx = document.getElementById('ventasChart').getContext('2d');

        if (ventasMensualesChart) {
            ventasMensualesChart.destroy();
        }
        
        ventasMensualesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Ventas Mensuales',
                    data: chartData.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#000000', font: { weight: 'bold' } } },
                    x: { ticks: { color: '#000000', font: { weight: 'bold' } } }
                },
                plugins: {
                    legend: { labels: { color: '#000000', font: { size: 14, weight: 'bold' } } }
                }
            }
        });

    } catch (error) {
        console.error('Error al cargar la gráfica de ventas mensuales:', error);
        canvasContainer.innerHTML = `<p style="color: #d9534f; font-weight: bold;">${error.message}</p>`;
    }
}

// Función para cargar gráfica de ventas por membresía
async function loadVentasMembresiaChart() {
    const canvasContainer = document.querySelector('#membresiasChart').parentElement;
    canvasContainer.innerHTML = '<p style="color: #000; font-weight: bold;">Cargando datos...</p>';

    try {
        const response = await fetch('/api/reportes/ventas-membresia');
        if (!response.ok) throw new Error('No se pudieron obtener los datos de membresías.');

        const chartData = await response.json();

        // Limpiar contenedor y recrear el canvas
        canvasContainer.innerHTML = '<canvas id="membresiasChart"></canvas>';
        const ctx = document.getElementById('membresiasChart').getContext('2d');

        if (ventasMembresiaChart) {
            ventasMembresiaChart.destroy();
        }
        
        if (chartData.labels.length === 0) {
            canvasContainer.innerHTML = '<p style="color: #000; font-weight: bold;">No hay datos de membresías para mostrar.</p>';
            return;
        }
        
        ventasMembresiaChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Clientes por Membresía',
                    data: chartData.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 205, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#000000', font: { size: 14, weight: 'bold' } }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error al cargar la gráfica de ventas por membresía:', error);
        canvasContainer.innerHTML = `<p style="color: #d9534f; font-weight: bold;">${error.message}</p>`;
    }
}

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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay una sesión activa
    if (currentUser) {
        showScreen('dashboard');
    } else {
        showScreen('login');
    }
    
    // Verificar membresías cada 5 minutos
    setInterval(checkMembresias, 5 * 60 * 1000);
});

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo === 'error' ? 'danger' : tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del body
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Función para mostrar dashboard
function mostrarDashboard() {
    // Obtener la pantalla de login
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    
    if (loginScreen && dashboardScreen) {
        // Animación de salida del login
        loginScreen.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        loginScreen.style.opacity = '0';
        loginScreen.style.transform = 'scale(0.9) translateY(-50px)';
        
        // Después de la animación de salida, mostrar dashboard
        setTimeout(() => {
            loginScreen.classList.remove('active');
            loginScreen.style.transition = '';
            loginScreen.style.opacity = '';
            loginScreen.style.transform = '';
            
            // Mostrar dashboard con animación
            dashboardScreen.classList.add('active');
            dashboardScreen.classList.add('scale-in');
            
            // Remover la clase de animación después de completarse con transición suave
            setTimeout(() => {
                dashboardScreen.style.transition = 'all 0.3s ease-out';
                dashboardScreen.classList.remove('scale-in');
                setTimeout(() => {
                    dashboardScreen.style.transition = '';
                }, 300);
            }, 700);
            
            // Cargar datos del dashboard
            loadDashboard();
        }, 700);
    } else {
        // Fallback si no se encuentran las pantallas
        showScreen('dashboard');
        loadDashboard();
    }
} 