# Diagramas UML - Sistema de Gestión de Gimnasio

## 1. Diagrama de Clases (Class Diagram)

```plantuml
@startuml SistemaGimnasio_ClassDiagram

!theme plain
skinparam backgroundColor #ffffff
skinparam classBackgroundColor #2d2d2d
skinparam classBorderColor #9f2fff
skinparam classFontColor #ffffff
skinparam arrowColor #00f2ff

package "Entidades del Sistema" {
    class Usuario {
        -_id: ObjectId
        -nombre: String
        -email: String
        -password: String
        -rol: String
        -createdAt: Date
        -updatedAt: Date
        +login(email, password): Boolean
        +logout(): void
        +cambiarPassword(nuevaPassword): void
    }

    class Cliente {
        -_id: ObjectId
        -nombre: String
        -apellidos: String
        -email: String
        -edad: Number
        -enfermedadCronica: String
        -alergia: String
        -tipoMembresia: String
        -direccion: String
        -fechaInicio: Date
        -fechaFin: Date
        -createdAt: Date
        -updatedAt: Date
        +calcularDiasRestantes(): Number
        +renovarMembresia(tipo): void
        +verificarVencimiento(): Boolean
    }

    class Producto {
        -_id: ObjectId
        -nombre: String
        -precio: Number
        -stock: Number
        -categoria: String
        -descripcion: String
        -imagen: String
        -createdAt: Date
        -updatedAt: Date
        +actualizarStock(cantidad): void
        +verificarStockBajo(): Boolean
        +calcularValorTotal(): Number
    }

    class Venta {
        -_id: ObjectId
        -productos: Array
        -total: Number
        -fecha: Date
        -clienteId: ObjectId
        -metodoPago: String
        -createdAt: Date
        +calcularTotal(): Number
        +agregarProducto(producto, cantidad): void
        +aplicarDescuento(porcentaje): void
    }

    class Membresia {
        -_id: ObjectId
        -nombre: String
        -precio: Number
        -duracion: Number
        -descripcion: String
        -beneficios: Array
        -createdAt: Date
        -updatedAt: Date
        +calcularPrecioDescuento(descuento): Number
        +verificarDisponibilidad(): Boolean
    }

    class Configuracion {
        -_id: ObjectId
        -tipo: String
        -ultimoNumero: Number
        -valor: String
        +generarIdPersonalizado(): String
        +actualizarContador(): void
    }
}

package "Servicios de Base de Datos" {
    class MongoDBConfig {
        -client: MongoClient
        -config: Object
        +connectToMongoDB(environment): MongoClient
        +getDatabase(environment): Database
        +getCollection(collectionName, environment): Collection
        +closeConnection(): void
    }

    class ClienteService {
        +crearCliente(clienteData): ObjectId
        +obtenerClientes(): Array
        +obtenerClientePorId(id): Cliente
        +actualizarCliente(id, datos): Boolean
        +eliminarCliente(id): Boolean
        +buscarClientesPorNombre(nombre): Array
        +obtenerClientesMembresiaVencida(): Array
    }

    class ProductoService {
        +crearProducto(productoData): ObjectId
        +obtenerProductos(): Array
        +obtenerProductoPorId(id): Producto
        +actualizarProducto(id, datos): Boolean
        +eliminarProducto(id): Boolean
        +actualizarStockProducto(id, stock): Boolean
    }

    class VentaService {
        +crearVenta(ventaData): ObjectId
        +obtenerVentas(): Array
        +obtenerVentaPorId(id): Venta
        +obtenerVentasPorFecha(fechaInicio, fechaFin): Array
        +calcularEstadisticasVentas(): Object
    }
}

package "Controladores de API" {
    class AuthController {
        +login(req, res): void
        +logout(req, res): void
        +verificarToken(req, res): void
    }

    class ClienteController {
        +obtenerClientes(req, res): void
        +crearCliente(req, res): void
        +actualizarCliente(req, res): void
        +eliminarCliente(req, res): void
        +buscarClientes(req, res): void
    }

    class ProductoController {
        +obtenerProductos(req, res): void
        +crearProducto(req, res): void
        +actualizarProducto(req, res): void
        +eliminarProducto(req, res): void
        +subirImagen(req, res): void
    }

    class VentaController {
        +obtenerVentas(req, res): void
        +crearVenta(req, res): void
        +obtenerEstadisticas(req, res): void
        +obtenerVentasSemanales(req, res): void
    }

    class DashboardController {
        +obtenerEstadisticas(req, res): void
        +obtenerVentasSemanales(req, res): void
        +obtenerProductosStockBajo(req, res): void
    }
}

package "Frontend" {
    class SistemaGimnasio {
        -currentUser: Usuario
        -clientes: Array
        -productos: Array
        -ventas: Array
        -carrito: Array
        +login(email, password): void
        +logout(): void
        +cargarDatosDesdeMongoDB(): void
        +mostrarPantalla(pantalla): void
        +actualizarDashboard(): void
    }

    class DashboardUI {
        +renderizarEstadisticas(): void
        +renderizarGraficas(): void
        +actualizarNotificaciones(): void
        +mostrarAlertasMembresias(): void
    }

    class ClienteUI {
        +renderizarTablaClientes(): void
        +mostrarFormularioCliente(): void
        +editarCliente(id): void
        +eliminarCliente(id): void
        +buscarClientes(termino): void
    }

    class ProductoUI {
        +renderizarTablaProductos(): void
        +mostrarFormularioProducto(): void
        +editarProducto(id): void
        +eliminarProducto(id): void
        +renderizarGridProductos(): void
    }

    class VentaUI {
        +renderizarCarrito(): void
        +agregarAlCarrito(producto): void
        +removerDelCarrito(productoId): void
        +procesarVenta(): void
        +renderizarHistorialVentas(): void
    }
}

' Relaciones entre entidades
Usuario ||--o{ Cliente : "gestiona"
Cliente ||--o{ Venta : "realiza"
Producto ||--o{ Venta : "incluye"
Membresia ||--o{ Cliente : "tiene"

' Relaciones con servicios
MongoDBConfig ||--o{ ClienteService : "proporciona"
MongoDBConfig ||--o{ ProductoService : "proporciona"
MongoDBConfig ||--o{ VentaService : "proporciona"

' Relaciones con controladores
ClienteService ||--o{ ClienteController : "utiliza"
ProductoService ||--o{ ProductoController : "utiliza"
VentaService ||--o{ VentaController : "utiliza"

' Relaciones con frontend
SistemaGimnasio ||--o{ DashboardUI : "contiene"
SistemaGimnasio ||--o{ ClienteUI : "contiene"
SistemaGimnasio ||--o{ ProductoUI : "contiene"
SistemaGimnasio ||--o{ VentaUI : "contiene"

@enduml
```

