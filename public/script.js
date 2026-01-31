// 전역 변수
let currentUser = null;
let messages = [];
let photos = [];
let events = [];
let gameRooms = [];
let currentRoom = null;

// 부루마블 게임 데이터
const monopolyProperties = [
    { name: '시작', type: 'corner', position: { bottom: 0, right: 0 } },
    { name: '동대문구', type: 'property', color: '#8B4513', price: 60, position: { bottom: 0, right: 80 } },
    { name: '공동기금', type: 'chest', position: { bottom: 0, right: 140 } },
    { name: '중랑구', type: 'property', color: '#8B4513', price: 60, position: { bottom: 0, right: 200 } },
    { name: '소득세', type: 'tax', position: { bottom: 0, right: 260 } },
    { name: '경춘선', type: 'railroad', price: 200, position: { bottom: 0, right: 320 } },
    { name: '성북구', type: 'property', color: '#87CEEB', price: 100, position: { bottom: 0, right: 380 } },
    { name: '기회', type: 'chance', position: { bottom: 0, right: 440 } },
    { name: '강북구', type: 'property', color: '#87CEEB', price: 100, position: { bottom: 0, right: 500 } },
    { name: '도봉구', type: 'property', color: '#87CEEB', price: 120, position: { bottom: 0, right: 560 } },
    
    { name: '감옥', type: 'corner', position: { bottom: 0, left: 0 } },
    { name: '노원구', type: 'property', color: '#FF1493', price: 140, position: { left: 0, bottom: 80 } },
    { name: '전력회사', type: 'utility', price: 150, position: { left: 0, bottom: 140 } },
    { name: '은평구', type: 'property', color: '#FF1493', price: 140, position: { left: 0, bottom: 200 } },
    { name: '서대문구', type: 'property', color: '#FF1493', price: 160, position: { left: 0, bottom: 260 } },
    { name: '경의선', type: 'railroad', price: 200, position: { left: 0, bottom: 320 } },
    { name: '마포구', type: 'property', color: '#FFA500', price: 180, position: { left: 0, bottom: 380 } },
    { name: '공동기금', type: 'chest', position: { left: 0, bottom: 440 } },
    { name: '양천구', type: 'property', color: '#FFA500', price: 180, position: { left: 0, bottom: 500 } },
    { name: '강서구', type: 'property', color: '#FFA500', price: 200, position: { left: 0, bottom: 560 } },
    
    { name: '무료주차', type: 'corner', position: { top: 0, left: 0 } },
    { name: '구로구', type: 'property', color: '#FF0000', price: 220, position: { top: 0, left: 80 } },
    { name: '기회', type: 'chance', position: { top: 0, left: 140 } },
    { name: '금천구', type: 'property', color: '#FF0000', price: 220, position: { top: 0, left: 200 } },
    { name: '영등포구', type: 'property', color: '#FF0000', price: 240, position: { top: 0, left: 260 } },
    { name: '경부선', type: 'railroad', price: 200, position: { top: 0, left: 320 } },
    { name: '동작구', type: 'property', color: '#FFFF00', price: 260, position: { top: 0, left: 380 } },
    { name: '관악구', type: 'property', color: '#FFFF00', price: 260, position: { top: 0, left: 440 } },
    { name: '수도회사', type: 'utility', price: 150, position: { top: 0, left: 500 } },
    { name: '서초구', type: 'property', color: '#FFFF00', price: 280, position: { top: 0, left: 560 } },
    
    { name: '감옥행', type: 'corner', position: { top: 0, right: 0 } },
    { name: '강남구', type: 'property', color: '#00FF00', price: 300, position: { top: 0, right: 80 } },
    { name: '송파구', type: 'property', color: '#00FF00', price: 300, position: { top: 0, right: 140 } },
    { name: '공동기금', type: 'chest', position: { top: 0, right: 200 } },
    { name: '강동구', type: 'property', color: '#00FF00', price: 320, position: { top: 0, right: 260 } },
    { name: '분당선', type: 'railroad', price: 200, position: { top: 0, right: 320 } },
    { name: '기회', type: 'chance', position: { top: 0, right: 380 } },
    { name: '중구', type: 'property', color: '#0000FF', price: 350, position: { top: 0, right: 440 } },
    { name: '특별세', type: 'tax', position: { top: 0, right: 500 } },
    { name: '종로구', type: 'property', color: '#0000FF', price: 400, position: { top: 0, right: 560 } }
];

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeSections();
    checkAutoLogin();
    loadGameRooms();
    startNotificationCheck();
});

