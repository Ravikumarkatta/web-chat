// Authentication logic for ChatSphere
class AuthService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.token = localStorage.getItem('chatToken');
    this.user = JSON.parse(localStorage.getItem('chatUser') || 'null');
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem('chatToken', this.token);
      localStorage.setItem('chatUser', JSON.stringify(this.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('chatToken');
    localStorage.removeItem('chatUser');
    this.token = null;
    this.user = null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    return this.user;
  }

  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }
}

const authService = new AuthService('http://localhost:3001');

// Simulated WebSocket connection
class ChatApp {
    constructor() {
        this.currentUser = null;
        this.currentRoom = 'General';
        this.rooms = ['General', 'Tech Talk', 'Random', 'Private Team'];
        this.users = [
            { id: 1, name: 'Alice Miller', initials: 'AM', color: 'bg-green-500', active: true },
            { id: 2, name: 'Bob Johnson', initials: 'BJ', color: 'bg-purple-500', active: false },
            { id: 3, name: 'Sarah Connor', initials: 'SC', color: 'bg-yellow-500', active: true },
            { id: 4, name: 'Mike Peterson', initials: 'MP', color: 'bg-red-500', active: false }
        ];
        this.messages = {
            'General': [
                { user: 'Bob Johnson', initials: 'BJ', color: 'bg-purple-500', text: 'Hey everyone! How\'s it going?', time: '10:30 AM' },
                { user: 'Alice Miller', initials: 'AM', color: 'bg-green-500', text: 'Good! Just working on the new project. Anyone want to review my PR?', time: '10:32 AM' },
                { user: 'You', initials: 'JD', color: 'bg-indigo-500', text: 'I can take a look. What\'s the link?', time: '10:33 AM' },
                { user: 'Alice Miller', initials: 'AM', color: 'bg-green-500', text: 'Here it is: github.com/project/pull/42', time: '10:34 AM' },
                { user: 'Sarah Connor', initials: 'SC', color: 'bg-yellow-500', text: 'I\'ve been working on this feature too! Here\'s a screenshot:', time: '10:35 AM', image: 'https://via.placeholder.com/300x200' },
                { user: 'You', initials: 'JD', color: 'bg-indigo-500', text: 'Looks great! I left some comments on the PR.', time: '10:36 AM', reactions: ['👍', 'Nice work!'] }
            ]
        };
        
        this.initElements();
        this.initEventListeners();
        this.simulateUserActivity();
        this.simulateTyping();
    }
    
    initElements() {
        this.authScreen = document.getElementById('auth-screen');
        this.chatScreen = document.getElementById('chat-screen');
        this.authForm = document.getElementById('auth-form');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.logoutBtn = document.getElementById('logout-btn');
        this.logoutSettingsBtn = document.getElementById('logout-settings-btn');
        this.userAvatar = document.getElementById('user-avatar');
        this.usernameDisplay = document.getElementById('username-display');
        this.roomsList = document.getElementById('rooms-list');
        this.usersList = document.getElementById('users-list');
        this.currentRoomDisplay = document.getElementById('current-room');
        this.messagesContainer = document.getElementById('messages-container');
        this.messageForm = document.getElementById('message-form');
        this.messageInput = document.getElementById('message-input');
        this.createRoomBtn = document.getElementById('create-room-btn');
        this.createRoomModal = document.getElementById('create-room-modal');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.cancelRoomBtn = document.getElementById('cancel-room-btn');
        this.createRoomForm = document.getElementById('create-room-form');
        this.roomNameInput = document.getElementById('room-name');
        this.activeUsersDisplay = document.getElementById('active-users');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeSettingsBtn = document.getElementById('close-settings-btn');
        this.refreshRoomsBtn = document.getElementById('refresh-rooms-btn');
        this.inviteUserBtn = document.getElementById('invite-user-btn');
    }
    