## 2. Diagrama de Secuencia - Login de Usuario

```plantuml
@startuml SistemaGimnasio_LoginSequence

!theme plain
skinparam backgroundColor #1a1a1a
skinparam participantBackgroundColor #2d2d2d
skinparam participantBorderColor #9f2fff
skinparam participantFontColor #ffffff
skinparam sequenceArrowColor #00f2ff

actor Usuario as U
participant "Frontend" as F
participant "AuthController" as AC
participant "MongoDBConfig" as MDB
participant "Usuarios Collection" as UC
participant "SistemaGimnasio" as SG

U -> F: Ingresa email y password
F -> AC: POST /api/auth/login
activate AC

AC -> MDB: getMongoConnection()
activate MDB
MDB -> MDB: connectToMongoDB('atlas')
MDB --> AC: MongoClient
deactivate MDB

AC -> UC: findOne({email: email})
activate UC
UC --> AC: Usuario o null
deactivate UC

alt Usuario encontrado
    AC -> AC: Verificar password
    alt Password correcto
        AC -> AC: Generar userData
        AC --> F: 200 OK + userData
        F -> SG: login(userData)
        activate SG
        SG -> SG: setCurrentUser(userData)
        SG -> SG: cargarDatosDesdeMongoDB()
        SG -> SG: mostrarPantalla('dashboard')
        SG --> F: Dashboard actualizado
        deactivate SG
        F --> U: Mostrar dashboard
    else Password incorrecto
        AC --> F: 401 Unauthorized
        F --> U: Mostrar error
    end
else Usuario no encontrado
    AC --> F: 401 Unauthorized
    F --> U: Mostrar error
end

deactivate AC

@enduml
```