function initializeSections() {
    const mainContainer = document.getElementById('main-container');
    
    // 게임 섹션 추가
    const gamesSection = document.createElement('div');
    gamesSection.id = 'games-section';
    gamesSection.className = 'section';
    gamesSection.innerHTML = `
        <h2>🎮 가족 게임</h2>
        <div class="games-grid">
            <div class="game-card">
                <div class="icon">🧠</div>
                <h3>가족 퀴즈</h3>
                <p>가족에 대한 재미있는 퀴즈를 풀어보세요!</p>
                <button class="play-btn" onclick="startQuiz()">게임 시작</button>
            </div>
            <div class="game-card">
                <div class="icon">🎲</div>
                <h3>숫자 맞추기</h3>
                <p>1-100 사이의 숫자를 맞춰보세요!</p>
                <button class="play-btn" onclick="startNumberGame()">게임 시작</button>
            </div>
            <div class="game-card">
                <div class="icon">🃏</div>
                <h3>기억력 게임</h3>
                <p>카드를 뒤집어서 같은 그림을 찾아보세요!</p>
                <button class="play-btn" onclick="startMemoryGame()">게임 시작</button>
            </div>
            <div class="game-card">
                <div class="icon">🎯</div>
                <h3>빙고 게임</h3>
                <p>가족과 함께 빙고를 완성해보세요!</p>
                <button class="play-btn" onclick="startBingoGame()">게임 시작</button>
            </div>
        </div>
    `;
    
    // 사진 섹션 추가
    const photosSection = document.createElement('div');
    photosSection.id = 'photos-section';
    photosSection.className = 'section';
    photosSection.innerHTML = `
        <h2>📷 가족 사진</h2>
        <div style="text-align: center; margin-bottom: 20px;">
            <input type="file" id="photoUpload" accept="image/*" multiple style="display: none;" onchange="handlePhotoUpload(event)">
            <button class="play-btn" onclick="document.getElementById('photoUpload').click()">📷 사진 업로드</button>
        </div>
        <div id="photoGallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;"></div>
    `;
    
    // 보드게임 섹션 추가
    const boardSection = document.createElement('div');
    boardSection.id = 'board-section';
    boardSection.className = 'section';
    boardSection.innerHTML = `
        <h2>🎲 가족 부루마블</h2>
        <div class="board-game">
            <div class="game-rooms">
                <h3>게임방 목록</h3>
                <div class="room-list" id="roomList"></div>
                <div class="create-room-form">
                    <h4>새 게임방 만들기</h4>
                    <input type="text" id="roomName" placeholder="방 이름 입력">
                    <input type="number" id="maxPlayers" placeholder="최대 인원 (2-4명)" min="2" max="4" value="4">
                    <button class="play-btn" onclick="createGameRoom()">방 만들기</button>
                </div>
            </div>
            <div id="gameArea" style="display: none;">
                <div class="game-controls">
                    <button class="play-btn" onclick="rollDice()" id="rollBtn">주사위 굴리기</button>
                    <div class="dice" id="dice1">1</div>
                    <div class="dice" id="dice2">1</div>
                    <button class="play-btn" onclick="leaveRoom()">방 나가기</button>
                </div>
                <div class="monopoly-board" id="monopolyBoard"></div>
                <div class="game-info" id="gameInfo"></div>
            </div>
        </div>
    `;
    
    // 일정 섹션 추가
    const calendarSection = document.createElement('div');
    calendarSection.id = 'calendar-section';
    calendarSection.className = 'section';
    calendarSection.innerHTML = `
        <h2>📅 가족 일정</h2>
        <div class="calendar-container">
            <div class="calendar-header">
                <button class="play-btn" onclick="changeMonth(-1)">&lt;</button>
                <h3 id="currentMonth"></h3>
                <button class="play-btn" onclick="changeMonth(1)">&gt;</button>
            </div>
            <div class="calendar-grid" id="calendar"></div>
        </div>
        <div class="event-form">
            <h3>새 일정 추가</h3>
            <input type="text" id="eventTitle" placeholder="일정 제목">
            <input type="date" id="eventDate">
            <input type="time" id="eventTime">
            <textarea id="eventDescription" placeholder="일정 설명" rows="3"></textarea>
            <label>
                <input type="checkbox" id="eventNotification"> 알림 받기
            </label>
            <button class="play-btn" onclick="addEvent()">일정 추가</button>
        </div>
    `;
    
    // 섹션들을 메인 컨테이너에 추가
    mainContainer.appendChild(gamesSection);
    mainContainer.appendChild(photosSection);
    mainContainer.appendChild(boardSection);
    mainContainer.appendChild(calendarSection);
    
    // 초기 메시지 추가
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message">
            <span class="username">🤖 시스템:</span>
            <span>가족 채팅방에 오신 것을 환영합니다! 🎉</span>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
}
// 로그인 관련 함수들
function login() {
    const username = document.getElementById('username').value.trim();
    const familyCode = document.getElementById('familyCode').value.trim();
    
    if (!username || !familyCode) {
        showNotification('사용자명과 가족 코드를 입력해주세요!', 'error');
        return;
    }
    
    currentUser = { 
        username, 
        familyCode, 
        joinTime: new Date(),
        id: Date.now() + Math.random()
    };
    
    localStorage.setItem('familySiteUser', JSON.stringify(currentUser));
    
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    document.getElementById('welcomeMessage').textContent = `안녕하세요, ${username}님!`;
    
    loadMessages();
    loadPhotos();
    loadEvents();
    initializeCalendar();
    
    addSystemMessage(`${username}님이 입장하셨습니다! 👋`);
    showNotification(`${username}님, 환영합니다! 🎉`, 'success');
}

