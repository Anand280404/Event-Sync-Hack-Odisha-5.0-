// Global variables
let currentUser = null;
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing app');
    checkAuthStatus();
    initializeEventListeners();
    loadInitialData();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Checking auth status - Token:', token ? 'Exists' : 'Missing');
    console.log('User data:', userData);
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateUIForAuthState(true);
    } else {
        updateUIForAuthState(false);
    }
}

// API request helper with enhanced debugging
async function makeRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Making API request to:', `${API_BASE_URL}${url}`);
    console.log('Request options:', { ...options, headers: { ...headers, Authorization: token ? 'Bearer ***' : 'None' } });
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });
        
        console.log('API response status:', response.status);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.log('Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }
        
        console.log('API response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Handle registration with enhanced debugging
async function handleRegister(e) {
    e.preventDefault();
    console.log('Registration form submitted');
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    console.log('Form data:', userData);
    
    if (userData.password !== userData.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        console.log('Sending registration request...');
        const data = await makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        console.log('Registration successful:', data);
        showNotification('Registration successful! Please login.', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
    } catch (error) {
        console.error('Registration failed:', error);
        // Error notification is handled in makeRequest
    }
}

// Handle login with enhanced debugging
async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const formData = new FormData(e.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    console.log('Login credentials:', { ...credentials, password: '***' });
    
    try {
        console.log('Sending login request...');
        const data = await makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        console.log('Login successful:', data);
        
        if (data.token && data.user) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}

// ... rest of your existing app.js functions (keep them as they are) ...

// Add this function to test backend connection
async function testBackendConnection() {
    try {
        console.log('Testing backend connection...');
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('Backend health check:', data);
        return true;
    } catch (error) {
        console.error('Backend connection test failed:', error);
        showNotification('Cannot connect to server. Please make sure the backend is running.', 'error');
        return false;
    }
}

// Call this on page load to verify connection
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testBackendConnection, 1000);
});