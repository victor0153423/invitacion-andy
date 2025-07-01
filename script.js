document.addEventListener('DOMContentLoaded', async () => {
  // ====== Configuración Firebase desde variables de entorno ======
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ========== MÚSICA DE FONDO AUTOMÁTICA ==========
  const music = document.createElement('audio');
  music.id = 'bgMusic';
  music.loop = true;
  music.hidden = true;
  music.volume = 0.3;

  const source = document.createElement('source');
  source.src = 'assets/Only - Lee Hi (Letra en español).mp3';
  source.type = 'audio/mpeg';
  music.appendChild(source);
  document.body.appendChild(music);

  function startMusic() {
    const promise = music.play();
    if (promise !== undefined) {
      promise.catch(error => {
        console.log('Autoplay prevenido:', error);
        document.addEventListener('click', () => {
          music.play();
        }, { once: true });
      });
    }
  }
  startMusic();

  // ========== GENERADOR DE INVITACIONES ==========
  document.getElementById("generar-invitacion").addEventListener("click", async () => {
    const adultos = parseInt(document.getElementById("adultos").value) || 0;
    const ninos = parseInt(document.getElementById("ninos").value) || 0;

    if (adultos === 0 && ninos === 0) {
      alert("Por favor, ingresa al menos un pase (adulto o niño)");
      return;
    }

    try {
      const docRef = await db.collection('invitaciones').add({
        adultos,
        ninos,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      const invitacionId = docRef.id;

      const link = `${window.location.href.split('?')[0]}?inv=${invitacionId}`;
      const linkElement = document.getElementById("link-personalizado");
      linkElement.href = link;
      linkElement.textContent = "Enlace de invitación personalizado";
      document.getElementById("invitacion-link").style.display = 'block';

      await navigator.clipboard.writeText(link);
      alert("Enlace copiado al portapeles");
    } catch (error) {
      console.error("Error al guardar invitación:", error);
      alert("Ocurrió un error al generar la invitación.");
    }
  });

  // ========== CARGAR INVITACIÓN EXISTENTE ==========
  const params = new URLSearchParams(window.location.search);
  if (params.has('inv')) {
    const invitacionId = params.get('inv');
    try {
      const doc = await db.collection('invitaciones').doc(invitacionId).get();
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("adultos").value = data.adultos || '';
        document.getElementById("ninos").value = data.ninos || '';

        document.getElementById("adultos").readOnly = true;
        document.getElementById("ninos").readOnly = true;
        document.getElementById("generar-invitacion").style.display = 'none';
      } else {
        console.log("No existe invitación con ese ID");
      }
    } catch (error) {
      console.error("Error al cargar invitación:", error);
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

  for (let i = 0; i < 15; i++) {
    setTimeout(() => createBubble(bubbleContainer), i * 300);
  }

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
