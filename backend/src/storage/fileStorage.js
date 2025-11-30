const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Data directory path
const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to get file path for a collection
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

// Initialize empty collection if it doesn't exist
const initCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
};

// Read all data from a collection
const readCollection = (collection) => {
  initCollection(collection);
  const filePath = getFilePath(collection);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Write data to a collection
const writeCollection = (collection, data) => {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// File-based storage operations
const FileStorage = {
  // User operations
  users: {
    findOne: async (query) => {
      const users = readCollection('users');
      if (query.email) {
        return users.find(u => u.email === query.email.toLowerCase()) || null;
      }
      if (query._id) {
        return users.find(u => u._id === query._id) || null;
      }
      return null;
    },
    
    findById: async (id) => {
      const users = readCollection('users');
      const user = users.find(u => u._id === id);
      if (user) {
        // Return without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    },
    
    create: async (userData) => {
      const users = readCollection('users');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const newUser = {
        _id: generateId(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || 'student',
        studentId: userData.studentId || '',
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      writeCollection('users', users);
      
      return newUser;
    },
    
    comparePassword: async (plainPassword, hashedPassword) => {
      return await bcrypt.compare(plainPassword, hashedPassword);
    }
  },
  
  // Activity operations
  activities: {
    find: async (query = {}) => {
      let activities = readCollection('activities');
      
      if (query.type) {
        activities = activities.filter(a => a.type === query.type);
      }
      if (query.status) {
        activities = activities.filter(a => a.status === query.status);
      }
      
      // Sort by date
      activities.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return activities;
    },
    
    findById: async (id) => {
      const activities = readCollection('activities');
      return activities.find(a => a._id === id) || null;
    },
    
    create: async (activityData) => {
      const activities = readCollection('activities');
      
      const newActivity = {
        _id: generateId(),
        name: activityData.name,
        description: activityData.description,
        type: activityData.type,
        date: activityData.date,
        time: activityData.time,
        location: activityData.location,
        maxParticipants: activityData.maxParticipants,
        currentParticipants: 0,
        status: activityData.status || 'upcoming',
        createdBy: activityData.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      activities.push(newActivity);
      writeCollection('activities', activities);
      
      return newActivity;
    },
    
    update: async (id, updateData) => {
      const activities = readCollection('activities');
      const index = activities.findIndex(a => a._id === id);
      
      if (index === -1) return null;
      
      activities[index] = {
        ...activities[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      writeCollection('activities', activities);
      return activities[index];
    },
    
    delete: async (id) => {
      const activities = readCollection('activities');
      const index = activities.findIndex(a => a._id === id);
      
      if (index === -1) return false;
      
      activities.splice(index, 1);
      writeCollection('activities', activities);
      return true;
    }
  },
  
  // Registration operations
  registrations: {
    find: async (query = {}) => {
      let registrations = readCollection('registrations');
      
      if (query.student) {
        registrations = registrations.filter(r => r.student === query.student);
      }
      if (query.activity) {
        registrations = registrations.filter(r => r.activity === query.activity);
      }
      
      return registrations;
    },
    
    findOne: async (query) => {
      const registrations = readCollection('registrations');
      return registrations.find(r => 
        r.student === query.student && r.activity === query.activity
      ) || null;
    },
    
    findById: async (id) => {
      const registrations = readCollection('registrations');
      return registrations.find(r => r._id === id) || null;
    },
    
    create: async (regData) => {
      const registrations = readCollection('registrations');
      
      const newReg = {
        _id: generateId(),
        student: regData.student,
        activity: regData.activity,
        status: regData.status || 'registered',
        registeredAt: new Date().toISOString()
      };
      
      registrations.push(newReg);
      writeCollection('registrations', registrations);
      
      return newReg;
    },
    
    update: async (id, updateData) => {
      const registrations = readCollection('registrations');
      const index = registrations.findIndex(r => r._id === id);
      
      if (index === -1) return null;
      
      registrations[index] = { ...registrations[index], ...updateData };
      writeCollection('registrations', registrations);
      
      return registrations[index];
    },
    
    delete: async (id) => {
      const registrations = readCollection('registrations');
      const index = registrations.findIndex(r => r._id === id);
      
      if (index === -1) return false;
      
      registrations.splice(index, 1);
      writeCollection('registrations', registrations);
      return true;
    },
    
    deleteMany: async (query) => {
      let registrations = readCollection('registrations');
      const initialLength = registrations.length;
      
      if (query.activity) {
        registrations = registrations.filter(r => r.activity !== query.activity);
      }
      
      writeCollection('registrations', registrations);
      return initialLength - registrations.length;
    }
  },
  
  // Notification operations
  notifications: {
    find: async (query = {}) => {
      let notifications = readCollection('notifications');
      
      if (query.user) {
        notifications = notifications.filter(n => n.user === query.user);
      }
      
      // Sort by createdAt descending
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return notifications;
    },
    
    findById: async (id) => {
      const notifications = readCollection('notifications');
      return notifications.find(n => n._id === id) || null;
    },
    
    findOne: async (query) => {
      const notifications = readCollection('notifications');
      return notifications.find(n => n._id === query._id && n.user === query.user) || null;
    },
    
    create: async (notifData) => {
      const notifications = readCollection('notifications');
      
      const newNotif = {
        _id: generateId(),
        user: notifData.user,
        title: notifData.title,
        message: notifData.message,
        type: notifData.type || 'update',
        relatedActivity: notifData.relatedActivity,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      notifications.push(newNotif);
      writeCollection('notifications', notifications);
      
      return newNotif;
    },
    
    insertMany: async (notifArray) => {
      const notifications = readCollection('notifications');
      
      const newNotifs = notifArray.map(notifData => ({
        _id: generateId(),
        user: notifData.user,
        title: notifData.title,
        message: notifData.message,
        type: notifData.type || 'update',
        relatedActivity: notifData.relatedActivity,
        read: false,
        createdAt: new Date().toISOString()
      }));
      
      notifications.push(...newNotifs);
      writeCollection('notifications', notifications);
      
      return newNotifs;
    },
    
    update: async (id, updateData) => {
      const notifications = readCollection('notifications');
      const index = notifications.findIndex(n => n._id === id);
      
      if (index === -1) return null;
      
      notifications[index] = { ...notifications[index], ...updateData };
      writeCollection('notifications', notifications);
      
      return notifications[index];
    },
    
    updateMany: async (query, updateData) => {
      const notifications = readCollection('notifications');
      let count = 0;
      
      notifications.forEach((n, index) => {
        if (n.user === query.user && (query.read === undefined || n.read === query.read)) {
          notifications[index] = { ...n, ...updateData };
          count++;
        }
      });
      
      writeCollection('notifications', notifications);
      return count;
    },
    
    countDocuments: async (query = {}) => {
      const notifications = readCollection('notifications');
      let filtered = notifications;
      
      if (query.user) {
        filtered = filtered.filter(n => n.user === query.user);
      }
      if (query.read !== undefined) {
        filtered = filtered.filter(n => n.read === query.read);
      }
      
      return filtered.length;
    },
    
    delete: async (id) => {
      const notifications = readCollection('notifications');
      const index = notifications.findIndex(n => n._id === id);
      
      if (index === -1) return false;
      
      notifications.splice(index, 1);
      writeCollection('notifications', notifications);
      return true;
    }
  },
  
  // Utility to populate related data
  populate: {
    activity: async (registration) => {
      if (!registration) return null;
      const activity = await FileStorage.activities.findById(registration.activity);
      return { ...registration, activity };
    },
    
    activities: async (registrations) => {
      return Promise.all(registrations.map(async (reg) => {
        const activity = await FileStorage.activities.findById(reg.activity);
        return { ...reg, activity };
      }));
    },
    
    student: async (registration) => {
      if (!registration) return null;
      const student = await FileStorage.users.findById(registration.student);
      return { ...registration, student };
    },
    
    students: async (registrations) => {
      return Promise.all(registrations.map(async (reg) => {
        const student = await FileStorage.users.findById(reg.student);
        return { ...reg, student };
      }));
    }
  }
};

module.exports = FileStorage;