function logout() {
    if (currentUser) {
        addSystemMessage(`${currentUser.username}님이 퇴장하셨습니다! 👋`);
        if (currentRoom) {
            leaveRoom();
        }
    }
    
    currentUser = null;
    localStorage.removeItem('familySiteUser');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('familyCode').value = '';
}

function checkAutoLogin() {
    const savedUser = localStorage.getItem('familySiteUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');
        document.getElementById('welcomeMessage').textContent = `안녕하세요, ${currentUser.username}님!`;
        
        loadMessages();
        loadPhotos();
        loadEvents();
        initializeCalendar();
    }
}

// 섹션 전환
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${sectionName}-section`).classList.add('active');
    event.target.classList.add('active');
    
    if (sectionName === 'board') {
        loadGameRooms();
    }
}

// 채팅 기능
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentUser) return;
    
    const newMessage = {
        username: currentUser.username,
        message: message,
        timestamp: new Date(),
        familyCode: currentUser.familyCode,
        type: 'text',
        id: Date.now() + Math.random()
    };
    
    messages.push(newMessage);
    localStorage.setItem('familySiteMessages', JSON.stringify(messages));
    
    displayMessage(newMessage);
    messageInput.value = '';
}

function displayMessage(messageData) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    if (messageData.username === currentUser?.username) {
        messageDiv.classList.add('own');
    }
    
    const timestamp = new Date(messageData.timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let content = '';
    if (messageData.type === 'image') {
        content = `<img src="${messageData.message}" alt="업로드된 이미지" onclick="openImageModal('${messageData.message}')">`;
    } else {
        content = messageData.message;
    }
    
    messageDiv.innerHTML = `
        <span class="username">${messageData.username}:</span>
        <div>${content}</div>
        <span class="timestamp">${timestamp}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageDiv.classList.add('bounce');
}

function addSystemMessage(message) {
    const systemMessage = {
        username: '🤖 시스템',
        message: message,
        timestamp: new Date(),
        familyCode: currentUser?.familyCode || 'system',
        type: 'system',
        id: Date.now() + Math.random()
    };
    
    messages.push(systemMessage);
    localStorage.setItem('familySiteMessages', JSON.stringify(messages));
    displayMessage(systemMessage);
}

function loadMessages() {
    const savedMessages = localStorage.getItem('familySiteMessages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        const familyMessages = messages.filter(m => m.familyCode === currentUser.familyCode);
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        familyMessages.slice(-50).forEach(displayMessage);
    }
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 이미지 업로드
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        const newMessage = {
            username: currentUser.username,
            message: imageData,
            timestamp: new Date(),
            familyCode: currentUser.familyCode,
            type: 'image',
            id: Date.now() + Math.random()
        };
        
        messages.push(newMessage);
        localStorage.setItem('familySiteMessages', JSON.stringify(messages));
        displayMessage(newMessage);
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 사진 갤러리
function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoData = {
                src: e.target.result,
                name: file.name,
                uploadTime: new Date(),
                uploader: currentUser.username,
                familyCode: currentUser.familyCode,
                id: Date.now() + Math.random()
            };
            
            photos.push(photoData);
            localStorage.setItem('familySitePhotos', JSON.stringify(photos));
            displayPhoto(photoData);
            
            addSystemMessage(`${currentUser.username}님이 사진을 업로드했습니다! 📷`);
        };
        reader.readAsDataURL(file);
    });
    
    event.target.value = '';
}

function displayPhoto(photoData) {
    const gallery = document.getElementById('photoGallery');
    const photoDiv = document.createElement('div');
    photoDiv.style.cssText = `
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    `;
    
    photoDiv.innerHTML = `
        <img src="${photoData.src}" alt="${photoData.name}" 
             style="width: 100%; height: 150px; object-fit: cover; cursor: pointer;"
             onclick="openImageModal('${photoData.src}')">
        <div style="padding: 10px;">
            <div style="font-size: 12px; color: #666;">${photoData.uploader}</div>
            <div style="font-size: 10px; color: #999;">${new Date(photoData.uploadTime).toLocaleDateString()}</div>
        </div>
    `;
    
    photoDiv.addEventListener('mouseenter', () => {
        photoDiv.style.transform = 'translateY(-5px)';
    });
    
    photoDiv.addEventListener('mouseleave', () => {
        photoDiv.style.transform = 'translateY(0)';
    });
    
    gallery.appendChild(photoDiv);
}

