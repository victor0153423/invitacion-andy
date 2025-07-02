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

            await navigator.clipboard.writeText(link);
            alert("Enlace copiado al portapeles");
        } catch (error) {
            console.error("Error al guardar invitación:", error);
            alert("Ocurrió un error al generar la invitación.");
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