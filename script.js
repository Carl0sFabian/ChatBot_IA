document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE (Tu código) ---
    const firebaseConfig = {
        apiKey: "AIzaSyBQa0qbVaqTvpFGAJjFj2BTRm1c29z48fw",
        authDomain: "k-i-b-o-24cbe.firebaseapp.com",
        projectId: "k-i-b-o-24cbe",
        storageBucket: "k-i-b-o-24cbe.appspot.com",
        messagingSenderId: "983754137013",
        appId: "1:983754137013:web:31731ce76eb8c036d7cdfc",
        measurementId: "G-0YHHMQ08BF"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();
    // --- AÑADIDO: Servicio de Autenticación de Firebase ---
    const auth = firebase.auth();

    // --- AÑADIDO: Observador del estado de autenticación ---
    // Este bloque se encarga de proteger la página y cargar los datos del usuario.
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // Si hay un usuario con sesión iniciada:
            console.log("Usuario autenticado:", user.uid);

            const userDocRef = db.collection('users').doc(user.uid);
            const userDoc = await userDocRef.get();

            if (userDoc.exists) {
                // Si encontramos sus datos en Firestore, actualizamos la interfaz
                const userData = userDoc.data();
                updateUserProfileUI(userData);
            } else {
                // Si no, usamos la información básica de Auth como respaldo
                console.warn("No se encontró documento en Firestore para el usuario.");
                updateUserProfileUI({
                    name: user.displayName || "Usuario Anónimo",
                    role: 'user',
                    avatarUrl: user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName || 'A'}`
                });
            }

            // Una vez verificado el usuario, se ejecuta todo tu script original
            initializeAppLogic();

        } else {
            // Si no hay usuario, se redirige a la página de login
            console.log("No hay usuario. Redirigiendo a login.html...");
            window.location.replace('login.html');
        }
    });

    /**
     * --- AÑADIDO: Nueva función que actualiza el DOM con los datos del usuario ---
     */
    function updateUserProfileUI(userData) {
        // Actualiza el avatar principal
        const userAvatarElement = document.querySelector('.header .avatar-img');
        if (userAvatarElement) {
            userAvatarElement.src = userData.avatarUrl;
        }

        // Actualiza el nombre de usuario
        const userNameElement = document.querySelector('.header .user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }

        // Actualiza el rol del usuario
        const userRoleElement = document.querySelector('.header .user-role');
        if (userRoleElement) {
            userRoleElement.textContent = userData.role === 'teacher' ? 'Profesor' : 'Estudiante';
        }

        // Actualiza el mensaje de bienvenida
        const welcomeMessageElement = document.querySelector('.welcome-header h2');
        if (welcomeMessageElement) {
            welcomeMessageElement.textContent = `¡Bienvenido de nuevo, ${userData.name.split(' ')[0]}!`;
        }
    }

    /**
     * --- AÑADIDO: Contenedor para todo tu código original ---
     * Esta función envuelve tu script para que solo se ejecute después de iniciar sesión.
     */
    async function initializeAppLogic() {

        // ==========================================================
        // === INICIO DE TU CÓDIGO ORIGINAL (100% INTACTO) ==========
        // ==========================================================

        const navItems = document.querySelectorAll('.nav-card');
        const contentSections = document.querySelectorAll('.content-section');
        const indicator = document.querySelector('.active-indicator');
        const navContainer = document.querySelector('.nav-container');
        const sidebarRight = document.querySelector('.sidebar-right');
        const toggleBtn = document.getElementById('toggle-sidebar-btn');
        const panel = document.querySelector('.panel');
        const chatListContainer = document.querySelector('.chat-list');
        const chatCounter = document.querySelector('.nav-card.chats .nav-card__pill');
        const addChatBtn = document.getElementById('add-chat-btn');
        const chatMessages = document.getElementById("chat-messages");
        const sendBtn = document.getElementById("send-btn");
        const messageInput = document.getElementById("message-input");
        const attachFileBtn = document.getElementById("attach-file-btn");
        const sendAudioBtn = document.getElementById("send-audio-btn");
        const trophyDisplay = document.getElementById("trophy-display");
        const nextGoalCard = document.getElementById("next-goal");
        const modalOverlay = document.getElementById('add-chat-modal-overlay');
        const newChatNameInput = document.getElementById('new-chat-name-input');
        const confirmChatBtn = document.getElementById('confirm-chat-btn');
        const cancelChatBtn = document.getElementById('cancel-chat-btn');
        const nextMissionCardBody = document.getElementById('next-mission-card-body');
        const tipOfTheDayBody = document.getElementById('tip-of-the-day-body');
        const dateTimeCardDate = document.getElementById('datetime-card-date');
        const dateTimeCardTime = document.getElementById('datetime-card-time');

        // --- AÑADIDO: Selector y evento para el botón de cerrar sesión ---
        const logoutBtn = document.querySelector('.nav-container .nav-card:last-child'); // Asumiendo que es el último
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.signOut().catch(error => console.error("Error al cerrar sesión:", error));
            });
        }

        let currentChatId = null;
        let unsubscribeChatHistory = null;
        let unsubscribeMessages = null;

        function renderChatHistory() {
            if (unsubscribeChatHistory) unsubscribeChatHistory();

            unsubscribeChatHistory = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                if (!chatListContainer) return;
                chatListContainer.innerHTML = '';
                const chats = [];

                snapshot.forEach(doc => {
                    chats.push({ id: doc.id, ...doc.data() });
                });

                updateDashboard(chats);
                if (chatCounter) chatCounter.textContent = chats.length;

                chats.forEach(chat => {
                    const chatItem = document.createElement('div');
                    chatItem.className = 'chat-item';
                    chatItem.setAttribute('data-chat-id', chat.id);
                    const avatar = chat.avatar || 'images/Logo.jpeg';

                    chatItem.innerHTML = `
                        <div class="chat-avatar-container"><div class="chat-avatar-bg"></div><img class="chat-avatar" src="${avatar}" alt="Avatar" /><div class="chat-status-green"></div></div>
                        <div class="chat-name">${chat.name}</div>
                        <div class="chat-item__icon green"><i class="fa-solid fa-comment-dots"></i></div>`;
                    chatListContainer.appendChild(chatItem);

                    chatItem.addEventListener('click', () => {
                        if (currentChatId === chat.id) return;
                        currentChatId = chat.id;
                        loadChatMessages(currentChatId);
                        updateTrophyPanel(chat);
                        document.querySelectorAll('.chat-item').forEach(item => item.style.backgroundColor = 'transparent');
                        chatItem.style.backgroundColor = 'rgba(0, 119, 255, 0.2)';
                    });
                });

                if (!currentChatId && chats.length > 0) {
                    document.querySelector('.chat-item')?.click();
                } else if (chats.length === 0) {
                    updateTrophyPanel(null);
                }
            });
        }

        function loadChatMessages(chatId) {
            if (!chatMessages) return;
            if (unsubscribeMessages) unsubscribeMessages();
            chatMessages.innerHTML = 'Cargando mensajes...';

            unsubscribeMessages = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    chatMessages.innerHTML = '';
                    snapshot.forEach(doc => renderMessage({ id: doc.id, ...doc.data() }));
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, error => {
                    console.error("Error al cargar mensajes: ", error);
                    chatMessages.innerHTML = 'Error al cargar los mensajes.';
                });
        }

        async function sendMessage() {
            const texto = messageInput.value.trim();
            if (texto === "" || !currentChatId) return;

            const pictogramas = await buscarPictogramas(texto);
            const messageData = {
                type: 'user',
                text: texto,
                pictogramas,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                contentType: 'text'
            };

            const chatRef = db.collection('chats').doc(currentChatId);

            chatRef.collection('messages').add(messageData)
                .then(() => {
                    messageInput.value = "";
                    return chatRef.update({ userMessageCount: firebase.firestore.FieldValue.increment(1) });
                })
                .then(() => {
                    checkAndUnlockTrophies(currentChatId);
                    simulateBotResponse(texto);
                })
                .catch(error => console.error("Error al enviar mensaje y actualizar contador: ", error));
        }

        function handleFileUpload(file) {
            if (!currentChatId || !file) return;

            const storageRef = storage.ref(`chat_files/${currentChatId}/${Date.now()}_${file.name}`);
            const uploadTask = storageRef.put(file);

            uploadTask.on('state_changed',
                (snapshot) => console.log('Subiendo: ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '%'),
                (error) => console.error("Error al subir archivo: ", error),
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        const messageData = {
                            type: 'user', fileUrl: downloadURL, fileName: file.name,
                            contentType: file.type.startsWith('image/') ? 'image' : 'file',
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        };
                        db.collection('chats').doc(currentChatId).collection('messages').add(messageData)
                            .then(() => db.collection('chats').doc(currentChatId).update({ userMessageCount: firebase.firestore.FieldValue.increment(1) }))
                            .then(() => checkAndUnlockTrophies(currentChatId));
                    });
                }
            );
        }

        function simulateBotResponse(userText) {
            setTimeout(async () => {
                const botResponse = obtenerRespuesta(userText);
                const pictogramas = await buscarPictogramas(botResponse);
                const botMessage = {
                    type: 'bot',
                    text: botResponse,
                    pictogramas,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    contentType: 'text'
                };
                if (currentChatId) {
                    db.collection('chats').doc(currentChatId).collection('messages').add(botMessage);
                }
            }, 1200);
        }

        function renderMessage(msg) {
            if (!chatMessages) return;
            const chatMessageElement = document.createElement("div");
            chatMessageElement.classList.add("chat-bubble", msg.type === 'user' ? "user-message" : "bot-message");

            let contentHTML = '', pictogramasHTML = '';

            if (msg.pictogramas && msg.pictogramas.length > 0) {
                pictogramasHTML = `<div class="pictogram-container">${msg.pictogramas.map(url => `<img src="${url}" class="pictogram-image">`).join('')}</div>`;
            }

            if (msg.contentType === 'image' && msg.fileUrl) {
                contentHTML = `<img src="${msg.fileUrl}" alt="${msg.fileName || 'Imagen'}" class="attached-image">`;
            } else if (msg.contentType === 'file' && msg.fileUrl) {
                contentHTML = `<a href="${msg.fileUrl}" target="_blank" class="file-attachment"><i class="fa-solid fa-file-arrow-down"></i> ${msg.fileName || 'Descargar archivo'}</a>`;
            } else {
                contentHTML = (msg.type === 'user') ? `<p>${msg.text || ''}</p>` : `<p class="bot-text-container"></p>`;
            }

            const messageDate = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date();
            const formattedTime = messageDate.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

            // --- AÑADIDO: Usa el avatar dinámico del usuario que ya cargamos ---
            const userAvatarUrl = document.querySelector('.header .avatar-img').src;
            const userAvatar = `<img src="${userAvatarUrl}" alt="User" class="message-avatar">`;
            const botAvatar = `<img src="images/bot.webp" alt="Bot" class="message-avatar">`;

            const messageContentBubble = `<div class="message-content">${pictogramasHTML}${contentHTML}</div>`;
            const metaHTML = `<div class="message-meta"><span>${formattedTime}</span></div>`;

            chatMessageElement.innerHTML = `${msg.type === 'bot' ? botAvatar : ''}<div class="message-and-meta">${messageContentBubble}${metaHTML}</div>${msg.type === 'user' ? userAvatar : ''}`;
            chatMessages.appendChild(chatMessageElement);

            if (msg.type === 'bot' && msg.text) {
                const textContainer = chatMessageElement.querySelector('.bot-text-container');
                if (textContainer) typewriterEffect(textContainer, msg.text);
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        if (addChatBtn) {
            addChatBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                modalOverlay.classList.remove('hidden');
                newChatNameInput.focus();
            });
        }
        if (cancelChatBtn) {
            cancelChatBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
            });
        }
        if (confirmChatBtn) {
            confirmChatBtn.addEventListener('click', () => {
                const newChatName = newChatNameInput.value.trim();
                if (newChatName) {
                    db.collection('chats').add({
                        name: newChatName,
                        avatar: 'images/Logo.jpeg',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        userMessageCount: 0,
                        unlockedTrophies: []
                    }).then(() => {
                        handleNavClick(document.getElementById('chats-link'));
                        modalOverlay.classList.add('hidden');
                        newChatNameInput.value = '';
                    }).catch(error => console.error("Error al crear nuevo chat: ", error));
                } else {
                    alert("Por favor, ingresa un nombre para el chat.");
                }
            });
        }

        const homeNewChatBtn = document.getElementById('home-new-chat-btn');
        const homeGoToDbBtn = document.getElementById('home-go-to-db-btn');

        if (homeNewChatBtn) {
            homeNewChatBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('hidden');
                newChatNameInput.focus();
            });
        }
        if (homeGoToDbBtn) {
            homeGoToDbBtn.addEventListener('click', () => document.querySelector('.nav-card.base-datos')?.click());
        }

        function updateDashboard(chats) {
            const statsTotalChats = document.getElementById('stats-total-chats');
            const statsUnlockedTrophies = document.getElementById('stats-unlocked-trophies');
            const recentChatsContainer = document.getElementById('recent-chats-container');

            if (!statsTotalChats || !statsUnlockedTrophies || !recentChatsContainer) return;

            let totalTrophies = 0;
            chats.forEach(chat => {
                totalTrophies += (chat.unlockedTrophies || []).length;
            });

            statsTotalChats.textContent = chats.length;
            statsUnlockedTrophies.textContent = totalTrophies;

            recentChatsContainer.innerHTML = '';

            if (chats.length === 0) {
                recentChatsContainer.innerHTML = '<p class="empty-state">Aún no hay chats.</p>';
                return;
            }

            const recentChats = chats.slice(0, 3);

            recentChats.forEach(chat => {
                const chatElement = document.createElement('div');
                chatElement.className = 'recent-chat-item';
                chatElement.innerHTML = `<img src="${chat.avatar || 'images/Logo.jpeg'}" alt="Avatar"><span class="chat-name">${chat.name}</span><span class="go-to-chat">Abrir chat <i class="fa-solid fa-arrow-right"></i></span>`;
                chatElement.addEventListener('click', () => {
                    const chatLinkInSidebar = document.querySelector(`.chat-item[data-chat-id="${chat.id}"]`);
                    if (chatLinkInSidebar) {
                        document.getElementById('chats-link')?.click();
                        setTimeout(() => chatLinkInSidebar.click(), 50);
                    }
                });
                recentChatsContainer.appendChild(chatElement);
            });
        }

        const tips = ["Puedes expandir y contraer el panel lateral haciendo clic en la flecha verde.", "Cada 5 mensajes que envías en un chat, desbloqueas un nuevo logro. ¡Inténtalo!", "La sección 'Base de Datos' muestra una hoja de cálculo de Google en tiempo real.", "K-I-B-O puede buscar pictogramas de ARASAAC para ilustrar tus conversaciones."];

        function displayRandomTip() {
            if (!tipOfTheDayBody) return;
            tipOfTheDayBody.innerHTML = `<p>${tips[Math.floor(Math.random() * tips.length)]}</p>`;
        }

        function updateClock() {
            if (!dateTimeCardDate || !dateTimeCardTime) return;
            const now = new Date();
            dateTimeCardDate.textContent = now.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            dateTimeCardTime.textContent = now.toLocaleTimeString('es-ES');
        }

        const TROPHY_GOALS = {
            5: { id: 't1', emoji: '👍' }, 10: { id: 't2', emoji: '🧠' }, 15: { id: 't3', emoji: '🔍' }, 20: { id: 't4', emoji: '🚀' }, 25: { id: 't5', emoji: '🌟' }, 30: { id: 't6', emoji: '🦾' }, 35: { id: 't7', emoji: '🎓' }, 40: { id: 't8', emoji: '🌈' }, 45: { id: 't9', emoji: '🏆' }
        };

        async function checkAndUnlockTrophies(chatId) {
            const chatRef = db.collection('chats').doc(chatId);
            const doc = await chatRef.get();
            if (!doc.exists) return;

            const chatData = doc.data();
            const currentCount = chatData.userMessageCount || 0;
            const currentTrophies = chatData.unlockedTrophies || [];
            const newTrophiesToUnlock = [];

            Object.keys(TROPHY_GOALS).forEach(countStr => {
                const count = parseInt(countStr);
                const goal = TROPHY_GOALS[count];
                if (currentCount >= count && !currentTrophies.includes(goal.id)) {
                    newTrophiesToUnlock.push(goal.id);
                }
            });

            if (newTrophiesToUnlock.length > 0) {
                await chatRef.update({
                    unlockedTrophies: firebase.firestore.FieldValue.arrayUnion(...newTrophiesToUnlock)
                });
            }
            updateTrophyPanel({
                ...chatData, id: chatId, userMessageCount: currentCount, unlockedTrophies: [...currentTrophies, ...newTrophiesToUnlock]
            });
        }

        function updateTrophyPanel(chat) {
            if (!trophyDisplay) return;

            if (!chat) {
                trophyDisplay.querySelectorAll(".achievement-slot").forEach(slot => {
                    slot.textContent = '❓';
                    slot.classList.remove('unlocked');
                });
                if (nextGoalCard) nextGoalCard.innerHTML = `<h3>¡Selecciona un chat!</h3><p>Elige una conversación para ver tu progreso.</p>`;
                if (nextMissionCardBody) nextMissionCardBody.innerHTML = `<p>Elige una conversación para ver tu próxima misión.</p>`;
                return;
            }

            const messageCount = chat.userMessageCount || 0;
            const unlockedTrophies = chat.unlockedTrophies || [];
            const slots = trophyDisplay.querySelectorAll(".achievement-slot");
            let nextGoalCount = Infinity,
                nextGoalInfo = null;

            Object.keys(TROPHY_GOALS).forEach((count, index) => {
                if (index >= slots.length) return;
                const goal = TROPHY_GOALS[count];
                const slot = slots[index];
                if (unlockedTrophies.includes(goal.id)) {
                    slot.textContent = goal.emoji;
                    slot.classList.add('unlocked');
                } else {
                    slot.textContent = '❓';
                    slot.classList.remove('unlocked');
                }
                if (!unlockedTrophies.includes(goal.id) && parseInt(count) < nextGoalCount) {
                    nextGoalCount = parseInt(count);
                    nextGoalInfo = goal;
                }
            });

            const updateCard = (card, info) => {
                if (!card) return;
                if (info) {
                    const remaining = nextGoalCount - messageCount;
                    card.innerHTML = card === nextGoalCard ? `<h3>¡Siguiente misión!</h3><p>Escribe ${remaining} mensajes más para ganar el trofeo ${info.emoji}</p>` : `<p>Te faltan solo <strong>${remaining} mensajes</strong> para desbloquear tu próximo logro: ${info.emoji}</p>`;
                } else {
                    card.innerHTML = card === nextGoalCard ? `<h3>¡Misión completada!</h3><p>Has desbloqueado todos los logros 🎉</p>` : `<p>¡Buen trabajo! Has completado todas las misiones por ahora 🎉</p>`;
                }
            };
            updateCard(nextGoalCard, nextGoalInfo);
            updateCard(nextMissionCardBody, nextGoalInfo);
        }

        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                panel.classList.toggle('expanded');
                const icon = toggleBtn.querySelector('i');
                icon.className = panel.classList.contains('expanded') ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right';
            });
        }

        const googleSheetIframe = `<iframe src="https://docs.google.com/spreadsheets/d/1orqqq8V-VHYByubTQLfQF3n8qqDNgHqW/edit?usp=sharing&ouid=114527888935603933122&rtpof=true&sd=true" width="100%" height="100%" frameborder="0"></iframe>`;

        function handleNavClick(item) {
            if (!item || item.id === 'logout-btn') return;

            if (!panel.classList.contains('expanded')) {
                panel.classList.add('expanded');
                toggleBtn.querySelector('i').className = 'fa-solid fa-arrow-left';
            }
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            item.classList.add('active-nav');
            indicator.style.top = `${navContainer.offsetTop + item.offsetTop}px`;
            indicator.style.height = `${item.offsetHeight}px`;
            const targetId = item.dataset.target;
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId)?.classList.add('active');
            sidebarRight.style.display = targetId === 'chats' ? 'flex' : 'none';

            if (targetId === 'database') {
                const dbSection = document.getElementById('database');
                if (dbSection && !dbSection.querySelector('iframe')) {
                    dbSection.innerHTML = `${googleSheetIframe}`;
                }
            }
        }
        navItems.forEach(item => item.addEventListener('click', () => handleNavClick(item)));

        const defaultActiveItem = document.querySelector('.nav-card.inicio');
        if (defaultActiveItem) {
            setTimeout(() => {
                indicator.style.transition = 'none';
                handleNavClick(defaultActiveItem);
                setTimeout(() => indicator.style.transition = 'top 0.4s cubic-bezier(0.23, 1, 0.32, 1), height 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 50);
            }, 10);
        }

        let baseDeConocimiento = [];
        async function cargarBaseDeConocimiento() {
            const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnNIzaXTMUII0HlM11Mk-_9R5CpDlPC-c0vTIXKxSd9SoZufFxPuCrAqWXqM1t5Q/pub?output=csv';
            try {
                const response = await fetch(googleSheetURL);
                let csvData = await response.text();
                const filas = csvData.trim().split('\n');
                const cabeceras = filas.shift().split(',').map(h => h.trim().toLowerCase());
                const idxRespuesta = cabeceras.indexOf('respuesta'),
                    idxPregunta = cabeceras.indexOf('pregunta');
                if (idxPregunta === -1 || idxRespuesta === -1) return;
                baseDeConocimiento = filas.map(fila => {
                    const valores = fila.split(',');
                    return {
                        pregunta: valores[idxPregunta] || '',
                        respuesta: valores[idxRespuesta] || ''
                    };
                });
            } catch (error) {
                console.error("Error al cargar la base de conocimiento:", error);
            }
        }

        function obtenerRespuesta(preguntaUsuario) {
            const preguntaNormalizada = preguntaUsuario.trim().toLowerCase().replace(/[.,!?;¿¡'"]/g, '');
            if (preguntaNormalizada === 'hola') return "Hola, soy K-I-B-O, tu asistente. ¿En qué te puedo ayudar?";
            const coincidenciaExacta = baseDeConocimiento.find(item => (item.pregunta || '').trim().toLowerCase().replace(/[.,!?;¿¡'"]/g, '') === preguntaNormalizada);
            return coincidenciaExacta ? coincidenciaExacta.respuesta : "Lo siento, no tengo una respuesta para esa pregunta.";
        }
        async function buscarPictogramas(texto) {
            const palabras = texto.toLowerCase().replace(/[.,!?;¿¡]/g, '').split(' ');
            const pictogramasUnicos = new Map();
            for (const palabra of palabras) {
                if (palabra.length > 2) {
                    try {
                        const response = await fetch(`https://api.arasaac.org/v1/pictograms/es/search/${palabra}`);
                        if (response.ok) {
                            const resultados = await response.json();
                            if (resultados.length > 0 && !pictogramasUnicos.has(resultados[0]._id)) {
                                pictogramasUnicos.set(resultados[0]._id, `https://api.arasaac.org/v1/pictograms/${resultados[0]._id}`);
                            }
                        }
                    } catch (error) {
                        console.error("Error buscando pictograma:", error);
                    }
                }
            }
            return Array.from(pictogramasUnicos.values());
        }

        function typewriterEffect(element, text, speed = 40) {
            let i = 0;
            element.innerHTML = '';
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i++);
                    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    clearInterval(intervalId);
                }
            }, speed);
        }
        async function handleAudioRecording() {
            alert('Funcionalidad de grabación de audio aún no implementada.');
        }

        if (sendBtn) sendBtn.addEventListener("click", sendMessage);
        if (messageInput) messageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        if (attachFileBtn) attachFileBtn.addEventListener("click", () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.onchange = () => {
                if (fileInput.files[0]) handleFileUpload(fileInput.files[0]);
            };
            fileInput.click();
        });
        if (sendAudioBtn) sendAudioBtn.addEventListener("click", handleAudioRecording);

        await cargarBaseDeConocimiento();
        displayRandomTip();
        updateClock();
        setInterval(updateClock, 1000);
        renderChatHistory();

    } 
});