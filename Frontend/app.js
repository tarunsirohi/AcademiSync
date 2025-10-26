document.addEventListener('DOMContentLoaded', function() {
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const searchChatBtn = document.getElementById('search-chat-btn');
    const chatSearchInput = document.getElementById('chat-search-input');
    const chatsList = document.getElementById('chats-list');
    const noChatsMessage = document.getElementById('no-chats');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatArea = document.getElementById('chat-area');
    const welcomeMessage = document.getElementById('welcome-message');
    const roleSelectBtn = document.getElementById('role-select-btn');
    const roleDialog = document.getElementById('role-dialog');
    const selectRoleConfirm = document.getElementById('select-role-confirm');
    const attachFileBtn = document.getElementById('attach-file-btn');
    const fileInput = document.getElementById('file-input');
    const voiceRecordBtn = document.getElementById('voice-record-btn');

    // Sidebar Toggle
    toggleSidebarButton.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    });
    
    // Chat Search
    function updateNoChatsVisibility() {
        const chatItems = Array.from(chatsList.getElementsByClassName('chat-list-item'));
        let hasVisibleItems = false;
        chatItems.forEach(item => {
            if (item.style.display !== 'none') {
                hasVisibleItems = true;
            }
        });

        if (chatsList.children.length === 0 || !hasVisibleItems) {
            noChatsMessage.style.display = 'flex';
            chatsList.style.display = 'none';
        } else {
            noChatsMessage.style.display = 'none';
            chatsList.style.display = 'flex';
        }
    }


    searchChatBtn.addEventListener('click', function() {
        chatSearchInput.classList.toggle('visible');
        if (chatSearchInput.classList.contains('visible')) {
            chatSearchInput.focus();
        }
    });

    chatSearchInput.addEventListener('keyup', function() {
        const searchTerm = chatSearchInput.value.toLowerCase();
        const chatItems = Array.from(chatsList.getElementsByClassName('chat-list-item'));
        
        chatItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        updateNoChatsVisibility();
    });

    // Role Selection Dialog
    roleSelectBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        roleDialog.classList.toggle('visible');
    });

    selectRoleConfirm.addEventListener('click', function() {
        roleDialog.classList.remove('visible');
    });

    document.addEventListener('click', function(event) {
        if (!roleDialog.contains(event.target) && !roleSelectBtn.contains(event.target)) {
            roleDialog.classList.remove('visible');
        }
    });

    // File Attachment
    attachFileBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            console.log('File selected:', fileInput.files[0].name);
        }
    });

    // Voice Recording
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        voiceRecordBtn.addEventListener('click', () => {
            if (voiceRecordBtn.classList.contains('recording')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = () => {
            voiceRecordBtn.classList.add('recording');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
        
        recognition.onend = () => {
            voiceRecordBtn.classList.remove('recording');
        };

    } else {
        voiceRecordBtn.disabled = true;
        console.log('Speech recognition not supported in this browser.');
    }

    // Chat Functionality
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.textContent = messageText;
        chatArea.appendChild(userMessage);

        chatInput.value = '';
        chatArea.scrollTop = chatArea.scrollHeight;

        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot-message';
            botMessage.textContent = 'This is a dummy reply.';
            chatArea.appendChild(botMessage);
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 1000);
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Responsive Handling
    function handleResize() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    }

    updateNoChatsVisibility();
    window.addEventListener('resize', handleResize);
    handleResize();
});