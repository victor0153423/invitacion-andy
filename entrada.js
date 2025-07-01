document.addEventListener('DOMContentLoaded', () => {
  // Animar burbujas pequeñas de fondo
  const bubbleContainer = document.getElementById('bubble-container');

  function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = Math.random() * 25 + 15;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${4 + Math.random() * 3}s`;

    bubble.addEventListener('animationend', () => {
      bubble.remove();
    });

    bubbleContainer.appendChild(bubble);
  }

  // Crear burbujas periódicamente
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createBubble(), i * 300);
  }
  setInterval(() => createBubble(), 1500);

  // Crear música pero no reproducir todavía
  const music = document.createElement('audio');
  music.id = 'bgMusic';
  music.loop = true;
  music.volume = 0.3;
  const source = document.createElement('source');
  source.src = 'assets/Only - Lee Hi (Letra en español).mp3';
  source.type = 'audio/mpeg';
  music.appendChild(source);
  document.body.appendChild(music);

  // Explosión de burbuja grande y reproducción de música
  const bigBubble = document.getElementById('big-bubble');
  bigBubble.addEventListener('click', () => {
    // Reproducir música
    music.play().catch(e => console.warn('No se pudo reproducir la música:', e));

    // Animar explosión
    bigBubble.style.animation = 'explode 0.7s forwards';

    // Esperar animación para redirigir
    setTimeout(() => {
      window.location.href = "entrada.html"; // Cambia por la URL real de tu invitación
    }, 700);
  });
});