function loadPhotos() {
    const savedPhotos = localStorage.getItem('familySitePhotos');
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
        const familyPhotos = photos.filter(p => p.familyCode === currentUser.familyCode);
        
        const gallery = document.getElementById('photoGallery');
        gallery.innerHTML = '';
        
        familyPhotos.forEach(displayPhoto);
    }
}

// 게임방 관리
function createGameRoom() {
    const roomName = document.getElementById('roomName').value.trim();
    const maxPlayers = parseInt(document.getElementById('maxPlayers').value);
    
    if (!roomName) {
        showNotification('방 이름을 입력해주세요!', 'error');
        return;
    }
    
    if (maxPlayers < 2 || maxPlayers > 4) {
        showNotification('최대 인원은 2-4명이어야 합니다!', 'error');
        return;
    }
    
    const newRoom = {
        id: Date.now() + Math.random(),
        name: roomName,
        host: currentUser.username,
        players: [currentUser],
        maxPlayers: maxPlayers,
        status: 'waiting',
        familyCode: currentUser.familyCode,
        createdAt: new Date(),
        gameState: initializeGameState()
    };
    
    gameRooms.push(newRoom);
    localStorage.setItem('gameRooms', JSON.stringify(gameRooms));
    
    joinGameRoom(newRoom.id);
    showNotification(`게임방 "${roomName}"이 생성되었습니다!`, 'success');
    
    document.getElementById('roomName').value = '';
    document.getElementById('maxPlayers').value = '4';
}

function joinGameRoom(roomId) {
    const room = gameRooms.find(r => r.id === roomId);
    if (!room) return;
    
    if (room.players.length >= room.maxPlayers) {
        showNotification('방이 가득 찼습니다!', 'error');
        return;
    }
    
    if (room.players.find(p => p.username === currentUser.username)) {
        showNotification('이미 참가한 방입니다!', 'error');
        return;
    }
    
    room.players.push(currentUser);
    currentRoom = room;
    
    localStorage.setItem('gameRooms', JSON.stringify(gameRooms));
    
    document.querySelector('.game-rooms').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    
    initializeMonopolyBoard();
    updateGameInfo();
    
    addSystemMessage(`${currentUser.username}님이 "${room.name}" 게임방에 입장했습니다!`);
    showNotification(`"${room.name}" 방에 입장했습니다!`, 'success');
}

function leaveRoom() {
    if (!currentRoom) return;
    
    currentRoom.players = currentRoom.players.filter(p => p.username !== currentUser.username);
    
    if (currentRoom.players.length === 0) {
        gameRooms = gameRooms.filter(r => r.id !== currentRoom.id);
    }
    
    localStorage.setItem('gameRooms', JSON.stringify(gameRooms));
    
    addSystemMessage(`${currentUser.username}님이 "${currentRoom.name}" 게임방에서 나갔습니다!`);
    
    currentRoom = null;
    document.querySelector('.game-rooms').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
    
    loadGameRooms();
}

