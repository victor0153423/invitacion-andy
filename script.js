document.addEventListener('DOMContentLoaded', async () => {
    // Configuración de Firebase (sin cambios)
    const firebaseConfig = {
        apiKey: "AIzaSyDFGa_lj-LenFD15NqveRhm2_1UWKKQvYA",
        authDomain: "invitacionandy.firebaseapp.com",
        projectId: "invitacionandy",
        storageBucket: "invitacionandy.firebasestorage.app",
        messagingSenderId: "197075938093",
        appId: "1:197075938093:web:6a7f99baaf1cd34bca41a4"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // ======= Música de fondo automática =======
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

    // Función para mostrar botón si no se puede reproducir música automáticamente
    function showPlayButton() {
        if (document.getElementById('btn-play-music')) return;
        const btn = document.createElement('button');
        btn.id = 'btn-play-music';
        btn.textContent = 'Toca para activar música';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.padding = '10px 20px';
        btn.style.fontSize = '18px';
        btn.style.zIndex = '9999';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            music.play();
            btn.remove();
        });
    }

    // Intentar iniciar música automáticamente
    function startMusic() {
        const promise = music.play();
        if (promise !== undefined) {
            promise.catch(error => {
                console.log('Autoplay prevenido:', error);
                showPlayButton();
            });
        }
    }

    startMusic();

    // ======= Control del reproductor con íconos SVG (play/pausa) =======
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
        const iconPlay = playBtn.querySelector('.icon-play');
        const iconPause = playBtn.querySelector('.icon-pause');

        playBtn.addEventListener('click', () => {
            if (music.paused) {
                music.play().then(() => {
                    iconPlay.style.display = 'none';
                    iconPause.style.display = 'block';
                }).catch(err => {
                    console.log('No se pudo iniciar la música:', err);
                });
            } else {
                music.pause();
                iconPlay.style.display = 'block';
                iconPause.style.display = 'none';
            }
        });

        music.addEventListener('play', () => {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        });

        music.addEventListener('pause', () => {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        });
    }

    // ======= Generador de invitaciones =======
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

            const baseUrl = window.location.origin + '/index.html';
            const link = `${baseUrl}?inv=${invitacionId}`;

            const linkElement = document.getElementById("link-personalizado");
            linkElement.href = link;
            linkElement.textContent = "Enlace de invitación personalizado";
            document.getElementById("invitacion-link").style.display = 'block';

            // Crear o actualizar botón copiar
            let btnCopiar = document.getElementById('btn-copiar-link');
            if (!btnCopiar) {
                btnCopiar = document.createElement('button');
                btnCopiar.id = 'btn-copiar-link';
                btnCopiar.textContent = 'Copiar';
                btnCopiar.style.marginLeft = '10px';
                btnCopiar.style.padding = '5px 10px';
                btnCopiar.style.cursor = 'pointer';

                linkElement.parentNode.appendChild(btnCopiar);

                btnCopiar.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(link);
                        alert('Link copiado al portapapeles');
                    } catch {
                        alert('Error al copiar el link');
                    }
                });
            }

            // Copiar automáticamente al generar
            await navigator.clipboard.writeText(link);
            alert("Enlace copiado al portapapeles");

        } catch (error) {
            console.error("Error al guardar invitación:", error);
        }
    });

    // ======= Cargar invitación existente =======
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

    // ======= Botón "No sé cómo llegar" =======
    const btnLlegar = document.getElementById('btn-llegar');
    if (btnLlegar) {
        btnLlegar.addEventListener('click', () => {
            const mapsUrl = 'https://www.google.com/maps?q=Recepciones+Elegance,+Carril+de+la+Rosa+5011,+Diez+de+Mayo';
            window.open(mapsUrl, '_blank');
        });
    }

    // ======= Animación de burbujas =======
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