    initEventListeners() {
        // Auth form submission
        this.authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Logout buttons
        this.logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
        
        this.logoutSettingsBtn.addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Room selection
        this.roomsList.addEventListener('click', (e) => {
            const roomItem = e.target.closest('.room-item');
            if (roomItem) {
                const roomName = roomItem.querySelector('span:nth-child(2)')?.textContent || 
                                 roomItem.querySelector('span:not([class])')?.textContent;
                if (roomName) {
                    this.switchRoom(roomName);
                }
            }
        });
        
        // User selection (for private messages)
        this.usersList.addEventListener('click', (e) => {
            const userItem = e.target.closest('.user-item');
            if (userItem) {
                const userName = userItem.querySelector('span').textContent;
                this.showPrivateChat(userName);
            }
        });
        
        // Message submission
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        
        // Message input typing detection
        this.messageInput.addEventListener('input', () => {
            // In a real app, this would send a "user is typing" event via WebSocket
            if (this.messageInput.value.trim() !== '') {
                this.typingIndicator.classList.remove('hidden');
            } else {
                this.typingIndicator.classList.add('hidden');
            }
        });
        
        // Create room modal
        this.createRoomBtn.addEventListener('click', () => {
            this.createRoomModal.classList.remove('hidden');
        });
        
        this.closeModalBtn.addEventListener('click', () => {
            this.createRoomModal.classList.add('hidden');
        });
        
        this.cancelRoomBtn.addEventListener('click', () => {
            this.createRoomModal.classList.add('hidden');
        });
        
        // Create room form submission
        this.createRoomForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewRoom();
        });
        
        // Settings modal
        this.settingsBtn.addEventListener('click', () => {
            this.settingsModal.classList.remove('hidden');
        });
        
        this.closeSettingsBtn.addEventListener('click', () => {
            this.settingsModal.classList.add('hidden');
        });
        
        // Refresh rooms button
        this.refreshRoomsBtn.addEventListener('click', () => {
            // In a real app, this would fetch updated rooms from the server
            console.log('Refreshing rooms list...');
            this.showToast('Rooms list refreshed');
        });
        
        // Invite user button
        this.inviteUserBtn.addEventListener('click', () => {
            // In a real app, this would open an invite dialog
            console.log('Opening invite user dialog...');
            this.showToast('Invite feature coming soon!');
        });
    }
    
    async handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        if (username && password) {
            try {
                const data = await authService.login({ username, password });
                
                // Simulate successful login
                this.currentUser = {
                    name: username,
                    initials: username.split(' ').map(n => n[0]).join('').toUpperCase(),
                    color: 'bg-indigo-500'
                };
                
                // Update UI
                this.authScreen.classList.add('hidden');
                this.chatScreen.classList.remove('hidden');
                this.usernameDisplay.textContent = username;
                this.userAvatar.textContent = this.currentUser.initials;
                this.userAvatar.className = `relative`;
                this.userAvatar.innerHTML = `
                    <div class="w-10 h-10 rounded-full ${this.currentUser.color} text-white flex items-center justify-center font-semibold">
                        ${this.currentUser.initials}
                    </div>
                    <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                `;
                
                // Load initial room messages
                this.loadMessages(this.currentRoom);
                
                // Show welcome toast
                this.showToast(`Welcome back, ${username}!`);
            } catch (error) {
                console.error('Login failed:', error);
                this.showToast('Login failed. Please check your credentials.');
            }
        }
    }
    
    handleLogout() {
        this.currentUser = null;
        this.chatScreen.classList.add('hidden');
        this.authScreen.classList.remove('hidden');
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        this.settingsModal.classList.add('hidden');
        
        // Show logout toast
        this.showToast('You have been logged out');
    }
    
    switchRoom(roomName) {
        this.currentRoom = roomName;
        this.currentRoomDisplay.textContent = roomName;
        
        // Update active room in sidebar
        document.querySelectorAll('.room-item').forEach(item => {
            item.classList.remove('bg-blue-100');
        });
        
        const activeRoom = Array.from(document.querySelectorAll('.room-item')).find(item => {
            const span = item.querySelector('span:nth-child(2)') || item.querySelector('span:not([class])');
            return span?.textContent === roomName;
        });
        
        if (activeRoom) {
            activeRoom.classList.add('bg-blue-100');
        }
        
        this.loadMessages(roomName);
        
        // Show room switch toast
        this.showToast(`Switched to ${roomName} room`);
    }
    
    showPrivateChat(userName) {
        // In a real app, this would open a private chat with the selected user
        console.log(`Opening private chat with ${userName}`);
        this.showToast(`Opening private chat with ${userName}`);
    }
    
    loadMessages(roomName) {
        this.messagesContainer.innerHTML = '';
        
        // Add date divider
        const dateDivider = document.createElement('div');
        dateDivider.className = 'flex items-center my-4';
        dateDivider.innerHTML = `
            <div class="flex-1 border-t border-gray-200"></div>
            <span class="px-3 text-sm text-gray-500">Today</span>
            <div class="flex-1 border-t border-gray-200"></div>
        `;
        this.messagesContainer.appendChild(dateDivider);
        
        // Add messages
        if (this.messages[roomName]) {
            this.messages[roomName].forEach(msg => {
                this.addMessageToUI(msg, false);
            });
        } else {
            // No messages in this room yet
            const noMessages = document.createElement('div');
            noMessages.className = 'text-center text-gray-500 py-10';
            noMessages.textContent = 'No messages in this room yet. Be the first to say something!';
            this.messagesContainer.appendChild(noMessages);
        }
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    sendMessage() {
        const messageText = this.messageInput.value.trim();
        
        if (messageText && this.currentUser) {
            const newMessage = {
                user: 'You',
                initials: this.currentUser.initials,
                color: this.currentUser.color,
                text: messageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            // Add to messages object
            if (!this.messages[this.currentRoom]) {
                this.messages[this.currentRoom] = [];
            }
            this.messages[this.currentRoom].push(newMessage);
            
            // Add to UI
            this.addMessageToUI(newMessage, true);
            
            // Clear input and hide typing indicator
            this.messageInput.value = '';
            this.typingIndicator.classList.add('hidden');
            
            // In a real app, this would send the message via WebSocket
            console.log(`Sending message to room ${this.currentRoom}: ${messageText}`);
            
            // Simulate response after 1-3 seconds
            if (Math.random() > 0.3) {
                const responses = [
                    "That's interesting!",
                    "I agree with you.",
                    "What do you mean by that?",
                    "Let's discuss this further.",
                    "Thanks for sharing!",
                    "Can you explain more about that?",
                    "I'll look into it.",
                    "Great point!",
                    "What are your thoughts on this?",
                    "Let me check and get back to you."
                ];
                
                const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
                
                setTimeout(() => {
                    const responseMessage = {
                        user: randomUser.name,
                        initials: randomUser.initials,
                        color: randomUser.color,
                        text: responses[Math.floor(Math.random() * responses.length)],
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    
                    this.messages[this.currentRoom].push(responseMessage);
                    this.addMessageToUI(responseMessage, true);
                    
                    // Show typing indicator briefly before response appears
                    this.showUserTyping(randomUser.name);
                }, 1000 + Math.random() * 2000);
            }
        }
    }
    
    addMessageToUI(message, isNew) {
        const messageDiv = document.createElement('div');
        
        // Apply animation only to new messages
        if (isNew) {
            messageDiv.className = 'message-animation';
        }
        
        const isCurrentUser = message.user === 'You';
        
        let messageContent = `<p class="mt-1 ${isCurrentUser ? 'text-white bg-blue-500' : 'text-gray-800 bg-white'} p-3 rounded-lg shadow-sm max-w-[80%]">${message.text}</p>`;
        
        if (message.image) {
            messageContent = `
                <div class="mt-1 ${isCurrentUser ? 'text-white bg-blue-500' : 'text-gray-800 bg-white'} p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p class="text-gray-800">${message.text}</p>
                    <img src="${message.image}" alt="Attachment" class="mt-2 rounded-lg border border-gray-200">
                </div>
            `;
        }
        
        if (message.reactions) {
            messageContent = `
                <div class="mt-1 text-white bg-blue-500 p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p>${message.text}</p>
                    <div class="mt-2 flex space-x-2">
                        ${message.reactions.map(reaction => 
                            `<div class="bg-blue-400 px-2 py-1 rounded-full text-xs">${reaction}</div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="flex items-start space-x-3 ${isCurrentUser ? 'justify-end' : ''}">
                ${!isCurrentUser ? `<div class="w-8 h-8 rounded-full ${message.color} text-white flex items-center justify-center font-semibold text-sm">${message.initials}</div>` : ''}
                <div class="flex-1 ${isCurrentUser ? 'flex flex-col items-end' : ''}">
                    <div class="flex items-baseline space-x-2">
                        ${!isCurrentUser ? `<span class="font-semibold">${message.user}</span>` : ''}
                        <span class="text-xs text-gray-500">${message.time}</span>
                        ${isCurrentUser ? `<span class="font-semibold">${message.user}</span>` : ''}
                    </div>
                    ${messageContent}
                </div>
                ${isCurrentUser ? `<div class="w-8 h-8 rounded-full ${message.color} text-white flex items-center justify-center font-semibold text-sm">${message.initials}</div>` : ''}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom if it's a new message
        if (isNew) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }
    
    createNewRoom() {
        const roomName = this.roomNameInput.value.trim();
        
        if (roomName && !this.rooms.includes(roomName)) {
            this.rooms.push(roomName);
            
            // Add to UI
            const roomItem = document.createElement('div');
            roomItem.className = 'room-item px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer transition flex items-center space-x-2';
            
            const isPrivate = document.getElementById('private-room').checked;
            roomItem.innerHTML = `
                ${isPrivate ? '<i class="fas fa-lock text-gray-500"></i>' : '<i class="fas fa-hashtag text-gray-500"></i>'}
                <span>${roomName}</span>
            `;
            
            this.roomsList.appendChild(roomItem);
            
            // Close modal and reset form
            this.createRoomModal.classList.add('hidden');
            this.createRoomForm.reset();
            
            // Show success toast
            this.showToast(`Room "${roomName}" created successfully`);
            
            // Switch to the new room
            this.switchRoom(roomName);
        }
    }
    
    simulateUserActivity() {
        // Simulate users becoming active/inactive
        setInterval(() => {
            this.users.forEach(user => {
                // Randomly toggle active status
                if (Math.random() > 0.7) {
                    user.active = !user.active;
                }
            });
            
            // Update active users count
            const activeCount = this.users.filter(u => u.active).length;
            this.activeUsersDisplay.innerHTML = `
                <span class="text-sm">${activeCount} online</span>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
            `;
            
            // Update user list UI
            this.usersList.innerHTML = '';
            this.users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = `user-item px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer transition flex items-center space-x-2`;
                
                const typingIndicator = user.name === 'Sarah Connor' ? 
                    `<div class="typing-indicator">
                        <div class="flex space-x-1">
                            <div class="typing-dot w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div class="typing-dot w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div class="typing-dot w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>` : 
                    '<div class="typing-indicator hidden"></div>';
                
                userItem.innerHTML = `
                    <div class="relative">
                        <div class="w-8 h-8 rounded-full ${user.color} text-white flex items-center justify-center font-semibold text-sm ${user.active ? 'pulse-active' : ''}">${user.initials}</div>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center">
                            <span>${user.name}</span>
                            ${typingIndicator}
                        </div>
                    </div>
                `;
                this.usersList.appendChild(userItem);
            });
        }, 5000);
    }
    
    simulateTyping() {
        // Randomly show typing indicators for demo purposes
        setInterval(() => {
            const typingUsers = ['Alice Miller', 'Bob Johnson', 'Sarah Connor'];
            const randomUser = typingUsers[Math.floor(Math.random() * typingUsers.length)];
            
            this.showUserTyping(randomUser);
        }, 8000);
    }
    
    showUserTyping(userName) {
        // Find the user in the list and show their typing indicator
        const userItems = document.querySelectorAll('.user-item');
        userItems.forEach(item => {
            if (item.textContent.includes(userName)) {
                const typingIndicator = item.querySelector('.typing-indicator');
                if (typingIndicator) {
                    typingIndicator.classList.remove('hidden');
                    
                    // Hide after a random delay (simulating typing completion)
                    setTimeout(() => {
                        typingIndicator.classList.add('hidden');
                    }, 1000 + Math.random() * 3000);
                }
            }
        });
    }
    
    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50';
        toast.innerHTML = `
            <i class="fas fa-check-circle text-green-400"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthService;
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