function loadGameRooms() {
    const savedRooms = localStorage.getItem('gameRooms');
    if (savedRooms) {
        gameRooms = JSON.parse(savedRooms);
    }
    
    const roomList = document.getElementById('roomList');
    if (!roomList) return;
    
    const familyRooms = gameRooms.filter(r => r.familyCode === currentUser?.familyCode);
    
    roomList.innerHTML = '';
    
    if (familyRooms.length === 0) {
        roomList.innerHTML = '<p style="text-align: center; color: #666;">아직 게임방이 없습니다. 새로운 방을 만들어보세요!</p>';
        return;
    }
    
    familyRooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <div class="room-header">
                <h4>${room.name}</h4>
                <span class="room-status">${room.status === 'waiting' ? '대기중' : '게임중'}</span>
            </div>
            <div class="room-players">
                👥 ${room.players.length}/${room.maxPlayers}명
                <br>
                방장: ${room.host}
            </div>
            <div class="room-players">
                참가자: ${room.players.map(p => p.username).join(', ')}
            </div>
            <button class="play-btn" onclick="joinGameRoom(${room.id})" 
                    ${room.players.length >= room.maxPlayers ? 'disabled' : ''}>
                ${room.players.length >= room.maxPlayers ? '방 가득참' : '입장하기'}
            </button>
        `;
        roomList.appendChild(roomCard);
    });
}

function initializeGameState() {
    return {
        players: [],
        currentPlayer: 0,
        diceRolled: false,
        properties: {},
        turn: 1
    };
}
// 부루마블 게임 로직
function initializeMonopolyBoard() {
    const board = document.getElementById('monopolyBoard');
    board.innerHTML = '';
    
    monopolyProperties.forEach((property, index) => {
        const propertyDiv = document.createElement('div');
        
        if (property.type === 'corner') {
            propertyDiv.className = 'board-corner';
            propertyDiv.style.cssText = `
                position: absolute;
                ${property.position.top !== undefined ? `top: ${property.position.top}px;` : ''}
                ${property.position.bottom !== undefined ? `bottom: ${property.position.bottom}px;` : ''}
                ${property.position.left !== undefined ? `left: ${property.position.left}px;` : ''}
                ${property.position.right !== undefined ? `right: ${property.position.right}px;` : ''}
            `;
        } else {
            propertyDiv.className = 'board-property';
            propertyDiv.style.cssText = `
                position: absolute;
                ${property.position.top !== undefined ? `top: ${property.position.top}px;` : ''}
                ${property.position.bottom !== undefined ? `bottom: ${property.position.bottom}px;` : ''}
                ${property.position.left !== undefined ? `left: ${property.position.left}px;` : ''}
                ${property.position.right !== undefined ? `right: ${property.position.right}px;` : ''}
            `;
            
            if (property.color) {
                const colorBar = document.createElement('div');
                colorBar.className = 'property-color';
                colorBar.style.backgroundColor = property.color;
                propertyDiv.appendChild(colorBar);
            }
        }
        
        const nameDiv = document.createElement('div');
        nameDiv.textContent = property.name;
        nameDiv.style.fontSize = property.type === 'corner' ? '10px' : '8px';
        propertyDiv.appendChild(nameDiv);
        
        if (property.price) {
            const priceDiv = document.createElement('div');
            priceDiv.textContent = `$${property.price}`;
            priceDiv.style.fontSize = '7px';
            priceDiv.style.color = '#666';
            propertyDiv.appendChild(priceDiv);
        }
        
        propertyDiv.id = `property-${index}`;
        board.appendChild(propertyDiv);
    });
    
    // 플레이어 초기화
    if (currentRoom) {
        currentRoom.gameState.players = currentRoom.players.map((player, index) => ({
            ...player,
            position: 0,
            money: 1500,
            properties: [],
            color: `player${index + 1}`
        }));
        
        updatePlayerPositions();
        updateGameInfo();
    }
}

function rollDice() {
    if (!currentRoom || !currentRoom.gameState.players.length) return;
    
    const currentPlayerIndex = currentRoom.gameState.currentPlayer;
    const currentPlayer = currentRoom.gameState.players[currentPlayerIndex];
    
    if (currentPlayer.username !== currentUser.username) {
        showNotification('당신의 차례가 아닙니다!', 'error');
        return;
    }
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    document.getElementById('dice1').textContent = dice1;
    document.getElementById('dice2').textContent = dice2;
    
    // 주사위 애니메이션
    document.getElementById('dice1').classList.add('bounce');
    document.getElementById('dice2').classList.add('bounce');
    
    setTimeout(() => {
        document.getElementById('dice1').classList.remove('bounce');
        document.getElementById('dice2').classList.remove('bounce');
    }, 1000);
    
    // 플레이어 이동
    const oldPosition = currentPlayer.position;
    currentPlayer.position = (currentPlayer.position + total) % monopolyProperties.length;
    
    // 시작점 통과 보너스
    if (currentPlayer.position < oldPosition) {
        currentPlayer.money += 200;
        addSystemMessage(`💰 ${currentPlayer.username}님이 시작점을 통과하여 $200을 받았습니다!`);
    }
    
    updatePlayerPositions();
    
    // 칸 효과 처리
    const currentProperty = monopolyProperties[currentPlayer.position];
    handlePropertyEffect(currentPlayer, currentProperty);
    
    // 다음 플레이어로 턴 변경
    currentRoom.gameState.currentPlayer = (currentRoom.gameState.currentPlayer + 1) % currentRoom.gameState.players.length;
    
    // 게임 상태 저장
    localStorage.setItem('gameRooms', JSON.stringify(gameRooms));
    
    updateGameInfo();
    
    addSystemMessage(`🎲 ${currentPlayer.username}님이 ${dice1}, ${dice2} (총 ${total})을 굴려서 ${currentProperty.name}에 도착했습니다!`);
}

function updatePlayerPositions() {
    // 기존 플레이어 제거
    document.querySelectorAll('.player-piece').forEach(p => p.remove());
    
    if (!currentRoom || !currentRoom.gameState.players) return;
    
    // 플레이어 다시 배치
    currentRoom.gameState.players.forEach((player, playerIndex) => {
        const property = document.getElementById(`property-${player.position}`);
        if (property) {
            const playerPiece = document.createElement('div');
            playerPiece.className = `player-piece ${player.color}`;
            playerPiece.textContent = playerIndex + 1;
            
            // 여러 플레이어가 같은 칸에 있을 때 위치 조정
            const existingPieces = property.querySelectorAll('.player-piece').length;
            playerPiece.style.left = `${5 + (existingPieces % 2) * 25}px`;
            playerPiece.style.top = `${5 + Math.floor(existingPieces / 2) * 25}px`;
            
            property.appendChild(playerPiece);
        }
    });
}

function updateGameInfo() {
    const gameInfo = document.getElementById('gameInfo');
    if (!gameInfo || !currentRoom) return;
    
    const currentPlayerIndex = currentRoom.gameState.currentPlayer;
    const currentPlayerName = currentRoom.gameState.players[currentPlayerIndex]?.username || '없음';
    
    gameInfo.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>현재 차례: ${currentPlayerName}</strong>
        </div>
        <div id="playersInfo">
            ${currentRoom.gameState.players.map((player, index) => `
                <div class="player-info ${index === currentPlayerIndex ? 'current-player' : ''}">
                    <span>${player.username}</span>
                    <span>$${player.money}</span>
                    <span>부동산 ${player.properties.length}개</span>
                </div>
            `).join('')}
        </div>
    `;
}

