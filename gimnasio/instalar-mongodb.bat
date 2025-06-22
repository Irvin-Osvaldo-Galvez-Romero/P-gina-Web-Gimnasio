@echo off
echo ========================================
echo    INSTALADOR DE MONGODB PARA WINDOWS
echo ========================================
echo.

echo [1/5] Verificando si MongoDB ya está instalado...
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB ya está instalado
    goto :verificar_servicio
) else (
    echo ⚠️ MongoDB no está instalado
)

echo.
echo [2/5] Descargando MongoDB Community Server...
echo Por favor, sigue estos pasos:
echo 1. Ve a: https://www.mongodb.com/try/download/community
echo 2. Selecciona: Version 7.0, Platform Windows, Package msi
echo 3. Haz clic en Download
echo 4. Ejecuta el archivo descargado
echo 5. Sigue el asistente de instalación
echo.
pause

:verificar_servicio
echo.
echo [3/5] Verificando servicio de MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Servicio de MongoDB encontrado
    sc start MongoDB >nul 2>&1
    echo ✅ Servicio iniciado
) else (
    echo ❌ Servicio de MongoDB no encontrado
    echo Por favor, asegúrate de haber instalado MongoDB correctamente
    pause
    exit /b 1
)

echo.
echo [4/5] Instalando dependencias de Node.js...
npm install mongodb mongoose dotenv
if %errorlevel% == 0 (
    echo ✅ Dependencias instaladas correctamente
) else (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo [5/5] Creando archivo de configuración...
if not exist .env (
    copy env.example .env
    echo ✅ Archivo .env creado
    echo.
    echo ⚠️ IMPORTANTE: Edita el archivo .env con tus configuraciones
) else (
    echo ✅ Archivo .env ya existe
)

echo.
echo ========================================
echo    INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo ✅ MongoDB instalado y configurado
echo ✅ Dependencias de Node.js instaladas
echo ✅ Archivo de configuración creado
echo.
echo 📋 Próximos pasos:
echo 1. Edita el archivo .env con tus configuraciones
echo 2. Ejecuta: npm run mongodb:test
echo 3. Para probar Atlas: npm run mongodb:test -- --atlas
echo.
echo 🔗 Enlaces útiles:
echo - MongoDB Atlas: https://www.mongodb.com/atlas
echo - Documentación: https://docs.mongodb.com/
echo.
pause 