// ========== VARIABLES GLOBALES ==========
let usuarioActual = null;
let carouselIndex = 0;
const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    configurarEventos();
    iniciarCarrusel();
});

function verificarSesion() {
    const sesion = localStorage.getItem('sesionActual');
    if (sesion) {
        usuarioActual = JSON.parse(sesion);
        mostrarPagina('hogarPage');
        cargarDatosUsuario();
        ocultarNavegacion(false);
    } else {
        mostrarPagina('loginPage');
        ocultarNavegacion(true);
    }
}

// ========== CONFIGURAR EVENTOS ==========
function configurarEventos() {
    // Evento de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        realizarLogin();
    });

    // Evento de registro
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        realizarRegistro();
    });

    // Evento de retiro
    document.getElementById('retirarForm').addEventListener('submit', function(e) {
        e.preventDefault();
        procesarRetiro();
    });
}

// ========== AUTENTICACIÓN ==========
function mostrarRegistro() {
    mostrarPagina('registroPage');
}

function mostrarLogin() {
    mostrarPagina('loginPage');
    limpiarFormularios();
}

function realizarLogin() {
    const correo = document.getElementById('loginCorreo').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const usuario = usuarios.find(u => u.correo === correo && u.password === password);

    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('sesionActual', JSON.stringify(usuario));
        localStorage.setItem('codigoReferral', usuario.codigoReferral);
        
        mostrarPagina('hogarPage');
        cargarDatosUsuario();
        ocultarNavegacion(false);
        limpiarFormularios();
        mostrarNotificacion('¡Bienvenido de vuelta!', 'success');
    } else {
        mostrarNotificacion('Correo o contraseña incorrectos', 'error');
    }
}

function realizarRegistro() {
    const documento = document.getElementById('documento').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    // Validaciones
    if (!documento || !nombre || !apellido || !correo || !password || !telefono) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }

    if (usuarios.find(u => u.correo === correo)) {
        mostrarNotificacion('Este correo ya está registrado', 'error');
        return;
    }

    if (password.length < 6) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        documento,
        nombre,
        apellido,
        correo,
        password,
        telefono,
        saldo: 0,
        codigoReferral: generarCodigoReferral(),
        proyectos: [],
        equipo: [],
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    usuarioActual = nuevoUsuario;
    localStorage.setItem('sesionActual', JSON.stringify(nuevoUsuario));
    localStorage.setItem('codigoReferral', nuevoUsuario.codigoReferral);

    mostrarPagina('hogarPage');
    cargarDatosUsuario();
    ocultarNavegacion(false);
    limpiarFormularios();
    mostrarNotificacion('¡Registro exitoso! Bienvenido a Minevertex', 'success');
}

