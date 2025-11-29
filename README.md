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
- **Local JSON File Storage** (no database required!)
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
│   ├── data/                      # Local storage (JSON files)
│   │   ├── users.json
│   │   ├── activities.json
│   │   ├── registrations.json
│   │   └── notifications.json
│   ├── src/
│   │   ├── api/
│   │   │   ├── authRoutes.js      # Authentication routes
│   │   │   ├── activityRoutes.js  # Activity CRUD routes
│   │   │   ├── registrationRoutes.js # Registration routes
│   │   │   └── notificationRoutes.js # Notification routes
│   │   ├── storage/
│   │   │   └── fileStorage.js     # File-based storage system
│   │   ├── middleware/
│   │   │   └── auth.js            # Authentication middleware
│   │   ├── server.js              # Entry point
│   │   └── app.js                 # Express app setup
│   └── package.json
├── .gitignore
└── README.md
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- **No database required!** Data is stored locally in JSON files

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will create JSON data files automatically in the `backend/data/` folder.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

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
