Event Sync - Event Management System
Event Sync is a full-stack web application for managing events, registrations, and payments. Built with Node.js, Express, MySQL, and vanilla JavaScript.

🌟 Features
User Authentication: Register, login, and JWT-based authentication

Event Management: Create, view, and manage events

Registration System: Users can register for events

Payment Processing: Integrated payment system for event registrations

User Dashboard: Personal dashboard for managing events and registrations

Responsive Design: Works on desktop and mobile devices

🛠️ Tech Stack:
Frontend:

HTML5 - Structure

CSS3 - Styling with responsive design

Vanilla JavaScript - Client-side functionality

Font Awesome - Icons

Backend:

Node.js - Runtime environment

Express.js - Web framework

MySQL - Database with Sequelize ORM

JWT - Authentication tokens

bcryptjs - Password hashing

Multer - File uploads

CORS - Cross-origin requests

📦 Installation
Prerequisites
Node.js (v14 or higher)

MySQL (v8.0 or higher)

npm or yarn

1. Clone the Repository
bash
git clone https://github.com/your-username/event-sync.git
cd event-sync
2. Install Dependencies
bash
npm install
3. Database Setup
bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE event_sync;"

# Or using MySQL shell:
# CREATE DATABASE event_sync;
4. Environment Configuration
Create a .env file in the root directory:

env
NODE_ENV=development
PORT=5000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=event_sync
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure

# Client URL
CLIENT_URL=http://localhost:3000
5. Start the Application
bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
🚀 Usage
Access the Application: Open http://localhost:3000 in your browser

Register: Create a new account

Login: Access your dashboard

Create Events: Organizers can create new events

Browse Events: Users can view available events

Register for Events: Sign up for events you're interested in

Make Payments: Complete payment for event registrations

📁 Project Structure
text
event-sync/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── registrations.js
│   │   └── users.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   └── firebase.js
│   ├── html/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── events.html
│   │   ├── dashboard.html
│   │   └── payment.html
│   └── assets/
├── .gitignore
├── package.json
└── README.md
🔌 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user (protected)

Events
GET /api/events - Get all events

GET /api/events/:id - Get specific event

POST /api/events - Create new event (protected)

PUT /api/events/:id - Update event (protected)

DELETE /api/events/:id - Delete event (protected)

Registrations
GET /api/registrations - Get user registrations (protected)

POST /api/registrations - Register for event (protected)

POST /api/registrations/:id/pay - Process payment (protected)

Users
GET /api/users - Get all users (admin)

GET /api/users/:id - Get specific user

PUT /api/users/:id - Update user (protected)

🗃️ Database Schema
Users Table
id (Primary Key)

name

email (Unique)

password (Hashed)

createdAt

updatedAt

Events Table
id (Primary Key)

title

description

date

location

price

userId (Foreign Key to Users)

createdAt

updatedAt

Registrations Table
id (Primary Key)

userId (Foreign Key to Users)

eventId (Foreign Key to Events)

paymentStatus

paymentAmount

paymentDate

createdAt

updatedAt

🔒 Security Features
Password hashing with bcryptjs

JWT token authentication

SQL injection prevention with Sequelize

CORS configuration

Input validation and sanitization

File upload restrictions

🧪 Testing
bash
# Test database connection
npm test

# Test specific endpoints using curl or Postman
🚀 Deployment
Production Environment Variables
env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=your-production-frontend-url
Deployment Steps
Set up production MySQL database

Update environment variables

Build frontend assets (if needed)

Start with process manager (PM2)

Set up reverse proxy (Nginx)

Configure SSL certificate

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🆘 Support
If you have any questions or issues, please:

Check the browser console for errors

Verify database connection

Check API endpoints with Postman

Create an issue in the GitHub repository

🙏 Acknowledgments
Font Awesome for icons

MySQL for database

Express.js team for the web framework

All contributors and testers