// ========== NAVEGACIÓN DE PÁGINAS ==========
function mostrarPagina(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function ocultarNavegacion(ocultar) {
    const nav = document.querySelector('.bottom-nav');
    nav.style.display = ocultar ? 'none' : 'flex';
}

function irAHogar() {
    mostrarPagina('hogarPage');
    actualizarNavButtons('hogar');
}

function irAProyectos() {
    mostrarPagina('proyectosPage');
    actualizarNavButtons('proyectos');
    cargarProyectosUsuario();
}

function irAEquipo() {
    mostrarPagina('equipoPage');
    actualizarNavButtons('equipo');
    cargarEquipoUsuario();
}

function irAAmi() {
    mostrarPagina('amiPage');
    actualizarNavButtons('ami');
    cargarPerfilUsuario();
}

function actualizarNavButtons(seccion) {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (seccion === 'hogar') buttons[0].classList.add('active');
    else if (seccion === 'proyectos') buttons[1].classList.add('active');
    else if (seccion === 'equipo') buttons[2].classList.add('active');
    else if (seccion === 'ami') buttons[3].classList.add('active');
}

// ========== CARGAR DATOS DEL USUARIO ==========
function cargarDatosUsuario() {
    if (!usuarioActual) return;

    document.getElementById('saldoUsuario').textContent = usuarioActual.saldo.toFixed(2) + ' USDT';
}

function cargarPerfilUsuario() {
    if (!usuarioActual) return;

    document.getElementById('nombrePerfil').textContent = usuarioActual.nombre + ' ' + usuarioActual.apellido;
    document.getElementById('documentoPerfil').textContent = 'Doc: ' + usuarioActual.documento;
    document.getElementById('correoPerfil').textContent = usuarioActual.correo;
    document.getElementById('telefonoPerfil').textContent = usuarioActual.telefono;
    document.getElementById('saldoPerfil').textContent = usuarioActual.saldo.toFixed(2) + ' USDT';
}

function cargarProyectosUsuario() {
    const container = document.getElementById('misProyectos');
    
    if (!usuarioActual.proyectos || usuarioActual.proyectos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No tienes proyectos activos. ¡Invierte ahora!</p>';
        return;
    }

    container.innerHTML = usuarioActual.proyectos.map(proyecto => `
        <div class="proyecto-item">
            <h4>${proyecto.nombre}</h4>
            <p><strong>Inversión:</strong> ${proyecto.monto} USDT</p>
            <p><strong>Ganancia Esperada:</strong> ${proyecto.ganancia}%</p>
            <p><strong>Fecha:</strong> ${new Date(proyecto.fecha).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> <span style="color: #10b981; font-weight: 600;">Activo</span></p>
        </div>
    `).join('');
}

function cargarEquipoUsuario() {
    const container = document.getElementById('miEquipo');
    
    if (!usuarioActual.equipo || usuarioActual.equipo.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">Aún no tienes referidos. ¡Comparte tu código!</p>';
        return;
    }

    container.innerHTML = usuarioActual.equipo.map(miembro => `
        <div class="equipo-item">
            <h4>${miembro.nombre}</h4>
            <p><strong>Correo:</strong> ${miembro.correo}</p>
            <p><strong>Fecha de Registro:</strong> ${new Date(miembro.fecha).toLocaleDateString()}</p>
            <p><strong>Comisión Ganada:</strong> <span style="color: #10b981; font-weight: 600;">$${miembro.comision.toFixed(2)}</span></p>
        </div>
    `).join('');
}

// ========== MODALES ==========
function abrirRecarga() {
    document.getElementById('recargaModal').classList.add('active');
}

function abrirRetirar() {
    document.getElementById('retirarModal').classList.add('active');
}

function abrirReferral() {
    const codigoReferral = usuarioActual.codigoReferral;
    document.getElementById('codigoReferral').textContent = codigoReferral;
    document.getElementById('referralModal').classList.add('active');
}

function abrirEmpresa() {
    document.getElementById('empresaModal').classList.add('active');
}

function abrirCooperacion() {
    alert('Sección de Cooperación Entre Agencias - Próximamente');
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function abrirNotificaciones() {
    alert('Tienes 3 notificaciones\n\n1. Tu saldo ha aumentado\n2. Nuevo proyecto disponible\n3. Referido se ha registrado');
}

function abrirCorreos() {
    alert('Tienes 2 mensajes\n\n1. Bienvenido a Minevertex\n2. Confirmación de tu referido');
}

// ========== COPIAR A PORTAPAPELES ==========
function copiarDireccion() {
    const direccion = document.getElementById('direccionRecarga').textContent;
    copiarAlPortapapeles(direccion, 'Dirección copiada');
}

function copiarReferral() {
    const codigo = document.getElementById('codigoReferral').textContent;
    copiarAlPortapapeles(codigo, 'Código copiado');
}

function copiarAlPortapapeles(texto, mensaje) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarNotificacion(mensaje, 'success');
    }).catch(() => {
        mostrarNotificacion('Error al copiar', 'error');
    });
}

