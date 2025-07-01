document.addEventListener('DOMContentLoaded', () => {
    // Generar invitación personalizada
    document.getElementById("generar-invitacion").addEventListener("click", () => {
        const adultos = document.getElementById("adultos").value;
        const ninos = document.getElementById("ninos").value;
        const invitacionId = 'inv-' + Math.random().toString(36).substr(2, 8);
        
        localStorage.setItem(`invitacion_${invitacionId}`, JSON.stringify({
            id: invitacionId,
            adultos: adultos,
            ninos: ninos
        }));
        
        const link = `${window.location.href.split('?')[0]}?inv=${invitacionId}`;
        const linkElement = document.getElementById("link-personalizado");
        linkElement.href = link;
        linkElement.textContent = "Enlace de invitación personalizado";
        document.getElementById("invitacion-link").style.display = 'block';
        
        navigator.clipboard.writeText(link);
        alert("Enlace copiado al portapeles");
    });

    // Cargar datos si hay invitación compartida
    const params = new URLSearchParams(window.location.search);
    if (params.has('inv')) {
        const data = JSON.parse(localStorage.getItem(`invitacion_${params.get('inv')}`));
        if (data) {
            document.getElementById("adultos").value = data.adultos;
            document.getElementById("ninos").value = data.ninos;
            document.getElementById("adultos").disabled = true;
            document.getElementById("ninos").disabled = true;
            document.getElementById("generar-invitacion").style.display = 'none';
        }
    }

    // Contenedor para las burbujas (mejor rendimiento)
    const bubbleContainer = document.createElement('div');
    bubbleContainer.style.position = 'fixed';
    bubbleContainer.style.top = '0';
    bubbleContainer.style.left = '0';
    bubbleContainer.style.width = '100%';
    bubbleContainer.style.height = '100%';
    bubbleContainer.style.pointerEvents = 'none';
    bubbleContainer.style.overflow = 'hidden';
    bubbleContainer.style.zIndex = '0';
    document.body.appendChild(bubbleContainer);

    // Crear burbujas iniciales
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBubble(bubbleContainer), i * 300);
    }

    // Crear burbujas periódicamente
    setInterval(() => createBubble(bubbleContainer), 1500);
});

function createBubble(container) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    
    // Tamaño y posición aleatoria
    const size = Math.random() * 25 + 15;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    
    // Duración de la animación
    const duration = 4 + Math.random() * 3;
    bubble.style.animationDuration = `${duration}s`;
    
    // Cuando termine de subir, explotar
    bubble.addEventListener('animationend', (e) => {
        if (e.animationName === 'rise') {
            bubble.style.animation = 'explode 0.5s forwards';
            setTimeout(() => bubble.remove(), 500);
        } else if (e.animationName === 'explode') {
            bubble.remove();
        }
    });
    
    container.appendChild(bubble);
}