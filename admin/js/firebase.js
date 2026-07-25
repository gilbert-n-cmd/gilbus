// =====================================
// BUSGO ADMIN FIREBASE CONFIGURATION
// =====================================


// Firebase App

import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// Authentication

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Firestore Database

import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Storage (for bus images, documents etc.)

import { 
    getStorage 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";




// =====================================
// FIREBASE CONFIG
// =====================================


const firebaseConfig = {


    apiKey: "AIzaSyDpRkkp6fdlmVQM5xnLsRkRPS5awu0YSmc",


    authDomain: "website-database-d75ea.firebaseapp.com",


    databaseURL: "https://website-database-d75ea-default-rtdb.firebaseio.com",


    projectId: "website-database-d75ea",


    storageBucket: "website-database-d75ea.firebasestorage.app",


    messagingSenderId: "61842953615",


    appId: "1:61842953615:web:ea3476ef5ed8657f0767fa"

};




// =====================================
// INITIALIZE FIREBASE
// =====================================


const app = initializeApp(firebaseConfig);




// =====================================
// SERVICES
// =====================================


const auth = getAuth(app);


const db = getFirestore(app);


const storage = getStorage(app);




// EXPORT FOR OTHER FILES

export {
    app,
    auth,
    db,
    storage
};

