# LeadDesk Mini - Lead Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) lead management application designed to help businesses capture customer inquiries and manage them through a simple sales pipeline.

The application provides:
- A public landing page where users can submit leads.
- A secure admin dashboard where administrators can view, search, and update lead statuses.

---

# Live Demo & Submission Links

## Public Landing Page

🔗 Live URL:



```
https://lead-desk-mini-client-j22oqad64-nivrutti07s-projects.vercel.app/
```

---

## Admin Dashboard

🔗 Admin URL:

```
https://lead-desk-mini-client-j22oqad64-nivrutti07s-projects.vercel.app/admin/login
```

---

## GitHub Repository

🔗 Source Code:

```
https://github.com/Nivrutti07/LEAD-DESK-MINI
```

---

## Loom Walkthrough

🎥 Video Demonstration:

```
https://www.loom.com/share/your-video-link
```

---

# Admin Credentials

Use the following credentials to access the admin panel:

```
Email:
admin@gmail.com

Password:
admin@123
```

> Admin registration is disabled. Admin accounts are created securely from the backend to prevent unauthorized admin creation.
# AI Tools Usage

During the development of LeadDesk Mini, I used AI tools as a productivity assistant for understanding, planning, and improving the implementation.

## How I Used AI Tools

1. **Understanding the Problem**
   
   First, I analyzed the assignment requirements and broke the problem into smaller parts:
   - Public landing page with lead form
   - Backend API for lead submission
   - Database storage
   - Admin authentication
   - Admin dashboard for lead management

2. **Planning Project Structure**

   After understanding the requirements, I explained the expected application structure to the AI tool and used it to get suggestions for:
   - Folder organization
   - Component structure
   - API flow
   - Database models
   - Authentication approach

3. **Starter Code Generation**

   I used AI tools to generate initial boilerplate/starter code for:
   - React component structure
   - Express routes
   - MongoDB models
   - Authentication setup

   The generated code was treated as a starting point, which I reviewed and modified according to the project requirements.

4. **Customizing Functionality**

   After understanding the generated code, I modified and implemented my own functionality:
   - Lead creation and storage
   - JWT-based admin authentication
   - Protected admin routes
   - Lead search and status updates
   - Dashboard statistics

5. **UI/UX Improvement**

   I used AI tools for improving the frontend design:
   - Modern layout suggestions
   - Responsive styling
   - Better component design
   - User experience improvements

   The final UI, functionality, and integration decisions were implemented and customized based on the project requirements.

## AI Tools Used

- AI assistant tools for code suggestions, debugging, and UI improvement.
- Documentation and official resources were used for understanding concepts and validating implementation decisions.
---

# Features

## Public Landing Page

- Modern responsive landing page
- Lead capture form
- Client-side validation
- Server-side validation
- Stores submissions in MongoDB


Lead form fields:

- Name
- Email
- Budget Range
- Message


---

## Admin Panel

- Secure admin login
- JWT-based authentication
- Protected dashboard routes
- View all submitted leads
- Search leads by name and email
- View individual lead details
- Update lead status


Lead workflow:

```
New → Contacted → Closed
```

Dashboard statistics:

- Total Leads
- New Leads
- Contacted Leads
- Closed Leads

---

# Technology Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- CSS / Tailwind CSS


## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt Password Hashing
- Express Validator


## Database

- MongoDB
- Mongoose ODM


---

# Project Structure

```
LeadDesk-Mini

│
├── client
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
│
├── server
│   │
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   ├── createAdmin.js
│   └── server.js
│
│
├── README.md
└── .gitignore
```

---

# Data Model

## Admin Model

```javascript
{
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Security

- Passwords are never stored as plain text.
- Passwords are hashed using bcrypt before saving.


---

## Lead Model

```javascript
{
  name: String,

  email: String,

  budget: String,

  message: String,

  status: {
    type: String,
    enum: [
      "New",
      "Contacted",
      "Closed"
    ],
    default: "New"
  },

  createdAt: Date,

  updatedAt: Date
}
```

---

# Authentication Approach

The application uses **JWT (JSON Web Token)** based authentication.

## Authentication Flow

```
Admin enters email and password

            ↓

POST /api/auth/login

            ↓

Validate credentials

            ↓

Compare password using bcrypt

            ↓

Generate JWT Token

            ↓

Store token in browser

            ↓

Access protected admin routes
```

---

## JWT Security

- Passwords are hashed using bcrypt.
- JWT tokens are signed using a secret key.
- Protected APIs verify JWT before allowing access.
- Unauthorized users cannot access admin data.

---

# API Documentation

## Authentication APIs

---

## Admin Login

```
POST /api/auth/login
```

Request:

```json
{
  "email": "admin@gamil.com",
  "password": "admin@123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token"
}
```

---

# Lead APIs


## Create Lead

```
POST /api/leads
```

Used by the public landing page.

Example:

```json
{
  "name": "abc",
  "email": "abc@gmail.com",
  "budget": "₹10,000 - ₹50,000",
  "message": "Need information about services"
}
```

---

## Get All Leads

```
GET /api/leads
```

Protected admin API.

Features:
- Search
- Filtering
- Lead listing


---

## Get Lead Details

```
GET /api/leads/:id
```


---

## Update Lead Status

```
PATCH /api/leads/:id
```

Status workflow:

```
New
 ↓
Contacted
 ↓
Closed
```

---

## Dashboard Statistics

```
GET /api/leads/stats/overview
```

Returns:

- Total leads
- New leads
- Contacted leads
- Closed leads


---

# Validation

## Client Side Validation

Implemented in React:

- Required fields
- Email format validation
- User-friendly error messages


## Server Side Validation

Implemented using Express Validator:

- Required fields checking
- Email validation
- Password validation
- Data sanitization


---

# Workflow Demonstration

## Step 1: Lead Submission

A visitor opens:

```
/
```

and submits the lead form.

The backend validates the data and stores it in MongoDB.

Default status:

```
New
```

---

## Step 2: Admin Login

Admin opens:

```
/admin/login
```

and logs in using valid credentials.

---

## Step 3: Lead Management

Admin can:

- View leads
- Search leads
- Open lead details
- Change lead status


Status progression:

```
New → Contacted → Closed
```

---

# Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=mongodb_connection_string

JWT_SECRET=secret_key

NODE_ENV=production
```


## Frontend (.env)

```env
VITE_API_URL=backend_url
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Nivrutti07/LEAD-DESK-MINI.git

cd LEAD-DESK-MINI
```

---

# Backend Setup

```bash
cd server

npm install

npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Deployment

## Frontend

Deployed using:

```
Vercel
```


## Backend

Deployed using:

```
Render
```


## Database

Hosted using:

```
MongoDB Atlas
```

---

# Loom Walkthrough Content

The walkthrough covers:

1. Opening the public landing page.
2. Submitting a new lead.
3. Admin login process.
4. Viewing submitted leads.
5. Searching leads.
6. Updating lead status.
7. Verifying status changes.


Video Link:

```
https://www.loom.com/share/your-video-link
```

---

# Future Improvements

- Email notifications for new leads
- Role-based admin permissions
- Lead analytics charts
- Export leads as CSV
- Advanced filtering


---

# Author

**Nivrutti Patil**

Computer Science Engineering Student

GitHub:

```
https://github.com/Nivrutti07
```

---

# License

This project is developed as part of the LeadDesk Mini internship assignment.
