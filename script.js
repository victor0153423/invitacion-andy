document.addEventListener('DOMContentLoaded', () => {
    // Crear burbujas iniciales
    createBubbles(15);
    
    // Crear burbujas adicionales periódicamente
    setInterval(() => createBubbles(2), 1200);
    
    function createBubbles(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                // Tamaño aleatorio entre 15px y 40px
                const size = Math.random() * 25 + 15;
                
                // Posición inicial aleatoria
                const posX = Math.random() * 100;
                
                // Duración de la animación entre 4 y 6 segundos
                const duration = 4 + Math.random() * 2;
                
                // Establecer propiedades de la burbuja
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                bubble.style.left = `${posX}%`;
                bubble.style.animationDuration = `${duration}s`;
                
                // Cuando termine de subir, explotar
                bubble.addEventListener('animationend', (e) => {
                    if (e.animationName === 'rise') {
                        bubble.style.animation = 'explode 0.6s ease-out forwards';
                        setTimeout(() => bubble.remove(), 600);
                    }
                });
                
                document.body.appendChild(bubble);
            }, i * 300);
        }
    }
});