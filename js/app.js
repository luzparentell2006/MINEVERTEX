// VARIABLES GLOBALES
let usuarioActual = null;
let inversiones = [];
let referidos = [];

// INICIALIZAR
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosLocales();
    inicializarEventos();
    inicializarCarrusel();
});

// CARGAR DATOS DEL LOCAL STORAGE
function cargarDatosLocales() {
    const usuario = localStorage.getItem('usuarioMinevertex');
    if (usuario) {
        usuarioActual = JSON.parse(usuario);
        mostrarInterfazPrincipal();
    }
}

// INICIALIZAR EVENTOS
function inicializarEventos() {
    // REGISTRO
    document.getElementById('formulario-registro')?.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarUsuario();
    });

    // NAVEGACIÓN
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const seccion = this.dataset.nav;
            cambiarSeccion(seccion);
        });
    });

    // OPCIONES CIRCULARES
    document.querySelectorAll('.opcion-circular').forEach(btn => {
        btn.addEventListener('click', function() {
            const opcion = this.dataset.opcion;
            abrirModal(opcion);
        });
    });

    // BOTÓN INVERTIR
    document.querySelector('.btn-invertir')?.addEventListener('click', function() {
        abrirModal('invertir');
    });

    // CERRAR MODALES
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // CERRAR MODAL AL HACER CLICK FUERA
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });

    // BOTÓN LOGOUT
    document.getElementById('btn-logout')?.addEventListener('click', function() {
        cerrarSesion();
    });

    // CANTIDAD EN MODAL INVERTIR
    document.getElementById('cantidad-inversion')?.addEventListener('input', function() {
        actualizarResumenInversion();
    });

    // COMISIÓN DIARIA
    document.getElementById('btn-comision-diaria')?.addEventListener('click', function() {
        reclamarComisionDiaria();
    });
}

// REGISTRAR USUARIO
function registrarUsuario() {
    const documento = document.getElementById('documento').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;

    if (!documento || !nombre || !apellido || !correo || !telefono) {
        alert('Por favor completa todos los campos');
        return;
    }

    usuarioActual = {
        documento,
        nombre,
        apellido,
        correo,
        telefono,
        saldoUSDT: 500,
        codigoReferencia: generarCodigoReferencia(),
        fechaRegistro: new Date().toLocaleDateString('es-ES'),
        inversiones: [],
        referidos: []
    };

    localStorage.setItem('usuarioMinevertex', JSON.stringify(usuarioActual));
    document.getElementById('registro-container').style.display = 'none';
    mostrarInterfazPrincipal();
}

// GENERAR CÓDIGO DE REFERENCIA
function generarCodigoReferencia() {
    return 'REF-' + Math.random().toString(36).substring(2, 11).toUpperCase();
}

// MOSTRAR INTERFAZ PRINCIPAL
function mostrarInterfazPrincipal() {
    document.getElementById('registro-container').style.display = 'none';
    document.getElementById('app-container').classList.remove('hidden');
    actualizarInterfaz();
}

// ACTUALIZAR INTERFAZ
function actualizarInterfaz() {
    if (!usuarioActual) return;

    // HEADER
    document.getElementById('correo-display').textContent = usuarioActual.correo;
    document.getElementById('saldo-usdt').textContent = usuarioActual.saldoUSDT.toFixed(2);

    // PERFIL
    document.getElementById('perfil-documento').textContent = usuarioActual.documento;
    document.getElementById('perfil-nombre').textContent = usuarioActual.nombre + ' ' + usuarioActual.apellido;
    document.getElementById('perfil-correo').textContent = usuarioActual.correo;
    document.getElementById('perfil-telefono').textContent = usuarioActual.telefono;
    document.getElementById('perfil-fecha').textContent = usuarioActual.fechaRegistro;

    // CÓDIGO DE REFERENCIA
    document.getElementById('codigo-referencia').textContent = usuarioActual.codigoReferencia;
    const enlaceReferencia = window.location.href + '?ref=' + usuarioActual.codigoReferencia;
    document.getElementById('enlace-referencia').value = enlaceReferencia;

    // INVERSIONES
    actualizarSeccionProyectos();
    actualizarSeccionEquipo();
}

// ABRIR MODAL
function abrirModal(tipo) {
    let modalId = '';
    switch(tipo) {
        case 'recarga':
            modalId = 'modal-recarga';
            break;
        case 'retirar':
            modalId = 'modal-retirar';
            break;
        case 'aplicacion':
            modalId = 'modal-aplicacion';
            break;
        case 'perfil-empresa':
            modalId = 'modal-perfil-empresa';
            break;
        case 'invitar':
            modalId = 'modal-invitar';
            break;
        case 'cooperacion':
            modalId = 'modal-cooperacion';
            break;
        case 'invertir':
            modalId = 'modal-invertir';
            actualizarResumenInversion();
            break;
    }

    if (modalId) {
        document.getElementById(modalId)?.classList.add('active');
    }
}

// COPIAR TEXTO
function copiarTexto(elementId) {
    const elemento = document.getElementById(elementId);
    const texto = elemento.textContent;
    navigator.clipboard.writeText(texto).then(() => {
        alert('¡Copiado al portapapeles!');
    });
}

// CAMBIAR SECCIÓN
function cambiarSeccion(seccion) {
    // OCULTAR TODAS
    document.querySelectorAll('[id^="seccion-"]').forEach(s => {
        s.classList.remove('seccion-activa');
        s.classList.add('seccion-oculta');
    });

    // MOSTRAR SELECCIONADA
    const seccionEl = document.getElementById('seccion-' + seccion);
    if (seccionEl) {
        seccionEl.classList.remove('seccion-oculta');
        seccionEl.classList.add('seccion-activa');
    }

    // ACTUALIZAR NAV
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.nav === seccion) {
            btn.classList.add('active');
        }
    });
}