function handlePropertyEffect(player, property) {
    switch (property.type) {
        case 'property':
            if (property.price && !player.properties.includes(property.name)) {
                if (player.money >= property.price) {
                    const buy = confirm(`${property.name}을(를) $${property.price}에 구매하시겠습니까?`);
                    if (buy) {
                        player.money -= property.price;
                        player.properties.push(property.name);
                        addSystemMessage(`🏠 ${player.username}님이 ${property.name}을(를) 구매했습니다! (-$${property.price})`);
                    }
                }
            }
            break;
        case 'tax':
            const tax = property.name === '소득세' ? 200 : 100;
            player.money -= tax;
            addSystemMessage(`💸 ${player.username}님이 ${property.name}으로 $${tax}을 지불했습니다!`);
            break;
        case 'chance':
        case 'chest':
            const effects = [
                { message: '은행 오류로 $200을 받습니다!', money: 200 },
                { message: '과속 벌금 $150을 지불합니다!', money: -150 },
                { message: '생일 축하금 $100을 받습니다!', money: 100 },
                { message: '병원비 $100을 지불합니다!', money: -100 },
                { message: '복권 당첨! $300을 받습니다!', money: 300 }
            ];
            const effect = effects[Math.floor(Math.random() * effects.length)];
            player.money += effect.money;
            addSystemMessage(`🎲 ${player.username}님: ${effect.message}`);
            break;
    }
    
    // 돈이 음수가 되지 않도록
    player.money = Math.max(0, player.money);
}

// 간단한 게임들
function startQuiz() {
    const questions = [
        { q: "우리 가족의 가장 좋아하는 음식은?", a: ["피자", "치킨", "한식", "중식"] },
        { q: "가족 여행으로 가고 싶은 곳은?", a: ["바다", "산", "도시", "해외"] },
        { q: "우리 가족의 특별한 날은?", a: ["생일", "기념일", "명절", "휴일"] },
        { q: "가족이 함께 보고 싶은 영화 장르는?", a: ["코미디", "액션", "로맨스", "애니메이션"] }
    ];
    
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    const answer = prompt(`${randomQ.q}\n\n선택지: ${randomQ.a.join(', ')}`);
    
    if (answer) {
        addSystemMessage(`🧠 ${currentUser.username}님의 퀴즈 답변: "${answer}" - 좋은 답변이네요! 🎉`);
    }
}

function startNumberGame() {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    let guess;
    
    addSystemMessage(`🎲 ${currentUser.username}님이 숫자 맞추기 게임을 시작했습니다! (1-100)`);
    
    do {
        guess = parseInt(prompt(`1-100 사이의 숫자를 맞춰보세요! (시도: ${attempts + 1})`));
        attempts++;
        
        if (guess < targetNumber) {
            alert("더 큰 숫자입니다!");
        } else if (guess > targetNumber) {
            alert("더 작은 숫자입니다!");
        } else {
            addSystemMessage(`🎉 ${currentUser.username}님이 ${targetNumber}을(를) ${attempts}번 만에 맞췄습니다!`);
            break;
        }
    } while (attempts < 10 && guess !== targetNumber);
    
    if (guess !== targetNumber) {
        addSystemMessage(`😅 ${currentUser.username}님, 아쉽네요! 정답은 ${targetNumber}이었습니다.`);
    }
}

