// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Request notification permission
function requestNotificationPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      getFCMToken();
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}

// Get FCM token
function getFCMToken() {
  getToken(messaging, { vapidKey: 'your-vapid-key' }).then((currentToken) => {
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      // Send the token to your server for future notifications
      sendTokenToServer(currentToken);
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });
}

// Handle incoming messages
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Display notification
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  if (Notification.permission === 'granted') {
    new Notification(notificationTitle, notificationOptions);
  }
});

// Send token to server
function sendTokenToServer(token) {
  // Implement your server logic to save the token
  console.log('Sending token to server...', token);
  
  // Example using fetch API
  fetch('/api/save-fcm-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ token })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Token saved successfully:', data);
  })
  .catch(error => {
    console.error('Error saving token:', error);
  });
}

// Request notification permission when the page loads
document.addEventListener('DOMContentLoaded', function() {
  if ('Notification' in window) {
    requestNotificationPermission();
  }
});

export { app, messaging };