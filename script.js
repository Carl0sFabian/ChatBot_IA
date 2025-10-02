document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");
    const chatMessages = document.getElementById("chat-messages");
    const trophyDisplay = document.getElementById("trophy-display");
    const nextGoalCard = document.getElementById("next-goal");
    const attachFileBtn = document.getElementById("attach-file-btn");
    const sendAudioBtn = document.getElementById("send-audio-btn");
    const sharedPhotosContainer = document.querySelector('.shared-photos h5');
    const photoGrid = document.querySelector('.photo-grid');

    const chatsLink = document.getElementById('chats-link');
    const dbLink = document.getElementById('db-link');
    const chatArea = document.querySelector('.chat-area');
    const sidebarRight = document.querySelector('.sidebar-right');
    const dbContainer = document.getElementById('db-container');

    const currentChatId = 'default_chat';
    let chatHistory = { [currentChatId]: [] };
    let messageCount = 0;
    let unlockedTrophies = new Set();
    const TROPHY_GOALS = {
        5: { id: 't1', emoji: '👍' }, 10: { id: 't2', emoji: '🧠' }, 15: { id: 't3', emoji: '🔍' },
        20: { id: 't4', emoji: '🚀' }, 25: { id: 't5', emoji: '🌟' }, 30: { id: 't6', emoji: '🦾' },
        35: { id: 't7', emoji: '🎓' }, 40: { id: 't8', emoji: '🌈' }, 45: { id: 't9', emoji: '🏆' }
    };

    const googleSheetIframe = `<iframe src="https://docs.google.com/spreadsheets/d/1Ygd_7Cy9WAsjeCa_j3FZpgBlSgCy56WB/edit?usp=sharing&ouid=114527888935603933122&rtpof=true&sd=true" width="100%" height="100%" frameborder="0"></iframe>`;


    function obtenerRespuesta(preguntaUsuario) {
        const preguntaLimpia = preguntaUsuario.toLowerCase().trim();
        let mejorRespuesta = "Lo siento, no entiendo esa pregunta. ¿Puedes intentar reformularla?";

        const itemEncontrado = baseDeConocimiento.find(item => {
            return item.pregunta && preguntaLimpia.includes(item.pregunta.toLowerCase());
        });

        if (itemEncontrado) {
            mejorRespuesta = itemEncontrado.respuesta;
        }
        return mejorRespuesta;
    }

    function updateTrophyPanel() {
        const slots = trophyDisplay.querySelectorAll(".achievement-slot");
        let nextGoalCount = Infinity;
        let nextGoalInfo = null;
        Object.keys(TROPHY_GOALS).forEach((count, index) => {
            if (index >= slots.length) return;
            const goal = TROPHY_GOALS[count];
            const slot = slots[index];
            if (messageCount >= parseInt(count) && !unlockedTrophies.has(goal.id)) {
                unlockedTrophies.add(goal.id);
            }
            if (unlockedTrophies.has(goal.id)) {
                slot.textContent = goal.emoji;
                slot.classList.add('unlocked');
            }
            if (!unlockedTrophies.has(goal.id) && parseInt(count) < nextGoalCount) {
                nextGoalCount = parseInt(count);
                nextGoalInfo = goal;
            }
        });
        if (nextGoalInfo) {
            const remaining = nextGoalCount - messageCount;
            nextGoalCard.innerHTML = `<h5>¡Siguiente misión!</h5><p>Escribe ${remaining} mensajes más para ganar el trofeo ${nextGoalInfo.emoji}</p>`;
        } else {
            nextGoalCard.innerHTML = `<h5>¡Misión completada!</h5><p>Has desbloqueado todos los logros 🎉</p>`;
        }
    }

    async function buscarPictogramas(texto) {
        const palabras = texto.toLowerCase().replace(/[.,!?;]/g, '').split(' ');
        const pictogramasUnicos = new Map();
        const promesas = palabras.map(async (palabra) => {
            if (palabra.length > 2) {
                try {
                    const response = await fetch(`https://api.arasaac.org/v1/pictograms/es/search/${palabra}`);
                    if (!response.ok) return;
                    const resultados = await response.json();
                    if (resultados.length > 0) {
                        const pictogramaId = resultados[0]._id;
                        if (!pictogramasUnicos.has(pictogramaId)) {
                            pictogramasUnicos.set(pictogramaId, `https://api.arasaac.org/v1/pictograms/${pictogramaId}`);
                        }
                    }
                } catch (error) {
                    console.error("Error buscando pictograma:", error);
                }
            }
        });
        await Promise.all(promesas);
        return Array.from(pictogramasUnicos.values());
    }

    function renderMessage(msg) {
        const message = document.createElement("div");
        message.classList.add("chat-message", msg.type === 'user' ? "user-message" : "bot-message");
        if (chatHistory[currentChatId]) {
            chatHistory[currentChatId].push({ type: msg.type, text: msg.text, contentType: msg.contentType, pictogramas: msg.pictogramas || [] });
        }
        let pictogramasHTML = '';
        if (msg.pictogramas && msg.pictogramas.length > 0) {
            pictogramasHTML = `<div class="pictogram-container">${msg.pictogramas.map(url => `<img src="${url}" class="pictogram-image">`).join('')}</div>`;
        }
        let contentHTML = '';
        if (msg.contentType === 'image') {
            contentHTML = `<img src="${msg.text}" alt="Imagen adjunta" style="max-width: 200px; border-radius: 12px;">`;
        } else if (msg.contentType === 'audio') {
            contentHTML = `<div class="audio-bubble"><i class="fas fa-play play-button"></i><div class="audio-wave"><span style="height: 5px;"></span> <span style="height: 15px;"></span> <span style="height: 10px;"></span><span style="height: 20px;"></span> <span style="height: 5px;"></span> <span style="height: 18px;"></span></div></div>`;
        } else {
            contentHTML = msg.text;
        }
        if (msg.type === 'user') {
            message.innerHTML = `<div class="message-content"><div class="message-bubble">${pictogramasHTML}${contentHTML}</div><div class="message-meta"><span>${new Date().toLocaleDateString("es-ES")}</span></div></div><img src="images/Logo.jpeg" alt="User" class="avatar">`;
        } else {
            message.innerHTML = `<img src="images/bot.webp" alt="Bot" class="avatar"><div class="message-content"><div class="message-bubble">${contentHTML}<div class="flame-icon"></div></div><div class="message-meta"><span>${new Date().toLocaleDateString("es-ES")}</span><a href="#">Copy</a><a href="#">Regenerate</a><div class="reactions"><i class="fa-regular fa-thumbs-up"></i><i class="fa-regular fa-thumbs-down"></i></div></div></div>`;
        }
        if (msg.contentType === 'audio') {
            const playBtn = message.querySelector('.play-button');
            const audio = new Audio(msg.text);
            playBtn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play();
                    playBtn.classList.replace('fa-play', 'fa-pause');
                } else {
                    audio.pause();
                    playBtn.classList.replace('fa-pause', 'fa-play');
                }
            });
            audio.onended = () => { playBtn.classList.replace('fa-pause', 'fa-play'); };
        }
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const texto = messageInput.value.trim();
        if (texto === "") return;
        const pictogramas = await buscarPictogramas(texto);
        renderMessage({ type: 'user', text: texto, pictogramas: pictogramas });
        messageInput.value = "";
        messageCount++;
        updateTrophyPanel();
        renderSharedPhotos(currentChatId);
        setTimeout(() => {
            const respuestaBot = obtenerRespuesta(texto);
            renderMessage({ type: 'bot', text: respuestaBot });
        }, 800);
    }

    let mediaRecorder, audioChunks = [], isRecording = false, stream;
    async function handleAudioRecording() {
        if (!isRecording) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                isRecording = true;
                sendAudioBtn.classList.add("recording");
                audioChunks = [];
                mediaRecorder.ondataavailable = event => { audioChunks.push(event.data); };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    renderMessage({ type: 'user', text: audioUrl, contentType: 'audio' });
                    messageCount++;
                    updateTrophyPanel();
                    renderSharedPhotos(currentChatId);
                    stream.getTracks().forEach(track => track.stop());
                };
            } catch (err) {
                alert("Error al acceder al micrófono 🎤: " + err.message);
                isRecording = false;
                sendAudioBtn.classList.remove("recording");
            }
        } else {
            mediaRecorder.stop();
            isRecording = false;
            sendAudioBtn.classList.remove("recording");
        }
    }

    const renderSharedPhotos = (chatId) => {
        const messages = chatHistory[chatId] || [];
        const sharedPhotos = messages.filter(msg => msg.contentType === 'image');
        if (sharedPhotosContainer) {
            sharedPhotosContainer.textContent = `Shared Photos (${sharedPhotos.length})`;
        }
        photoGrid.innerHTML = '';
        sharedPhotos.reverse().slice(0, 4).forEach((photo, index) => {
            const img = document.createElement('img');
            img.src = photo.text;
            img.alt = photo.fileName || `Foto compartida ${index + 1}`;
            photoGrid.appendChild(img);
        });
    };

    // ===============================================
    // ========= EVENT LISTENERS =====================
    // ===============================================

    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } });
    attachFileBtn.addEventListener("click", () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = "image/*";
        fileInput.onchange = () => {
            const file = fileInput.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                renderMessage({ type: 'user', text: e.target.result, contentType: 'image', pictogramas: [] });
                messageCount++;
                updateTrophyPanel();
                renderSharedPhotos(currentChatId);
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    });
    sendAudioBtn.addEventListener("click", handleAudioRecording);


    if (dbLink) {
        dbLink.addEventListener('click', (e) => {
            e.preventDefault(); 

            chatArea.style.display = 'none';
            sidebarRight.style.display = 'none';

            dbContainer.style.display = 'block';
            dbContainer.innerHTML = googleSheetIframe;

            chatsLink.parentElement.classList.remove('active');
            dbLink.parentElement.classList.add('active');
        });
    }

    if (chatsLink) {
        chatsLink.addEventListener('click', (e) => {
            e.preventDefault();

            dbContainer.style.display = 'none';
            dbContainer.innerHTML = ''; 

            chatArea.style.display = 'flex'; 
            sidebarRight.style.display = 'block';

            dbLink.parentElement.classList.remove('active');
            chatsLink.parentElement.classList.add('active');
        });
    }


    // --- Inicialización al cargar la página ---
    updateTrophyPanel();
    renderSharedPhotos(currentChatId);
});