
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from "firebase/database"

//Web App's configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCRlytnqx8xYOBXlabbH2aNo2qpaeeExas",
  authDomain: "sunischitappdemo.firebaseapp.com",
  projectId: "sunischitappdemo",
  storageBucket: "sunischitappdemo.appspot.com",
  messagingSenderId: "250857658535",
  appId: "1:250857658535:web:57d37109a36597dd56e382",
  measurementId: "G-CRJKF2TRKC",
  databaseURL: "https://sunischitappdemo-default-rtdb.asia-southeast1.firebasedatabase.app/",
}


const app=firebase.initializeApp(firebaseConfig);

export const db=getDatabase(app)
export { firebase};