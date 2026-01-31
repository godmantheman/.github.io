// 전역 변수
let currentUser = null;
let currentRoom = null;
let messagesListener = null;
let roomsListener = null;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeSections();
    checkAutoLogin();
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
        <h2>📷 가족 사진 (실시간 공유)</h2>
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
        <h2>🎲 가족 부루마블 (실시간 멀티플레이)</h2>
        <div class="board-game">
            <div class="game-rooms">
                <h3>게임방 목록 (실시간)</h3>
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
        <h2>📅 가족 일정 (실시간 공유)</h2>
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
            <span class="username">🔥 Firebase:</span>
            <span>실시간 가족 채팅방에 오신 것을 환영합니다! 🎉</span>
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
        joinTime: new Date().toISOString(),
        id: Date.now() + Math.random()
    };
    
    localStorage.setItem('familySiteUser', JSON.stringify(currentUser));
    
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    document.getElementById('welcomeMessage').textContent = `안녕하세요, ${username}님!`;
    
    // Firebase 실시간 리스너 시작
    startRealtimeListeners();
    
    addSystemMessage(`${username}님이 입장하셨습니다! 👋`);
    showNotification(`${username}님, Firebase 실시간 연결 완료! 🔥`, 'success');
}

function logout() {
    if (currentUser) {
        addSystemMessage(`${currentUser.username}님이 퇴장하셨습니다! 👋`);
        if (currentRoom) {
            leaveRoom();
        }
        
        // Firebase 리스너 정리
        stopRealtimeListeners();
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
        
        startRealtimeListeners();
        showNotification('Firebase 자동 로그인 완료! 🔥', 'success');
    }
}

// Firebase 실시간 리스너들
function startRealtimeListeners() {
    // 채팅 메시지 실시간 리스너
    const messagesRef = firebaseRef(database, `messages/${currentUser.familyCode}`);
    messagesListener = firebaseOnValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const chatMessages = document.getElementById('chatMessages');
        
        if (data) {
            const messages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
            chatMessages.innerHTML = '';
            
            messages.slice(-50).forEach(messageData => {
                displayMessage(messageData);
            });
        }
    });
    
    // 게임방 실시간 리스너
    const roomsRef = firebaseRef(database, `gameRooms/${currentUser.familyCode}`);
    roomsListener = firebaseOnValue(roomsRef, (snapshot) => {
        const data = snapshot.val();
        updateRoomList(data ? Object.values(data) : []);
    });
}

function stopRealtimeListeners() {
    if (messagesListener) {
        firebaseOff(firebaseRef(database, `messages/${currentUser.familyCode}`), 'value', messagesListener);
    }
    if (roomsListener) {
        firebaseOff(firebaseRef(database, `gameRooms/${currentUser.familyCode}`), 'value', roomsListener);
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
}

// 채팅 기능 (Firebase 실시간)
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentUser) return;
    
    const messageData = {
        username: currentUser.username,
        message: message,
        timestamp: Date.now(),
        familyCode: currentUser.familyCode,
        type: 'text',
        id: Date.now() + Math.random()
    };
    
    // Firebase에 메시지 저장 (실시간 동기화)
    const messagesRef = firebaseRef(database, `messages/${currentUser.familyCode}`);
    firebasePush(messagesRef, messageData);
    
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
}

function addSystemMessage(message) {
    const messageData = {
        username: '🔥 Firebase',
        message: message,
        timestamp: Date.now(),
        familyCode: currentUser?.familyCode || 'system',
        type: 'system',
        id: Date.now() + Math.random()
    };
    
    // Firebase에 시스템 메시지 저장
    const messagesRef = firebaseRef(database, `messages/${currentUser.familyCode}`);
    firebasePush(messagesRef, messageData);
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
        
        const messageData = {
            username: currentUser.username,
            message: imageData,
            timestamp: Date.now(),
            familyCode: currentUser.familyCode,
            type: 'image',
            id: Date.now() + Math.random()
        };
        
        // Firebase에 이미지 메시지 저장
        const messagesRef = firebaseRef(database, `messages/${currentUser.familyCode}`);
        firebasePush(messagesRef, messageData);
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 게임방 관리 (Firebase 실시간)
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
    
    const roomId = Date.now() + Math.random();
    const newRoom = {
        id: roomId,
        name: roomName,
        host: currentUser.username,
        players: [currentUser],
        maxPlayers: maxPlayers,
        status: 'waiting',
        familyCode: currentUser.familyCode,
        createdAt: Date.now(),
        gameState: {
            players: [],
            currentPlayer: 0,
            diceRolled: false,
            properties: {},
            turn: 1
        }
    };
    
    // Firebase에 게임방 저장
    const roomRef = firebaseRef(database, `gameRooms/${currentUser.familyCode}/${roomId}`);
    firebaseSet(roomRef, newRoom);
    
    showNotification(`게임방 "${roomName}"이 생성되었습니다!`, 'success');
    addSystemMessage(`🎲 새 게임방 "${roomName}"이 생성되었습니다!`);
    
    document.getElementById('roomName').value = '';
    document.getElementById('maxPlayers').value = '4';
}