## 3. Diagrama de Secuencia - Crear Cliente

```plantuml
@startuml SistemaGimnasio_CrearClienteSequence

!theme plain
skinparam backgroundColor #1a1a1a
skinparam participantBackgroundColor #2d2d2d
skinparam participantBorderColor #9f2fff
skinparam participantFontColor #ffffff
skinparam sequenceArrowColor #00f2ff

actor Administrador as A
participant "ClienteUI" as CUI
participant "ClienteController" as CC
participant "ClienteService" as CS
participant "MongoDBConfig" as MDB
participant "Clientes Collection" as CL

A -> CUI: Llena formulario cliente
CUI -> CUI: Validar datos
CUI -> CC: POST /api/clientes
activate CC

CC -> CS: crearCliente(clienteData)
activate CS

CS -> MDB: getCollection('clientes')
activate MDB
MDB --> CS: Collection
deactivate MDB

CS -> CL: insertOne(clienteData)
activate CL
CL --> CS: InsertOneResult
deactivate CL

CS -> CS: Generar ID personalizado
CS --> CC: ObjectId
deactivate CS

CC --> CUI: 201 Created + clienteId
CUI -> CUI: Cerrar modal
CUI -> CUI: Actualizar tabla clientes
CUI --> A: Mostrar confirmación

deactivate CC

@enduml
```

## 4. Diagrama de Secuencia - Procesar Venta

```plantuml
@startuml SistemaGimnasio_ProcesarVentaSequence

!theme plain
skinparam backgroundColor #1a1a1a
skinparam participantBackgroundColor #2d2d2d
skinparam participantBorderColor #9f2fff
skinparam participantFontColor #ffffff
skinparam sequenceArrowColor #00f2ff

actor Vendedor as V
participant "VentaUI" as VUI
participant "VentaController" as VC
participant "VentaService" as VS
participant "ProductoService" as PS
participant "MongoDBConfig" as MDB
participant "Ventas Collection" as VEN
participant "Productos Collection" as PRO

V -> VUI: Selecciona productos
VUI -> VUI: Agregar al carrito
VUI -> VUI: Calcular total
V -> VUI: Confirmar venta
VUI -> VC: POST /api/ventas
activate VC

VC -> VS: crearVenta(ventaData)
activate VS

VS -> MDB: getCollection('ventas')
activate MDB
MDB --> VS: Collection
deactivate MDB

VS -> VEN: insertOne(ventaData)
activate VEN
VEN --> VS: InsertOneResult
deactivate VEN

loop Para cada producto en la venta
    VS -> PS: actualizarStockProducto(id, nuevaCantidad)
    activate PS
    PS -> MDB: getCollection('productos')
    MDB --> PS: Collection
    PS -> PRO: updateOne({_id}, {$set: {stock: nuevaCantidad}})
    PRO --> PS: UpdateResult
    PS --> VS: Boolean
    deactivate PS
end

VS --> VC: ObjectId
deactivate VS

VC --> VUI: 201 Created + ventaId
VUI -> VUI: Limpiar carrito
VUI -> VUI: Actualizar stock productos
VUI -> VUI: Mostrar confirmación
VUI --> V: Venta completada

deactivate VC

@enduml
```

## 5. Diagrama de Estados - Membresía de Cliente

