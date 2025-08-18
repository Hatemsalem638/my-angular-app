const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://angular-projecr-fef74-default-rtdb.firebaseio.com'
});

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).send({ error: 'Email, password, and username are required' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username
    });
    
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      username,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const token = await admin.auth().createCustomToken(userRecord.uid);
    
    res.status(201).send({ 
      success: true, 
      token,
      uid: userRecord.uid,
      username,
      email,
      message: 'Registration successful' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already in use';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    }
    
    res.status(400).send({ 
      error: errorMessage
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await admin.auth().getUserByEmail(email);
    
    
    const token = await admin.auth().createCustomToken(user.uid);
    
    const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    
    res.status(200).send({ 
      success: true, 
      token,
      uid: user.uid,
      username: userData?.username || user.displayName || 'User',
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Authentication failed';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid password';
    }
    
    res.status(401).send({ 
      error: errorMessage
    });
  }
});

app.post('/initiate-phone-auth', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !phone.startsWith('+')) {
      return res.status(400).send({ error: 'Invalid phone number format. Include country code (+XX)' });
    }

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByPhoneNumber(phone);
      
      const token = await admin.auth().createCustomToken(userRecord.uid);
      const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();
      
      return res.status(200).send({
        exists: true,
        token,
        uid: userRecord.uid,
        username: userData?.username || userRecord.displayName || 'User',
        phone: userRecord.phoneNumber
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(200).send({
          exists: false,
          phone,
          message: 'Proceed with registration'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(500).send({ 
      error: 'Phone authentication failed: ' + error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Authentication server running on port ${PORT}`);
});