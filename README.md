# 🎉 Event Sync - Event Management System  

> A **full-stack web application** for managing events, registrations, and payments.  
Built with **Node.js**, **Express.js**, **MySQL**, and **Vanilla JavaScript**.  

![License](https://img.shields.io/badge/license-MIT-green)  
![Node](https://img.shields.io/badge/Node.js-18.x-brightgreen)  
![Express](https://img.shields.io/badge/Express-4.x-blue)  
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)  
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)

---

## 🌟 Features  
✅ **User Authentication** — Register, login, and secure authentication using JWT  
✅ **Event Management** — Create, edit, view, and manage events  
✅ **Registration System** — Users can register for events  
✅ **Payment Integration** — Integrated payment gateway for registrations  
✅ **User Dashboard** — Manage your events & registrations  
✅ **Responsive Design** — Works perfectly on desktop & mobile  

---

## 🛠️ Tech Stack  

### **Frontend**  
- **HTML5** → Structure  
- **CSS3** → Styling & responsive design  
- **Vanilla JavaScript** → Client-side interactivity  
- **Font Awesome** → Icons  

### **Backend**  
- **Node.js** → Runtime environment  
- **Express.js** → Web framework  
- **MySQL + Sequelize ORM** → Database  
- **JWT** → Secure authentication  
- **bcrypt.js** → Password hashing  
- **Multer** → File uploads  
- **CORS** → Cross-origin requests  

---

## 📦 Installation & Setup  

### **Prerequisites**  
- [Node.js](https://nodejs.org/) (v14 or higher)  
- [MySQL](https://dev.mysql.com/downloads/) (v8.0 or higher)  
- npm or yarn  

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/event-sync.git
cd event-sync

2. Install Dependencies
npm install

3. Database Setup
mysql -u root -p -e "CREATE DATABASE event_sync;"

4. Environment Configuration

Create a .env file in the backend root directory:

NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=event_sync
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000

5. Start the Application
# Development mode
npm run dev

# Production mode
npm start

🚀 Usage

Open http://localhost:3000
 in your browser

Register → Create a new account

Login → Access your personal dashboard

Create Events → Organizers can add new events

Browse Events → Explore available events

Register → Sign up for events you like

Make Payments → Complete payments securely

📁 Project Structure
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

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register new user      |
| POST   | `/api/auth/login`    | Login user             |
| GET    | `/api/auth/me`       | Get current user (JWT) |

Events

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | `/api/events`     | Get all events   |
| GET    | `/api/events/:id` | Get single event |
| POST   | `/api/events`     | Create event     |
| PUT    | `/api/events/:id` | Update event     |
| DELETE | `/api/events/:id` | Delete event     |

Registrations

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/api/registrations`         | Get user registrations |
| POST   | `/api/registrations`         | Register for event     |
| POST   | `/api/registrations/:id/pay` | Process payment        |

🗃️ Database Schema

| Column    | Type      | Details         |
| --------- | --------- | --------------- |
| id        | INT (PK)  | Primary Key     |
| name      | VARCHAR   | User's name     |
| email     | VARCHAR   | Unique email    |
| password  | VARCHAR   | Hashed password |
| createdAt | TIMESTAMP | Auto-generated  |
| updatedAt | TIMESTAMP | Auto-generated  |

Events Table

| Column      | Type      | Details        |
| ----------- | --------- | -------------- |
| id          | INT (PK)  | Primary Key    |
| title       | VARCHAR   | Event title    |
| description | TEXT      | Event details  |
| date        | DATE      | Event date     |
| location    | VARCHAR   | Event location |
| price       | DECIMAL   | Ticket price   |
| userId      | INT (FK)  | Event creator  |
| createdAt   | TIMESTAMP | Auto-generated |
| updatedAt   | TIMESTAMP | Auto-generated |

Registrations Table

| Column        | Type      | Details         |
| ------------- | --------- | --------------- |
| id            | INT (PK)  | Primary Key     |
| userId        | INT (FK)  | Registered user |
| eventId       | INT (FK)  | Event reference |
| paymentStatus | ENUM      | Paid / Pending  |
| paymentAmount | DECIMAL   | Amount paid     |
| paymentDate   | TIMESTAMP | Payment time    |
| createdAt     | TIMESTAMP | Auto-generated  |
| updatedAt     | TIMESTAMP | Auto-generated  |

🔒 Security Features

Password Hashing → bcryptjs

JWT Authentication → Secures endpoints

SQL Injection Protection → Using Sequelize ORM

CORS Configuration → Secured cross-origin requests

Input Validation & Sanitization

File Upload Restrictions

🧪 Testing

# Test database connection
npm test

# Test API endpoints using Postman or cURL

🚀 Deployment

NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=your-production-frontend-url

Deployment Steps

Set up a production MySQL database

Configure .env variables

Build frontend assets

Start app with PM2

Set up Nginx reverse proxy

Configure SSL certificate

🤝 Contributing

Contributions are welcome! 🎉

Fork the project

Create a feature branch → git checkout -b feature/AmazingFeature

Commit changes → git commit -m "Add AmazingFeature"

Push branch → git push origin feature/AmazingFeature

Open a Pull Request

📝 License

This project is licensed under the MIT License — see the LICENSE
 file for details.

🆘 Support

Check browser console for frontend errors

Verify database connection

Test API endpoints with Postman

Create an issue in the repository if stuck
