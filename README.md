# KnowX - Skills Exchange Platform for students

KnowX is a web application that connects students who want to exchange skills and knowledge. Offer what you know, find what you need!

## Features

- **🔐 User Authentication** - Secure signup/login with JWT
- **🎯 Create requests for help** - Post the skills you need help with
- **🔍 Browse Offers** - Find people who can help you
- **✏️ Edit Your Posts** - Update or delete your offers
- **👤 User Profiles** - Manage your skills and what you want to learn
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile

## Tech Stack

**Frontend:**

- React.js
- Material-UI (MUI)
- React Router
- Axios

**Backend:**

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- CORS

**Development:**

- RESTful API design
- Modern JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Nelyrma/KnowX_project.git
cd knowx
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Set up database**

- Create a PostgreSQL database named `knowx`
- Update database credentials in `backend/db.js`

5. **Run the application**

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

6. **Open the browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```bash
knowx/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   └── offers.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── theme.js
│   │   └── App.js
│   └── public/
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| POST   | `/api/auth/signup`  | User registration   |
| POST   | `/api/auth/login`   | User login          |
| GET    | `/api/auth/profile` | Get user profile    |
| PATCH  | `/api/auth/profile` | Update user profile |
| GET    | `/api/offers`       | Get all offers      |
| GET    | `/api/offers/:id`   | Get single offer    |
| POST   | `/api/offers`       | Create new offer    |
| PUT    | `/api/offers/:id`   | Update offer        |
| DELETE | `/api/offers/:id`   | Delete offer        |

## 🎨 UI Components

- **Home Page** - Browse all skill offers with search functionality

- **Offer Detail** - View complete offer details

- **Create Offer** - Form to post new skill offers

- **Edit Offer** - Modify existing offers

- **User Profile** - Manage personal skills and preferences

- **Authentication** - Login and registration forms

## 🔒 Security Features

- JWT token authentication

- Password encryption

- Protected routes

- User-specific data access

- SQL injection prevention

## 🤝 Contributing

1. Fork the project

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request
