// CARRUSEL DE IMÁGENES
let indiceCarrusel = 0;
let autoCarruselInterval;

function inicializarCarrusel() {
    const carruselNext = document.querySelector('.carrusel-next');
    const carruselPrev = document.querySelector('.carrusel-prev');

    if (carruselNext) carruselNext.addEventListener('click', () => avanzarCarrusel());
    if (carruselPrev) carruselPrev.addEventListener('click', () => retrocederCarrusel());

    iniciarAutoCarrusel();
}

function avanzarCarrusel() {
    const imagenes = document.querySelectorAll('.carrusel img');
    if (imagenes.length === 0) return;

    indiceCarrusel = (indiceCarrusel + 1) % imagenes.length;
    actualizarCarrusel();
    reiniciarAutoCarrusel();
}

function retrocederCarrusel() {
    const imagenes = document.querySelectorAll('.carrusel img');
    if (imagenes.length === 0) return;

    indiceCarrusel = (indiceCarrusel - 1 + imagenes.length) % imagenes.length;
    actualizarCarrusel();
    reiniciarAutoCarrusel();
}

function actualizarCarrusel() {
    const carrusel = document.querySelector('.carrusel');
    if (!carrusel) return;

    const desplazamiento = indiceCarrusel * 100;
    carrusel.style.transform = `translateX(-${desplazamiento}%)`;
}

function iniciarAutoCarrusel() {
    autoCarruselInterval = setInterval(() => {
        avanzarCarrusel();
    }, 4000); // Cambiar imagen cada 4 segundos
}

function reiniciarAutoCarrusel() {
    clearInterval(autoCarruselInterval);
    iniciarAutoCarrusel();
}

// Detener auto carrusel cuando el usuario interactúa
document.addEventListener('mouseover', function(event) {
    if (event.target.closest('.carrusel-container')) {
        clearInterval(autoCarruselInterval);
    }
});

document.addEventListener('mouseout', function(event) {
    if (event.target.closest('.carrusel-container')) {
        iniciarAutoCarrusel();
    }
});