function startMemoryGame() {
    showGameModal(`
        <h3>🃏 기억력 게임</h3>
        <p>같은 이모지를 찾아보세요!</p>
        <div id="memoryBoard" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 400px; margin: 20px auto;"></div>
        <div id="memoryScore">점수: 0</div>
    `);
    
    const emojis = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];
    const gameEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    
    const board = document.getElementById('memoryBoard');
    gameEmojis.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.style.cssText = `
            width: 80px; height: 80px; background: #667eea; color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; border-radius: 8px; cursor: pointer;
            transition: all 0.3s;
        `;
        card.textContent = '?';
        card.onclick = () => flipCard(card, emoji, index);
        board.appendChild(card);
    });
    
    function flipCard(card, emoji, index) {
        if (card.classList.contains('flipped') || flippedCards.length === 2) return;
        
        card.classList.add('flipped');
        card.textContent = emoji;
        card.style.background = 'white';
        card.style.color = '#333';
        flippedCards.push({ card, emoji, index });
        
        if (flippedCards.length === 2) {
            setTimeout(() => {
                if (flippedCards[0].emoji === flippedCards[1].emoji) {
                    matchedPairs++;
                    score += 10;
                    if (matchedPairs === emojis.length) {
                        addSystemMessage(`🎉 ${currentUser.username}님이 기억력 게임을 완료했습니다! 점수: ${score}`);
                    }
                } else {
                    flippedCards.forEach(item => {
                        item.card.classList.remove('flipped');
                        item.card.textContent = '?';
                        item.card.style.background = '#667eea';
                        item.card.style.color = 'white';
                    });
                }
                flippedCards = [];
                document.getElementById('memoryScore').textContent = `점수: ${score}`;
            }, 1000);
        }
    }
}

function startBingoGame() {
    showGameModal(`
        <h3>🎯 빙고 게임</h3>
        <div id="bingoBoard" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; max-width: 300px; margin: 20px auto;"></div>
        <div id="bingoInfo">빙고 줄 수: 0</div>
        <button class="play-btn" onclick="resetBingo()">새 게임</button>
    `);
    
    createBingoBoard();
}

function createBingoBoard() {
    const board = document.getElementById('bingoBoard');
    board.innerHTML = '';
    
    const numbers = Array.from({length: 25}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    
    numbers.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.style.cssText = `
            width: 50px; height: 50px; background: #f8f9fa; border: 2px solid #667eea;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold; cursor: pointer; transition: all 0.3s;
        `;
        cell.textContent = num;
        cell.onclick = () => toggleBingoCell(cell);
        board.appendChild(cell);
    });
}

function toggleBingoCell(cell) {
    if (cell.style.background === 'rgb(102, 126, 234)') {
        cell.style.background = '#f8f9fa';
        cell.style.color = '#333';
    } else {
        cell.style.background = '#667eea';
        cell.style.color = 'white';
    }
    checkBingo();
}

function checkBingo() {
    const cells = document.querySelectorAll('#bingoBoard > div');
    const board = Array.from(cells).map(cell => cell.style.background === 'rgb(102, 126, 234)');
    let bingoCount = 0;
    
    // 가로, 세로, 대각선 체크
    for (let i = 0; i < 5; i++) {
        if (board.slice(i * 5, i * 5 + 5).every(cell => cell)) bingoCount++;
        if ([0, 1, 2, 3, 4].every(j => board[i + j * 5])) bingoCount++;
    }
    
    if ([0, 6, 12, 18, 24].every(i => board[i])) bingoCount++;
    if ([4, 8, 12, 16, 20].every(i => board[i])) bingoCount++;
    
    document.getElementById('bingoInfo').textContent = `빙고 줄 수: ${bingoCount}`;
    
    if (bingoCount >= 5) {
        addSystemMessage(`🎯 ${currentUser.username}님이 빙고를 완성했습니다! (${bingoCount}줄)`);
    }
}

