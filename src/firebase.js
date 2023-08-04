// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// import firebase from "firebase";
// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// import "firebase/storage";

// const firebaseApp = firebase.initializeApp({
//     apiKey: "AIzaSyAywk3PzyabOrfizSliqGi3Lnh_7WtHWRg",
//     authDomain: "instagram-clone-dd279.firebaseapp.com",
//     projectId: "instagram-clone-dd279",
//     storageBucket: "instagram-clone-dd279.appspot.com",
//     messagingSenderId: "262249114419",
//     appId: "1:262249114419:web:625901c0e1712e368f6c46",
//     measurementId: "G-750B4DN0DM"
// });

// const db = firebase.firestore();
// const auth = firebase.auth();
// const storage = firebase.storage();

// export {db,auth,storage};

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase configuration values
  apiKey: "AIzaSyAywk3PzyabOrfizSliqGi3Lnh_7WtHWRg",
  authDomain: "instagram-clone-dd279.firebaseapp.com",
  databaseURL: "https://instagram-clone-dd279-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-dd279",
  storageBucket: "instagram-clone-dd279.appspot.com",
  messagingSenderId: "262249114419",
  appId: "1:262249114419:web:625901c0e1712e368f6c46",
  measurementId: "G-750B4DN0DM"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// const db = getFirestore();
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };

