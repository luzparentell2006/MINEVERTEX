// MANEJO DE MODALES

// CERRAR MODAL
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// CERRAR TODOS LOS MODALES
function cerrarTodosModales() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// EVENTOS DE CIERRE DE MODALES
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal al hacer click en X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });

    // MODAL RECARGA - COPIAR DIRECCIÓN
    const btnCopiarDireccion = document.querySelector('#modal-recarga .btn-copiar');
    if (btnCopiarDireccion) {
        btnCopiarDireccion.addEventListener('click', function() {
            const direccion = document.getElementById('direccion-recarga').textContent;
            navigator.clipboard.writeText(direccion).then(() => {
                alert('Dirección copiada al portapapeles');
            });
        });
    }

    // MODAL RETIRAR - ENVIAR SOLICITUD
    const btnRetirar = document.querySelector('#modal-retirar .btn-retirar');
    if (btnRetirar) {
        btnRetirar.addEventListener('click', function() {
            procesarRetiro();
        });
    }

    // MODAL APLICACIÓN - INSTALAR APP
    const btnInstallarApp = document.querySelector('#modal-aplicacion .btn-instalar-app');
    if (btnInstallarApp) {
        btnInstallarApp.addEventListener('click', function() {
            instalarApp();
        });
    }

    // MODAL INVITAR - COPIAR CÓDIGO
    const btnCopiarCodigo = document.querySelector('#modal-invitar .btn-copiar');
    if (btnCopiarCodigo) {
        btnCopiarCodigo.addEventListener('click', function() {
            const codigo = document.getElementById('codigo-referencia').textContent;
            navigator.clipboard.writeText(codigo).then(() => {
                alert('Código copiado al portapapeles');
            });
        });
    }

    // MODAL COOPERACIÓN - SOLICITAR
    const btnSolicitarCooperacion = document.querySelector('#modal-cooperacion .btn-solicitar-cooperacion');
    if (btnSolicitarCooperacion) {
        btnSolicitarCooperacion.addEventListener('click', function() {
            alert('Solicitud de cooperación enviada. Nos pondremos en contacto pronto.');
            cerrarModal('modal-cooperacion');
        });
    }

    // MODAL INVERTIR - CONFIRMAR
    const btnConfirmarInversion = document.querySelector('#modal-invertir .btn-confirmar-inversion');
    if (btnConfirmarInversion) {
        btnConfirmarInversion.addEventListener('click', function() {
            realizarInversion();
        });
    }
});

// PROCESAR RETIRO
function procesarRetiro() {
    const cantidadRetiro = parseFloat(document.getElementById('cantidad-retiro').value);
    const walletRetiro = document.getElementById('wallet-retiro').value;

    if (!cantidadRetiro || cantidadRetiro < 10) {
        alert('La cantidad mínima es 10 USDT');
        return;
    }

    if (!walletRetiro) {
        alert('Por favor ingresa una dirección de billetera válida');
        return;
    }

    if (!usuarioActual) {
        alert('Usuario no autenticado');
        return;
    }

    if (cantidadRetiro > usuarioActual.saldoUSDT) {
        alert('Saldo insuficiente');
        return;
    }

    // Procesar retiro
    usuarioActual.saldoUSDT -= cantidadRetiro;
    localStorage.setItem('usuarioMinevertex', JSON.stringify(usuarioActual));
    
    alert('¡Retiro solicitado!\n\nMonto: ' + cantidadRetiro.toFixed(2) + ' USDT\nDirección: ' + walletRetiro + '\n\nTu retiro será procesado en las próximas 24 horas.');
    
    // Limpiar formulario
    document.getElementById('cantidad-retiro').value = '';
    document.getElementById('wallet-retiro').value = '';
    
    cerrarModal('modal-retirar');
    actualizarInterfaz();
}

// INSTALAR APP
function instalarApp() {
    if ('serviceWorker' in navigator) {
        // Registrar service worker
        navigator.serviceWorker.register('sw.js').then(registration => {
            alert('Aplicación instalada correctamente. Puedes acceder desde tu pantalla de inicio.');
            cerrarModal('modal-aplicacion');
        }).catch(error => {
            console.log('Error registrando service worker:', error);
            alert('La aplicación se puede usar en modo offline.');
            cerrarModal('modal-aplicacion');
        });
    } else {
        alert('Por favor usa el navegador de tu dispositivo para instalar la aplicación.');
        cerrarModal('modal-aplicacion');
    }
}

// REALIZAR INVERSIÓN (llamada desde app.js)
function realizarInversion() {
    if (!usuarioActual) {
        alert('Usuario no autenticado');
        return;
    }

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
        fechaInicio: new Date().toLocaleDateString('es-ES'),
        fechaVencimiento: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
        diasTotales: 31,
        diasRestantes: 31,
        comisionDiaria: (cantidad / 31).toFixed(2),
        comisionesReclamadas: 0,
        completada: false,
        totalGenerado: 0
    };

    usuarioActual.inversiones.push(inversion);
    usuarioActual.saldoUSDT -= cantidad;

    localStorage.setItem('usuarioMinevertex', JSON.stringify(usuarioActual));
    actualizarInterfaz();
    
    alert('¡Inversión realizada exitosamente!\n\nCantidad: ' + cantidad.toFixed(2) + ' USDT\nGanancia esperada: ' + cantidad.toFixed(2) + ' USDT\nPeríodo: 31 días');
    
    document.getElementById('cantidad-inversion').value = 50;
    cerrarModal('modal-invertir');
}

// COPIAR TEXTO GENÉRICO
function copiarTexto(elementId) {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
        alert('Elemento no encontrado');
        return;
    }

    let texto = '';
    if (elemento.tagName === 'INPUT') {
        texto = elemento.value;
    } else if (elemento.tagName === 'CODE') {
        texto = elemento.textContent;
    } else {
        texto = elemento.textContent;
    }

    navigator.clipboard.writeText(texto).then(() => {
        alert('¡Copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar:', err);
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('¡Copiado al portapapeles!');
    });
}

// NOTIFICACIONES
function mostrarNotificacion(titulo, mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${tipo === 'success' ? '#4caf50' : tipo === 'error' ? '#ff5252' : '#00bcd4'};
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

    notificacion.innerHTML = `
        <strong>${titulo}</strong>
        <p style="margin-top: 5px; font-size: 0.9rem;">${mensaje}</p>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => document.body.removeChild(notificacion), 300);
    }, 3000);
}

// AGREGAR ANIMACIONES
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
