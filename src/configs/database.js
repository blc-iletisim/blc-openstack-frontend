import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTT8sVSWIiAu-yTlm5pohoDQivu1n9Ggg",
  authDomain: "personel-mission-cont.firebaseapp.com",
  databaseURL:
    "https://personel-mission-cont-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "personel-mission-cont",
  storageBucket: "personel-mission-cont.appspot.com",
  messagingSenderId: "279923467953",
  appId: "1:279923467953:web:215c721c55ca5031efe490",
  measurementId: "G-11QMBL49HB",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

const database = getDatabase(app);
export default database;