```plantuml
@startuml SistemaGimnasio_MembresiaStates

!theme plain
skinparam backgroundColor #1a1a1a
skinparam stateBackgroundColor #2d2d2d
skinparam stateBorderColor #9f2fff
skinparam stateFontColor #ffffff
skinparam arrowColor #00f2ff

[*] --> Activa : Cliente registrado

state Activa {
    [*] --> Vigente
    Vigente --> PorVencer : < 7 días
    PorVencer --> Vigente : Renovación
    PorVencer --> Vencida : Fecha límite
}

Activa --> Vencida : Fecha de vencimiento
Vencida --> Activa : Renovación
Vencida --> Suspendida : Sin renovación
Suspendida --> Activa : Renovación
Suspendida --> Cancelada : Cancelación

state "Alertas" as Alertas {
    [*] --> SinAlertas
    SinAlertas --> AlertaPorVencer : < 7 días
    AlertaPorVencer --> AlertaVencida : Vencida
    AlertaVencida --> SinAlertas : Renovación
}

Activa --> Alertas : Verificar estado
Vencida --> Alertas : Generar alerta

[*] --> Cancelada : Cancelación directa

@enduml
```

## 6. Diagrama de Actividad - Flujo Principal del Sistema

```plantuml
@startuml SistemaGimnasio_ActivityFlow

!theme plain
skinparam backgroundColor #1a1a1a
skinparam activityBackgroundColor #2d2d2d
skinparam activityBorderColor #9f2fff
skinparam activityFontColor #ffffff
skinparam arrowColor #00f2ff

start

:Iniciar aplicación;
:Conectar a MongoDB;

if (¿Usuario autenticado?) then (Sí)
    :Cargar dashboard;
    :Mostrar estadísticas;
    :Verificar membresías vencidas;
    
    fork
        :Gestionar clientes;
        :CRUD clientes;
        :Verificar vencimientos;
    fork again
        :Gestionar productos;
        :CRUD productos;
        :Control de stock;
    fork again
        :Gestionar ventas;
        :Procesar ventas;
        :Actualizar inventario;
    fork again
        :Generar reportes;
        :Estadísticas de ventas;
        :Análisis de membresías;
    end fork
    
else (No)
    :Mostrar login;
    :Validar credenciales;
    if (¿Credenciales válidas?) then (Sí)
        :Redirigir a dashboard;
    else (No)
        :Mostrar error;
        stop
    endif
endif

:Monitorear sistema;
:Verificar alertas;

if (¿Hay alertas?) then (Sí)
    :Mostrar notificaciones;
    :Enviar recordatorios;
endif

:Actualizar dashboard;
stop

@enduml
```

## 7. Diagrama de Componentes - Arquitectura del Sistema