function resetBingo() {
    createBingoBoard();
    document.getElementById('bingoInfo').textContent = '빙고 줄 수: 0';
}
// 일정 관리
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    
    document.getElementById('currentMonth').textContent = 
        `${currentYear}년 ${monthNames[currentMonth]}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // 요일 헤더
    const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.cssText = `
            font-weight: bold; text-align: center; padding: 10px;
            background: #667eea; color: white;
        `;
        calendar.appendChild(dayHeader);
    });
    
    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.textContent = day;
        dayNumber.style.fontWeight = 'bold';
        dayElement.appendChild(dayNumber);
        
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // 해당 날짜의 이벤트 표시
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === currentYear &&
                   eventDate.getMonth() === currentMonth &&
                   eventDate.getDate() === day &&
                   event.familyCode === currentUser?.familyCode;
        });
        
        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.textContent = event.title;
            eventDiv.onclick = () => showEventDetails(event);
            dayElement.appendChild(eventDiv);
        });
        
        calendar.appendChild(dayElement);
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function addEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value.trim();
    const notification = document.getElementById('eventNotification').checked;
    
    if (!title || !date) {
        showNotification('제목과 날짜를 입력해주세요!', 'error');
        return;
    }
    
    const newEvent = {
        id: Date.now() + Math.random(),
        title,
        date,
        time,
        description,
        notification,
        familyCode: currentUser.familyCode,
        creator: currentUser.username,
        createdAt: new Date()
    };
    
    events.push(newEvent);
    localStorage.setItem('familyEvents', JSON.stringify(events));
    
    renderCalendar();
    
    // 폼 초기화
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventDescription').value = '';
    document.getElementById('eventNotification').checked = false;
    
    addSystemMessage(`📅 ${currentUser.username}님이 새 일정을 추가했습니다: ${title}`);
    showNotification('일정이 추가되었습니다!', 'success');
    
    // 알림 설정
    if (notification) {
        scheduleNotification(newEvent);
    }
}

function loadEvents() {
    const savedEvents = localStorage.getItem('familyEvents');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }
}

function showEventDetails(event) {
    showGameModal(`
        <h3>📅 일정 상세</h3>
        <div style="text-align: left;">
            <p><strong>제목:</strong> ${event.title}</p>
            <p><strong>날짜:</strong> ${new Date(event.date).toLocaleDateString('ko-KR')}</p>
            ${event.time ? `<p><strong>시간:</strong> ${event.time}</p>` : ''}
            ${event.description ? `<p><strong>설명:</strong> ${event.description}</p>` : ''}
            <p><strong>작성자:</strong> ${event.creator}</p>
            <p><strong>알림:</strong> ${event.notification ? '설정됨' : '설정 안됨'}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <button class="play-btn" onclick="deleteEvent('${event.id}')">삭제</button>
            <button class="play-btn" onclick="closeModal()">닫기</button>
        </div>
    `);
}

function deleteEvent(eventId) {
    events = events.filter(e => e.id !== eventId);
    localStorage.setItem('familyEvents', JSON.stringify(events));
    renderCalendar();
    closeModal();
    showNotification('일정이 삭제되었습니다!', 'success');
}

// 알림 시스템
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notification.className = `notification ${type}`;
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

function closeNotification() {
    document.getElementById('notification').classList.add('hidden');
}

function scheduleNotification(event) {
    const eventDate = new Date(`${event.date}T${event.time || '09:00'}`);
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    
    // 1시간 전 알림
    const oneHourBefore = timeDiff - (60 * 60 * 1000);
    if (oneHourBefore > 0) {
        setTimeout(() => {
            showNotification(`⏰ "${event.title}" 일정이 1시간 후에 있습니다!`, 'warning');
            addSystemMessage(`⏰ 알림: "${event.title}" 일정이 1시간 후에 있습니다!`);
        }, oneHourBefore);
    }
    
    // 정시 알림
    if (timeDiff > 0) {
        setTimeout(() => {
            showNotification(`🔔 "${event.title}" 일정 시간입니다!`, 'success');
            addSystemMessage(`🔔 알림: "${event.title}" 일정 시간입니다!`);
        }, timeDiff);
    }
}

function startNotificationCheck() {
    // 5분마다 알림 체크
    setInterval(() => {
        const now = new Date();
        const familyEvents = events.filter(e => e.familyCode === currentUser?.familyCode && e.notification);
        
        familyEvents.forEach(event => {
            const eventDate = new Date(`${event.date}T${event.time || '09:00'}`);
            const timeDiff = eventDate.getTime() - now.getTime();
            
            // 10분 전 알림
            if (timeDiff > 0 && timeDiff <= 10 * 60 * 1000) {
                showNotification(`⏰ "${event.title}" 일정이 곧 시작됩니다!`, 'warning');
            }
        });
    }, 5 * 60 * 1000); // 5분마다
}

// 모달 관련
function showGameModal(content) {
    const modal = document.getElementById('gameModal');
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = content;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('show');
}

function openImageModal(imageSrc) {
    showGameModal(`
        <h3>이미지 보기</h3>
        <img src="${imageSrc}" style="max-width: 100%; max-height: 70vh; border-radius: 8px;">
        <div style="text-align: center; margin-top: 20px;">
            <button class="play-btn" onclick="closeModal()">닫기</button>
        </div>
    `);
}

// 페이지 종료 시 정리
window.addEventListener('beforeunload', function() {
    if (currentUser && currentRoom) {
        leaveRoom();
    }
});

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeModal();
    }
});

// 키보드 단축키
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeNotification();
    }
});