import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyAfxwcwUD15Kz4hrBOH7i3flSdrDtGZqNg",
  authDomain: "mimimi-521f3.firebaseapp.com",
  databaseURL: "https://mimimi-521f3-default-rtdb.firebaseio.com",
  projectId: "mimimi-521f3",
  storageBucket: "mimimi-521f3.firebasestorage.app",
  messagingSenderId: "890685596287",
  appId: "1:890685596287:web:ff1d7c2c062a6930be554a",
  measurementId: "G-MJ5RY1HK53"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Node Server with Firebase and TypeScript is running!');
});

// Example endpoint to add data to Firestore
app.post('/api/data', async (req, res) => {
  try {
    await setDoc(doc(db, "cities", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