```plantuml
@startuml SistemaGimnasio_ComponentArchitecture

!theme plain
skinparam backgroundColor #1a1a1a
skinparam componentBackgroundColor #2d2d2d
skinparam componentBorderColor #9f2fff
skinparam componentFontColor #ffffff
skinparam arrowColor #00f2ff

package "Frontend (Cliente)" {
    [index.html] as HTML
    [script.js] as JS
    [styles.css] as CSS
    [Imagenes/] as IMG
}

package "Backend (Servidor)" {
    [server.js] as SERVER
    [mongodb-config.js] as MDB_CONFIG
    
    package "Controladores API" {
        [AuthController] as AUTH
        [ClienteController] as CLIENTE_CTRL
        [ProductoController] as PRODUCTO_CTRL
        [VentaController] as VENTA_CTRL
        [DashboardController] as DASH_CTRL
    }
    
    package "Servicios" {
        [ClienteService] as CLIENTE_SVC
        [ProductoService] as PRODUCTO_SVC
        [VentaService] as VENTA_SVC
    }
    
    package "Middleware" {
        [CORS] as CORS
        [Multer] as MULTER
        [Express] as EXPRESS
    }
}

package "Base de Datos" {
    database "MongoDB Atlas" as MONGODB {
        [usuarios] as USERS_COLL
        [clientes] as CLIENTS_COLL
        [productos] as PRODUCTS_COLL
        [ventas] as SALES_COLL
        [membresias] as MEMBERSHIPS_COLL
        [configuracion] as CONFIG_COLL
    }
}

package "Utilidades" {
    [crear-bases-datos.js] as DB_SETUP
    [agregar-clientes-ejemplo.js] as SEED_CLIENTS
    [agregar-admins-ejemplo.js] as SEED_ADMINS
    [verificar-sistema.js] as VERIFY
}

' Conexiones Frontend
HTML --> JS : incluye
HTML --> CSS : incluye
HTML --> IMG : referencia
JS --> SERVER : API calls

' Conexiones Backend
SERVER --> EXPRESS : usa
SERVER --> CORS : usa
SERVER --> MULTER : usa
SERVER --> MDB_CONFIG : usa

SERVER --> AUTH : maneja
SERVER --> CLIENTE_CTRL : maneja
SERVER --> PRODUCTO_CTRL : maneja
SERVER --> VENTA_CTRL : maneja
SERVER --> DASH_CTRL : maneja

CLIENTE_CTRL --> CLIENTE_SVC : usa
PRODUCTO_CTRL --> PRODUCTO_SVC : usa
VENTA_CTRL --> VENTA_SVC : usa

CLIENTE_SVC --> MONGODB : conecta
PRODUCTO_SVC --> MONGODB : conecta
VENTA_SVC --> MONGODB : conecta

' Conexiones Base de Datos
MONGODB --> USERS_COLL : contiene
MONGODB --> CLIENTS_COLL : contiene
MONGODB --> PRODUCTS_COLL : contiene
MONGODB --> SALES_COLL : contiene
MONGODB --> MEMBERSHIPS_COLL : contiene
MONGODB --> CONFIG_COLL : contiene

' Conexiones Utilidades
DB_SETUP --> MONGODB : configura
SEED_CLIENTS --> CLIENTS_COLL : pobla
SEED_ADMINS --> USERS_COLL : pobla
VERIFY --> MONGODB : verifica

@enduml
```

## 8. Diagrama de Casos de Uso

```plantuml
@startuml SistemaGimnasio_UseCaseDiagram

!theme plain
skinparam backgroundColor #1a1a1a
skinparam usecaseBackgroundColor #2d2d2d
skinparam usecaseBorderColor #9f2fff
skinparam usecaseFontColor #ffffff
skinparam actorBackgroundColor #2d2d2d
skinparam actorBorderColor #00f2ff
skinparam actorFontColor #ffffff

left to right direction

actor "Administrador" as Admin
actor "Vendedor" as Vendedor
actor "Cliente" as Cliente

rectangle "Sistema de Gestión de Gimnasio" {
    usecase "Iniciar Sesión" as UC1
    usecase "Gestionar Clientes" as UC2
    usecase "Gestionar Productos" as UC3
    usecase "Procesar Ventas" as UC4
    usecase "Generar Reportes" as UC5
    usecase "Gestionar Membresías" as UC6
    usecase "Ver Dashboard" as UC7
    usecase "Subir Imágenes" as UC8
    usecase "Configurar Sistema" as UC9
    usecase "Verificar Stock" as UC10
    usecase "Renovar Membresía" as UC11
    usecase "Consultar Historial" as UC12
    usecase "Gestionar Administradores" as UC13
    usecase "Exportar Datos" as UC14
    usecase "Recibir Notificaciones" as UC15
}

' Relaciones Administrador
Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC13
Admin --> UC14

' Relaciones Vendedor
Vendedor --> UC1
Vendedor --> UC2
Vendedor --> UC3
Vendedor --> UC4
Vendedor --> UC7
Vendedor --> UC10
Vendedor --> UC12

' Relaciones Cliente
Cliente --> UC11
Cliente --> UC15

' Incluye
UC2 ..> UC6 : <<include>>
UC4 ..> UC3 : <<include>>
UC4 ..> UC10 : <<include>>
UC5 ..> UC12 : <<include>>
UC7 ..> UC15 : <<include>>

' Extiende
UC1 <.. UC9 : <<extend>>
UC3 <.. UC8 : <<extend>>
UC6 <.. UC11 : <<extend>>

@enduml
```

## 9. Diagrama de Entidad-Relación (ERD)

