document.addEventListener('DOMContentLoaded', async () => {
    // --- INICIO CÓDIGO MENÚS DESPLEGABLES ---
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const profileToggleBtn = document.querySelector('.profile-toggle-btn');
    const sidebarLeft = document.querySelector('.sidebar-left');
    const sidebarRight = document.querySelector('.sidebar-right');
    const menuOverlay = document.querySelector('.menu-overlay');
    const closeMenuBtns = document.querySelectorAll('.close-menu-btn');

    const closeAllMenus = () => {
        sidebarLeft.classList.remove('open');
        sidebarRight.classList.remove('open');
        menuOverlay.classList.remove('active');
    };

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => {
            if (sidebarRight.classList.contains('open')) {
                closeAllMenus();
            }
            sidebarLeft.classList.add('open');
            menuOverlay.classList.add('active');
        });
    }

    if (profileToggleBtn) {
        profileToggleBtn.addEventListener('click', () => {
            if (sidebarLeft.classList.contains('open')) {
                closeAllMenus();
            }
            sidebarRight.classList.add('open');
            menuOverlay.classList.add('active');
        });
    }

    closeMenuBtns.forEach(btn => {
        btn.addEventListener('click', closeAllMenus);
    });

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeAllMenus);
    }
    // --- FIN CÓDIGO MENÚS DESPLEGABLES ---

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

    const googleSheetIframe = `<iframe src="https://docs.google.com/spreadsheets/d/1orqqq8V-VHYByubTQLfQF3n8qqDNgHqW/edit?usp=sharing&ouid=114527888935603933122&rtpof=true&sd=true" width="100%" height="100%" frameborder="0"></iframe>`;
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnNIzaXTMUII0HlM11Mk-_9R5CpDlPC-c0vTIXKxSd9SoZufFxPuCrAqWXqM1t5Q/pub?output=csv';
    let baseDeConocimiento = [];

    async function cargarBaseDeConocimiento() {
        if (!googleSheetURL.startsWith('https')) {
            console.error("URL del Google Sheet no es válida.");
            return;
        }
        function parseCSVRow(row) {
            const result = [];
            let currentField = '';
            let inQuotedField = false;
            for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"' && (i === 0 || row[i - 1] !== '\\')) {
                    inQuotedField = !inQuotedField;
                } else if (char === ',' && !inQuotedField) {
                    result.push(currentField.trim().replace(/^"|"$/g, ''));
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            result.push(currentField.trim().replace(/^"|"$/g, ''));
            return result;
        }

        try {
            const response = await fetch(googleSheetURL);
            let csvData = await response.text();
            if (csvData.charCodeAt(0) === 0xFEFF) csvData = csvData.substring(1);

            const filas = csvData.trim().split('\n');
            const cabeceras = filas.shift().split(',').map(h => h.trim().toLowerCase());
            const idxRespuesta = cabeceras.indexOf('respuesta');
            const idxPregunta = cabeceras.indexOf('pregunta');

            if (idxPregunta === -1 || idxRespuesta === -1) {
                console.error("El CSV debe tener las columnas 'pregunta' y 'respuesta'.");
                return;
            }

            baseDeConocimiento = filas.map(fila => {
                const valores = parseCSVRow(fila);
                return {
                    pregunta: valores[idxPregunta] || '',
                    respuesta: valores[idxRespuesta] || ''
                };
            });
            console.log("Base de conocimiento cargada exitosamente.");
        } catch (error) {
            console.error("Error al cargar la base de conocimiento:", error);
        }
    }

    function obtenerRespuesta(preguntaUsuario) {
        if (baseDeConocimiento.length === 0) {
            return "Mi base de conocimiento aún no está lista. Inténtalo de nuevo en un momento.";
        }

        const normalizarTexto = (texto) => texto.trim().toLowerCase().replace(/[.,!?;¿¡'"]/g, '');
        const preguntaNormalizada = normalizarTexto(preguntaUsuario);

        if (preguntaNormalizada === 'hola') {
            return "Hola, soy K-I-B-O, tu asistente. ¿En qué te puedo ayudar?";
        }

        const coincidenciaExacta = baseDeConocimiento.find(item => normalizarTexto(item.pregunta) === preguntaNormalizada);

        if (coincidenciaExacta) {
            return coincidenciaExacta.respuesta;
        } else {
            return "Lo siento, no tengo una respuesta para esa pregunta.";
        }
    }

    function updateTrophyPanel() {
        if (!trophyDisplay) return;
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
        if (nextGoalCard) {
            if (nextGoalInfo) {
                const remaining = nextGoalCount - messageCount;
                nextGoalCard.innerHTML = `<h5>¡Siguiente misión!</h5><p>Escribe ${remaining} mensajes más para ganar el trofeo ${nextGoalInfo.emoji}</p>`;
            } else {
                nextGoalCard.innerHTML = `<h5>¡Misión completada!</h5><p>Has desbloqueado todos los logros 🎉</p>`;
            }
        }
    }

    async function buscarPictogramas(texto) {
        const palabras = texto.toLowerCase().replace(/[.,!?;¿¡]/g, '').split(' ');
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

    function typewriterEffect(element, text, speed = 40) {
        let i = 0;
        element.innerHTML = '';
        element.classList.remove('typing-done');

        const intervalId = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                clearInterval(intervalId);
                element.classList.add('typing-done');
            }
        }, speed);
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
            contentHTML = `<div class="audio-bubble"><i class="fas fa-play play-button"></i><div class="audio-wave"></div></div>`;
        } else {
            contentHTML = msg.type === 'user' ? msg.text : '<span class="bot-text-container"></span>';
        }

        if (msg.type === 'user') {
            message.innerHTML = `<div class="message-content"><div class="message-bubble">${pictogramasHTML}${contentHTML}</div><div class="message-meta"><span>${new Date().toLocaleDateString("es-ES")}</span></div></div><img src="images/Logo.jpeg" alt="User" class="avatar">`;
        } else {
            message.innerHTML = `<img src="images/bot.webp" alt="Bot" class="avatar"><div class="message-content"><div class="message-bubble">${contentHTML}</div><div class="message-meta"><span>${new Date().toLocaleDateString("es-ES")}</span><a href="#">Copy</a><a href="#">Regenerate</a><div class="reactions"><i class="fa-regular fa-thumbs-up"></i><i class="fa-regular fa-thumbs-down"></i></div></div></div>`;
        }

        chatMessages.appendChild(message);

        if (msg.type === 'bot' && !msg.contentType) {
            const textContainer = message.querySelector('.bot-text-container');
            if (textContainer) {
                typewriterEffect(textContainer, msg.text);
            }
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

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'bot-message', 'typing');
        typingIndicator.innerHTML = `<img src="images/bot.webp" alt="Bot" class="avatar"><div class="message-content"><div class="message-bubble"><span>.</span><span>.</span><span>.</span></div></div>`;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            if (typingIndicator.parentNode === chatMessages) {
                chatMessages.removeChild(typingIndicator);
            }
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
            sharedPhotosContainer.textContent = `Imagenes Compartidas (${sharedPhotos.length})`;
        }
        if (photoGrid) {
            photoGrid.innerHTML = '';
            sharedPhotos.slice(-4).reverse().forEach((photo) => {
                const img = document.createElement('img');
                img.src = photo.text;
                img.alt = `Foto compartida`;
                photoGrid.appendChild(img);
            });
        }
    };

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
            if (sidebarRight) sidebarRight.style.display = 'none';
            dbContainer.style.display = 'block';
            dbContainer.innerHTML = googleSheetIframe;
            document.querySelectorAll('.main-nav li').forEach(li => li.classList.remove('active'));
            dbLink.parentElement.classList.add('active');
        });
    }

    if (chatsLink) {
        chatsLink.addEventListener('click', (e) => {
            e.preventDefault();
            dbContainer.style.display = 'none';
            dbContainer.innerHTML = '';
            chatArea.style.display = 'flex';
            if (sidebarRight) sidebarRight.style.display = 'flex';
            document.querySelectorAll('.main-nav li').forEach(li => li.classList.remove('active'));
            chatsLink.parentElement.classList.add('active');
        });
    }

    await cargarBaseDeConocimiento();
    updateTrophyPanel();
    renderSharedPhotos(currentChatId);
});