function joinGameRoom(roomId) {
    // Firebase에서 실시간으로 방 정보 가져오기
    const roomRef = firebaseRef(database, `gameRooms/${currentUser.familyCode}/${roomId}`);
    firebaseGet(roomRef).then((snapshot) => {
        const room = snapshot.val();
        if (!room) {
            showNotification('방을 찾을 수 없습니다!', 'error');
            return;
        }
        
        if (room.players.length >= room.maxPlayers) {
            showNotification('방이 가득 찼습니다!', 'error');
            return;
        }
        
        if (room.players.find(p => p.username === currentUser.username)) {
            showNotification('이미 참가한 방입니다!', 'error');
            return;
        }
        
        // 플레이어 추가
        room.players.push(currentUser);
        currentRoom = room;
        
        // Firebase에 업데이트된 방 정보 저장
        firebaseSet(roomRef, room);
        
        document.querySelector('.game-rooms').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';
        
        initializeMonopolyBoard();
        
        addSystemMessage(`${currentUser.username}님이 "${room.name}" 게임방에 입장했습니다!`);
        showNotification(`"${room.name}" 방에 입장했습니다!`, 'success');
    });
}

function updateRoomList(rooms) {
    const roomList = document.getElementById('roomList');
    if (!roomList) return;
    
    roomList.innerHTML = '';
    
    if (rooms.length === 0) {
        roomList.innerHTML = '<p style="text-align: center; color: #666;">아직 게임방이 없습니다. 새로운 방을 만들어보세요!</p>';
        return;
    }
    
    rooms.forEach(room => {
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
            <button class="play-btn" onclick="joinGameRoom('${room.id}')" 
                    ${room.players.length >= room.maxPlayers ? 'disabled' : ''}>
                ${room.players.length >= room.maxPlayers ? '방 가득함' : '입장하기'}
            </button>
        `;
        roomList.appendChild(roomCard);
    });
}

// 간단한 게임들과 유틸리티 함수들
function startQuiz() {
    const questions = [
        { q: "우리 가족의 가장 좋아하는 음식은?", a: ["피자", "치킨", "한식", "중식"] },
        { q: "가족 여행으로 가고 싶은 곳은?", a: ["바다", "산", "도시", "해외"] }
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

// 부루마블 게임 (간단 버전)
function initializeMonopolyBoard() {
    // 간단한 보드 게임 구현
    const board = document.getElementById('monopolyBoard');
    board.innerHTML = '<div style="text-align: center; padding: 50px;">🎲 부루마블 게임이 곧 시작됩니다!</div>';
    
    const gameInfo = document.getElementById('gameInfo');
    gameInfo.innerHTML = `
        <div>현재 방: ${currentRoom.name}</div>
        <div>참가자: ${currentRoom.players.map(p => p.username).join(', ')}</div>
        <div>상태: 게임 준비 중...</div>
    `;
}

function rollDice() {
    if (!currentRoom) return;
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice1').textContent = dice1;
    document.getElementById('dice2').textContent = dice2;
    
    addSystemMessage(`🎲 ${currentUser.username}님이 ${dice1}, ${dice2} (총 ${dice1 + dice2})을 굴렸습니다!`);
}

function leaveRoom() {
    if (!currentRoom) return;
    
    addSystemMessage(`${currentUser.username}님이 "${currentRoom.name}" 게임방에서 나갔습니다!`);
    
    currentRoom = null;
    document.querySelector('.game-rooms').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
}

// 기타 게임들 (간단 구현)
function startMemoryGame() {
    showGameModal(`
        <h3>🃏 기억력 게임</h3>
        <p>Firebase 실시간 버전으로 업그레이드 예정!</p>
        <button class="play-btn" onclick="closeModal()">닫기</button>
    `);
}

function startBingoGame() {
    showGameModal(`
        <h3>🎯 빙고 게임</h3>
        <p>Firebase 실시간 버전으로 업그레이드 예정!</p>
        <button class="play-btn" onclick="closeModal()">닫기</button>
    `);
}

// 사진 업로드 (간단 구현)
function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            addSystemMessage(`📷 ${currentUser.username}님이 사진을 업로드했습니다!`);
            
            // 이미지를 채팅으로 전송
            const messageData = {
                username: currentUser.username,
                message: e.target.result,
                timestamp: Date.now(),
                familyCode: currentUser.familyCode,
                type: 'image',
                id: Date.now() + Math.random()
            };
            
            const messagesRef = firebaseRef(database, `messages/${currentUser.familyCode}`);
            firebasePush(messagesRef, messageData);
        };
        reader.readAsDataURL(file);
    });
    
    event.target.value = '';
}

// 일정 관리 (간단 구현)
function addEvent() {
    const title = document.getElementById('eventTitle')?.value.trim();
    if (title) {
        addSystemMessage(`📅 ${currentUser.username}님이 새 일정을 추가했습니다: ${title}`);
        showNotification('일정이 추가되었습니다!', 'success');
    }
}

// 페이지 종료 시 정리
window.addEventListener('beforeunload', function() {
    stopRealtimeListeners();
});