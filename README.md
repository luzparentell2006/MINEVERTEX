````markdown
# MINERVERTEX - Plataforma de Minería Digital

## 📋 Descripción

MINERVERTEX es una plataforma moderna de minería digital y inversión descentralizada. Permite a los usuarios registrarse, realizar inversiones, ganar comisiones diarias y construir una red de referidos.

## 🚀 Características Principales

### 1. **Sistema de Registro**
- Registro con documento, nombre, apellido, correo y teléfono
- Almacenamiento seguro de datos en Local Storage
- Cada usuario recibe un saldo inicial de 500 USDT
- Código de referencia único generado automáticamente

### 2. **Interfaz Principal - Hogar**
- **Header** con nombre de la plataforma, notificaciones, correo y saldo USDT
- **6 Opciones Circulares:**
  - 💰 **Recarga**: Enviar fondos a dirección de billetera permanente
  - 📤 **Retirar**: Retirar fondos con dirección de billetera
  - 📱 **Aplicación**: Instalar como app en el dispositivo
  - 🏢 **Perfil Empresa**: Información de la empresa
  - 👥 **Invitar Amigos**: Compartir código de referencia
  - 🤝 **Cooperación**: Red de cooperación entre agencias

### 3. **Carrusel de Imágenes**
- 4 imágenes que se cambian automáticamente
- Cambio manual con botones de navegación
- Auto rotación cada 4 segundos

### 4. **Sala de Proyectos**
- **Inversión Mínima**: 50 USDT
- **Ganancia en 31 días**: 50 USDT (100% de retorno)
- **Comisión por Referidos**: 5%
- **Comisión Diaria**: Se puede reclamar diariamente
- Monitoreo de montos generados desde la inversión

### 5. **Sistema de Navegación**
- 4 secciones principales en nav inferior:
  - 🏠 **Hogar**: Pantalla principal
  - 📊 **Proyecto**: Mis inversiones activas
  - 👨‍👩‍👧‍👦 **Equipo**: Referidos y estadísticas
  - 👤 **A Mi**: Perfil del usuario

## 📁 Estructura de Archivos

```
MINEVERTEX/
├── index.html          # Archivo HTML principal
├── css/
│   └── styles.css      # Estilos de la plataforma
├── js/
│   ├── app.js          # Lógica principal de la aplicación
│   ├── modals.js       # Manejo de modales
│   └── carrusel.js     # Funcionalidad del carrusel
└── README.md           # Este archivo
```

## 🎨 Temas de Color

```
Colores Principales:
- Primario: #1e3a8a (Azul Oscuro)
- Secundario: #00bcd4 (Cian)
- Acentro: #ffc107 (Amarillo)
- Danger: #ff5252 (Rojo)
- Success: #4caf50 (Verde)
- Fondo: #0a0e27 (Negro Azulado)
```

## 💾 Almacenamiento de Datos

Los datos se guardan en **Local Storage** con la clave `usuarioMinevertex`:

```javascript
{
    documento: "string",
    nombre: "string",
    apellido: "string",
    correo: "string",
    telefono: "string",
    saldoUSDT: number,
    codigoReferencia: "REF-XXXXXXXXX",
    fechaRegistro: "date",
    inversiones: [
        {
            id: timestamp,
            cantidad: 50,
            ganancia: 50,
            fechaInicio: "date",
            fechaVencimiento: "date",
            diasTotales: 31,
            diasRestantes: 31,
            comisionDiaria: 1.61,
            comisionesReclamadas: 0,
            completada: false,
            totalGenerado: 0
        }
    ],
    referidos: []
}
```

## 🔧 Funcionalidades JavaScript

### app.js
- `registrarUsuario()` - Registro de nuevos usuarios
- `mostrarInterfazPrincipal()` - Mostrar dashboard
- `cambiarSeccion(seccion)` - Navegar entre secciones
- `realizarInversion()` - Crear una inversión
- `reclamarComisionDiaria()` - Reclamar ganancias diarias
- `cerrarSesion()` - Logout del usuario
- `actualizarInterfaz()` - Refrescar datos en pantalla

### modals.js
- `abrirModal(tipo)` - Abrir modal específico
- `cerrarModal(modalId)` - Cerrar modal
- `procesarRetiro()` - Procesar retiro de fondos
- `instalarApp()` - Instalar como PWA
- `copiarTexto(elementId)` - Copiar texto al portapapeles
- `mostrarNotificacion()` - Mostrar notificación

### carrusel.js
- `inicializarCarrusel()` - Iniciar carrusel
- `avanzarCarrusel()` - Siguiente imagen
- `retrocederCarrusel()` - Imagen anterior
- `actualizarCarrusel()` - Actualizar posición
- Auto rotación cada 4 segundos

## 📊 Flujo de Inversión

1. Usuario hace inversión de 50 USDT (mínimo)
2. Dinero se deduce del saldo disponible
3. Se crea registro de inversión por 31 días
4. Diariamente puede reclamar comisión = inversión / 31 días
5. Al completar 31 días, recibe cantidad inversión + ganancias
6. Comisión adicional por cada referido que invierte (5%)

## 📱 Responsive Design

- Optimizado para móvil (320px - 768px)
- Tablet (768px - 1024px)
- Desktop (1024px+)
- Navegación inferior sticky para acceso fácil

## 🔐 Características de Seguridad

- Datos guardados localmente (sin servidor externo)
- Validación de formularios
- Protección contra saldos negativos
- Validación de montos mínimos

## 🌐 Dirección de Billetera Permanente

```
Dirección: 0x742d35Cc6634C0532925a3b844Bc9e7595f42e1
Red: Binance Smart Chain (BSC)
```

## 📞 Información de Contacto

```
Email: info@minervertex.com
Teléfono: +1234567890
```

## 🎯 Próximas Características

- [ ] Integración con blockchain real
- [ ] Dashboard de estadísticas avanzadas
- [ ] Historial de transacciones
- [ ] Notificaciones push
- [ ] Multi-idioma
- [ ] Autenticación de dos factores
- [ ] Exportar datos en PDF

## 📄 Licencia

Este proyecto es propietario de MINERVERTEX.

## 👨‍💻 Desarrollo

Para ejecutar la plataforma:
1. Abre `index.html` en un navegador moderno
2. Crea una cuenta con tus datos
3. ¡Comienza a invertir y ganar!

## ⚠️ Aviso Legal

MINERVERTEX es una plataforma educativa. Realiza las inversiones bajo tu propia responsabilidad.

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026
````