// ========== FUNCIONES DE TRANSACCIONES ==========
function procesarRetiro() {
    const codigo = document.getElementById('codigoRetiro').value.trim();
    const monto = parseFloat(document.getElementById('montoRetiro').value);
    const direccion = document.getElementById('direccionRetiro').value.trim();

    if (codigo !== usuarioActual.documento) {
        mostrarNotificacion('Código de registro incorrecto', 'error');
        return;
    }

    if (monto > usuarioActual.saldo) {
        mostrarNotificacion('Saldo insuficiente', 'error');
        return;
    }

    if (monto < 10) {
        mostrarNotificacion('El monto mínimo de retiro es 10 USDT', 'error');
        return;
    }

    if (!direccion) {
        mostrarNotificacion('Ingresa una dirección de billetera válida', 'error');
        return;
    }

    // Procesar retiro
    usuarioActual.saldo -= monto;
    localStorage.setItem('sesionActual', JSON.stringify(usuarioActual));
    
    // Actualizar en el array de usuarios
    const indice = usuarios.findIndex(u => u.correo === usuarioActual.correo);
    if (indice !== -1) {
        usuarios[indice] = usuarioActual;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    cargarDatosUsuario();
    cerrarModal('retirarModal');
    limpiarFormularios();
    mostrarNotificacion('¡Retiro procesado exitosamente! Recibirás los fondos en 24-48 horas', 'success');
}

function invertir(nombreProyecto, montoMinimo) {
    const monto = prompt(`Ingresa el monto a invertir (Mínimo: ${montoMinimo} USDT):`);

    if (monto === null) return;

    const montoNum = parseFloat(monto);

    if (isNaN(montoNum)) {
        mostrarNotificacion('Ingresa un monto válido', 'error');
        return;
    }

    if (montoNum < montoMinimo) {
        mostrarNotificacion(`El monto mínimo es ${montoMinimo} USDT`, 'error');
        return;
    }

    if (montoNum > usuarioActual.saldo) {
        mostrarNotificacion('Saldo insuficiente. Por favor recarga fondos', 'error');
        return;
    }

    // Calcular ganancia
    let ganancia = 0;
    if (nombreProyecto === 'Oro') ganancia = 15;
    else if (nombreProyecto === 'Plata') ganancia = 20;
    else if (nombreProyecto === 'Diamante') ganancia = 25;
    else if (nombreProyecto === 'Platino') ganancia = 30;

    // Crear proyecto
    const nuevoProyecto = {
        nombre: `Proyecto ${nombreProyecto}`,
        monto: montoNum,
        ganancia: ganancia,
        fecha: new Date().toISOString()
    };

    usuarioActual.proyectos.push(nuevoProyecto);
    usuarioActual.saldo -= montoNum;

    localStorage.setItem('sesionActual', JSON.stringify(usuarioActual));
    const indice = usuarios.findIndex(u => u.correo === usuarioActual.correo);
    if (indice !== -1) {
        usuarios[indice] = usuarioActual;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    cargarDatosUsuario();
    mostrarNotificacion(`¡Inversión de ${montoNum} USDT en ${nombreProyecto} realizada! Ganancia esperada: +${ganancia}%`, 'success');
}

function descargarApp() {
    alert('La aplicación se descargará en tu dispositivo.\n\nPuedes instalar esta página como app desde tu navegador:\n\n1. Chrome: Menú → "Instalar Minevertex"\n2. Safari: Compartir → "Añadir a pantalla inicio"');
}

// ========== CARRUSEL ==========
function iniciarCarrusel() {
    // Auto-avance cada 5 segundos
    setInterval(() => {
        carouselNext();
    }, 5000);
}

function carouselNext() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    items[carouselIndex].classList.remove('active');
    carouselIndex = (carouselIndex + 1) % items.length;
    items[carouselIndex].classList.add('active');
}

function carouselPrev() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    items[carouselIndex].classList.remove('active');
    carouselIndex = (carouselIndex - 1 + items.length) % items.length;
    items[carouselIndex].classList.add('active');
}

// ========== FUNCIONES AUXILIARES ==========
function generarCodigoReferral() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'REF-';
    for (let i = 0; i < 10; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

function limpiarFormularios() {
    document.getElementById('loginForm').reset();
    document.getElementById('registroForm').reset();
    document.getElementById('retirarForm').reset();
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('sesionActual');
        usuarioActual = null;
        mostrarPagina('loginPage');
        ocultarNavegacion(true);
        limpiarFormularios();
        mostrarNotificacion('Sesión cerrada correctamente', 'success');
    }
}

// ========== CERRAR MODALES AL HACER CLICK FUERA ==========
window.addEventListener('click', function(event) {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});