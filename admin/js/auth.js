// =====================================
// FIREBASE IMPORTS
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// FIREBASE CONFIG
// =====================================

const firebaseConfig = {

    apiKey: "AIzaSyDpRkkp6fdlmVQM5xnLsRkRPS5awu0YSmc",

    authDomain: "website-database-d75ea.firebaseapp.com",

    projectId: "website-database-d75ea",

    storageBucket: "website-database-d75ea.firebasestorage.app",

    messagingSenderId: "61842953615",

    appId: "1:61842953615:web:ea3476ef5ed8657f0767fa"

};


// =====================================
// INITIALIZE FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =====================================
// ELEMENTS
// =====================================

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const message = document.getElementById("message");

const togglePassword = document.getElementById("togglePassword");

const remember = document.querySelector("input[type='checkbox']");


// =====================================
// SHOW / HIDE PASSWORD
// =====================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.replace("fa-eye-slash", "fa-eye");

    }

});


// =====================================
// LOGIN
// =====================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "#ffffff";

    message.textContent = "Signing in...";


    try {

        await setPersistence(

            auth,

            remember.checked

                ? browserLocalPersistence

                : browserSessionPersistence

        );


        const userCredential = await signInWithEmailAndPassword(

            auth,

            email.value.trim(),

            password.value

        );


        const user = userCredential.user;


        const docRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(docRef);


        if (!docSnap.exists()) {

            message.style.color = "#ff4d4d";

            message.textContent = "Admin record not found.";

            return;

        }


        const data = docSnap.data();


        if (data.role !== "admin") {

            message.style.color = "#ff4d4d";

            message.textContent = "Access denied. Not an administrator.";

            await auth.signOut();

            return;

        }


        message.style.color = "#7CFC00";

        message.textContent = "Login successful...";


        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1000);

    }

    catch (error) {

        message.style.color = "#ff4d4d";

        switch (error.code) {

            case "auth/invalid-email":
                message.textContent = "Invalid email address.";
                break;

            case "auth/invalid-credential":
                message.textContent = "Incorrect email or password.";
                break;

            case "auth/user-disabled":
                message.textContent = "Account has been disabled.";
                break;

            case "auth/too-many-requests":
                message.textContent = "Too many attempts. Try again later.";
                break;

            default:
                message.textContent = error.message;

        }

    }

});