// REALIZAR INVERSIÓN
function realizarInversion() {
    const cantidad = parseFloat(document.getElementById('cantidad-inversion').value);

    if (cantidad < 50) {
        alert('La inversión mínima es 50 USDT');
        return;
    }

    if (cantidad > usuarioActual.saldoUSDT) {
        alert('Saldo insuficiente');
        return;
    }

    const inversion = {
        id: Date.now(),
        cantidad,
        ganancia: cantidad,
        fechaInicio: new Date(),
        fechaVencimiento: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
        dias: 31,
        comisionDiaria: (cantidad / 31).toFixed(2),
        reclamadas: 0,
        completada: false
    };

    usuarioActual.inversiones.push(inversion);
    usuarioActual.saldoUSDT -= cantidad;

    localStorage.setItem('usuarioMinevertex', JSON.stringify(usuarioActual));
    actualizarInterfaz();
    
    alert('¡Inversión realizada exitosamente!');
    document.getElementById('modal-invertir').classList.remove('active');
}

// ACTUALIZAR RESUMEN INVERSIÓN
function actualizarResumenInversion() {
    const cantidad = parseFloat(document.getElementById('cantidad-inversion').value) || 50;
    const ganancia = cantidad;
    const total = cantidad + ganancia;

    document.getElementById('resumen-inversion').textContent = cantidad.toFixed(2) + ' USDT';
    document.getElementById('resumen-ganancia').textContent = ganancia.toFixed(2) + ' USDT';
    document.getElementById('resumen-total').textContent = total.toFixed(2) + ' USDT';
}

// RECLAMAR COMISIÓN DIARIA
function reclamarComisionDiaria() {
    if (usuarioActual.inversiones.length === 0) {
        alert('No tienes inversiones activas');
        return;
    }

    let comisionTotal = 0;
    const hoy = new Date().toDateString();

    usuarioActual.inversiones.forEach(inv => {
        if (!inv.completada && inv.dias > 0) {
            const comisionDiaria = parseFloat(inv.comisionDiaria);
            comisionTotal += comisionDiaria;
            inv.dias--;
            inv.reclamadas++;

            if (inv.dias === 0) {
                inv.completada = true;
                comisionTotal += inv.cantidad;
            }
        }
    });

    if (comisionTotal > 0) {
        usuarioActual.saldoUSDT += comisionTotal;
        localStorage.setItem('usuarioMinevertex', JSON.stringify(usuarioActual));
        actualizarInterfaz();
        alert('¡Comisión de ' + comisionTotal.toFixed(2) + ' USDT reclamada!');
    } else {
        alert('Ya reclamaste tu comisión de hoy');
    }
}

// ACTUALIZAR SECCIÓN PROYECTOS
function actualizarSeccionProyectos() {
    const montoGenerado = usuarioActual.inversiones.reduce((total, inv) => {
        return total + (inv.comisionDiaria * inv.reclamadas);
    }, 0);

    document.getElementById('monto-generado').textContent = montoGenerado.toFixed(2) + ' USDT';

    const comisionDisponible = usuarioActual.inversiones.reduce((total, inv) => {
        if (!inv.completada && inv.dias > 0) {
            return total + parseFloat(inv.comisionDiaria);
        }
        return total;
    }, 0);

    document.getElementById('comision-monto').textContent = comisionDisponible.toFixed(2);

    // LISTAR INVERSIONES
    const listaInversiones = document.getElementById('lista-inversiones');
    if (usuarioActual.inversiones.length > 0) {
        listaInversiones.innerHTML = usuarioActual.inversiones.map(inv => `
            <div class="inversion-item" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: var(--text-secondary);">Inversión</span>
                    <span style="color: var(--success-color); font-weight: bold;">${inv.cantidad.toFixed(2)} USDT</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: var(--text-secondary);">Comisión Diaria</span>
                    <span style="color: var(--secondary-color);">${inv.comisionDiaria} USDT</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Días Restantes</span>
                    <span style="color: ${inv.dias > 0 ? 'var(--accent-color)' : 'var(--success-color)'};">${inv.dias > 0 ? inv.dias : 'Completada'}</span>
                </div>
            </div>
        `).join('');
    }
}

// ACTUALIZAR SECCIÓN EQUIPO
function actualizarSeccionEquipo() {
    const stats = document.querySelectorAll('.stat-card');
    if (stats.length >= 3) {
        stats[0].querySelector('.stat-valor').textContent = usuarioActual.referidos.length;
        stats[1].querySelector('.stat-valor').textContent = usuarioActual.referidos.length;
        
        const gananciasReferidos = usuarioActual.referidos.reduce((total, ref) => {
            return total + (ref.ganancia || 0);
        }, 0);
        stats[2].querySelector('.stat-valor').textContent = gananciasReferidos.toFixed(2) + ' USDT';
    }
}

// CERRAR SESIÓN
function cerrarSesion() {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('usuarioMinevertex');
        usuarioActual = null;
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('registro-container').style.display = 'flex';
        document.getElementById('formulario-registro').reset();
    }
}

// BOTÓN CONFIRMAR INVERSIÓN
document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmarInversion = document.querySelector('.btn-confirmar-inversion');
    if (btnConfirmarInversion) {
        btnConfirmarInversion.addEventListener('click', realizarInversion);
    }
});
