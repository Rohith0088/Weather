# Student Extracurricular Activities Platform

A web application to help manage student involvement in extracurricular activities such as clubs, sports, and events. The platform tracks participation, manages event registrations, and provides updates on upcoming activities.

## Features

### Admin Features
- **Manage Activities**: Create, update, and delete extracurricular activities (clubs, sports, events)
- **Track Participation**: View and manage student registrations for each activity
- **Update Status**: Mark attendance (registered, attended, absent) for participants
- **Dashboard**: View statistics and overview of all activities

### Student Features
- **Browse Activities**: View all available clubs, sports, and events
- **Register for Activities**: Sign up for activities you're interested in
- **Track Participation**: View your registration history and status
- **Notifications**: Receive updates about activity changes and reminders

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React.js** with React Router
- **Axios** for API calls
- **CSS** for styling

## Project Structure

```
/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js           # API client and endpoints
│   │   ├── components/
│   │   │   ├── Navbar.js          # Navigation component
│   │   │   ├── Navbar.css
│   │   │   ├── ActivityCard.js    # Activity display card
│   │   │   └── ActivityCard.css
│   │   ├── context/
│   │   │   └── AuthContext.js     # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.js            # Landing page
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Activities.js      # Browse activities
│   │   │   ├── MyActivities.js    # Student's registrations
│   │   │   ├── Notifications.js   # Notifications page
│   │   │   ├── AdminDashboard.js  # Admin dashboard
│   │   │   └── ManageActivities.js# Manage activities (Admin)
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authRoutes.js      # Authentication routes
│   │   │   ├── activityRoutes.js  # Activity CRUD routes
│   │   │   ├── registrationRoutes.js # Registration routes
│   │   │   └── notificationRoutes.js # Notification routes
│   │   ├── config/
│   │   │   ├── index.js           # Configuration
│   │   │   └── db.js              # Database connection
│   │   ├── middleware/
│   │   │   └── auth.js            # Authentication middleware
│   │   ├── models/
│   │   │   ├── User.js            # User model
│   │   │   ├── Activity.js        # Activity model
│   │   │   ├── Registration.js    # Registration model
│   │   │   └── Notification.js    # Notification model
│   │   ├── server.js              # Entry point
│   │   └── app.js                 # Express app setup
│   └── package.json
├── .gitignore
└── README.md
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/extracurricular
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the React app:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create activity (admin only)
- `PUT /api/activities/:id` - Update activity (admin only)
- `DELETE /api/activities/:id` - Delete activity (admin only)
- `GET /api/activities/:id/participants` - Get participants (admin only)
- `PUT /api/activities/:id/participants/:registrationId` - Update participant status (admin only)

### Registrations
- `GET /api/registrations/my-registrations` - Get user's registrations (protected)
- `POST /api/registrations/register/:activityId` - Register for activity (protected)
- `DELETE /api/registrations/cancel/:activityId` - Cancel registration (protected)

### Notifications
- `GET /api/notifications` - Get user's notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/mark-all-read` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

## User Roles

### Student
- Browse and filter activities
- Register/cancel registrations
- View participation history
- Receive notifications

### Admin
- All student features
- Create/edit/delete activities
- View and manage participants
- Update attendance status

## License

This project is for educational purposes.