```plantuml
@startuml SistemaGimnasio_ERD

!theme plain
skinparam backgroundColor #1a1a1a
skinparam entityBackgroundColor #2d2d2d
skinparam entityBorderColor #9f2fff
skinparam entityFontColor #ffffff
skinparam arrowColor #00f2ff

entity "usuarios" {
    * _id : ObjectId
    --
    * nombre : String
    * email : String
    * password : String
    * rol : String
    createdAt : Date
    updatedAt : Date
}

entity "clientes" {
    * _id : ObjectId
    --
    * nombre : String
    * apellidos : String
    * email : String
    * edad : Number
    enfermedadCronica : String
    alergia : String
    * tipoMembresia : String
    * direccion : String
    * fechaInicio : Date
    * fechaFin : Date
    createdAt : Date
    updatedAt : Date
}

entity "productos" {
    * _id : ObjectId
    --
    * nombre : String
    * precio : Number
    * stock : Number
    * categoria : String
    descripcion : String
    imagen : String
    createdAt : Date
    updatedAt : Date
}

entity "ventas" {
    * _id : ObjectId
    --
    * productos : Array
    * total : Number
    * fecha : Date
    clienteId : ObjectId
    metodoPago : String
    createdAt : Date
}

entity "membresias" {
    * _id : ObjectId
    --
    * nombre : String
    * precio : Number
    * duracion : Number
    descripcion : String
    beneficios : Array
    createdAt : Date
    updatedAt : Date
}

entity "configuracion" {
    * _id : ObjectId
    --
    * tipo : String
    ultimoNumero : Number
    valor : String
}

' Relaciones
usuarios ||--o{ clientes : "gestiona"
clientes ||--o{ ventas : "realiza"
productos ||--o{ ventas : "incluye"
membresias ||--o{ clientes : "tiene"
configuracion ||--o{ productos : "genera_id"

@enduml
```

## 10. Diagrama de Despliegue

```plantuml
@startuml SistemaGimnasio_DeploymentDiagram

!theme plain
skinparam backgroundColor #1a1a1a
skinparam nodeBackgroundColor #2d2d2d
skinparam nodeBorderColor #9f2fff
skinparam nodeFontColor #ffffff
skinparam arrowColor #00f2ff

node "Cliente Web" {
    [Navegador Web] as Browser
    [HTML/CSS/JS] as Frontend
}

node "Servidor Web" {
    [Node.js Runtime] as NodeJS
    [Express.js] as Express
    [MongoDB Driver] as MongoDriver
    [Multer] as Multer
    [CORS] as CORS
}

node "Base de Datos" {
    database "MongoDB Atlas" as MongoDB {
        [gimnasio_db] as Database
    }
}

node "Almacenamiento" {
    [Sistema de Archivos] as FileSystem {
        [Imagenes/] as Images
        [Logs/] as Logs
    }
}

node "Red" {
    [Internet] as Internet
    [HTTPS] as HTTPS
}

' Conexiones
Browser --> Internet : HTTP/HTTPS
Internet --> Express : Puerto 3000
Express --> NodeJS : Ejecuta en
NodeJS --> MongoDriver : Usa
MongoDriver --> MongoDB : Conecta
Express --> Multer : Usa
Express --> CORS : Usa
Multer --> FileSystem : Guarda archivos
Express --> FileSystem : Lee archivos
MongoDB --> Database : Contiene
Database --> Images : Referencia
Database --> Logs : Genera

@enduml
```

## Instrucciones para usar estos diagramas:

1. **PlantUML Online**: Ve a [plantuml.com/plantuml](http://www.plantuml.com/plantuml) y pega cualquiera de los códigos anteriores.

2. **VS Code**: Instala la extensión "PlantUML" y crea archivos `.puml` con estos códigos.

3. **Draw.io**: Puedes importar los diagramas generados por PlantUML.

4. **Herramientas locales**: Instala PlantUML localmente para generar imágenes PNG, SVG o PDF.

Estos diagramas UML proporcionan una visión completa de la arquitectura, flujos de datos, relaciones entre entidades y casos de uso de tu sistema de gestión de gimnasio. 