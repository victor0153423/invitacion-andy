document.addEventListener('DOMContentLoaded', () => {
    // ========== MÚSICA DE FONDO AUTOMÁTICA ==========
    const music = document.createElement('audio');
    music.id = 'bgMusic';
    music.loop = true;
    music.hidden = true;
    music.volume = 0.3; // Volumen al 30%
    
    const source = document.createElement('source');
    source.src = 'assets/Only - Lee Hi (Letra en español).mp3';
    source.type = 'audio/mpeg';
    music.appendChild(source);
    document.body.appendChild(music);
    
    // Función para iniciar música
    function startMusic() {
        const promise = music.play();
        if (promise !== undefined) {
            promise.catch(error => {
                console.log('Autoplay prevenido:', error);
                // Activar con el primer click si falla el autoplay
                document.addEventListener('click', () => {
                    music.play();
                }, { once: true });
            });
        }
    }
    
    // Intentar reproducir al cargar
    startMusic();
    
    // ========== GENERADOR DE INVITACIONES ==========
    document.getElementById("generar-invitacion").addEventListener("click", () => {
        const adultos = document.getElementById("adultos").value || 0;
        const ninos = document.getElementById("ninos").value || 0;
        
        if (adultos == 0 && ninos == 0) {
            alert("Por favor, ingresa al menos un pase (adulto o niño)");
            return;
        }
        
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
        
        navigator.clipboard.writeText(link).then(() => {
            alert("Enlace copiado al portapeles");
        }).catch(err => {
            console.error("Error al copiar: ", err);
        });
    });

    // ========== CARGAR INVITACIÓN EXISTENTE ==========
    const params = new URLSearchParams(window.location.search);
    if (params.has('inv')) {
        const data = JSON.parse(localStorage.getItem(`invitacion_${params.get('inv')}`));
        if (data) {
            document.getElementById("adultos").value = data.adultos || '';
            document.getElementById("ninos").value = data.ninos || '';
            document.getElementById("adultos").disabled = true;
            document.getElementById("ninos").disabled = true;
            document.getElementById("generar-invitacion").style.display = 'none';
        }
    }

    // ========== ANIMACIÓN DE BURBUJAS ==========
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
    
    const size = Math.random() * 25 + 15;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    
    const duration = 4 + Math.random() * 3;
    bubble.style.animationDuration = `${duration}s`;
    
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