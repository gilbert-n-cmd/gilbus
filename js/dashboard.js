/* ==========================================
   BUSGO CUSTOMER DASHBOARD
========================================== */


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged,
signOut

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import {

doc,
getDoc

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// Elements

const customerName =
document.getElementById("customerName");


const userName =
document.getElementById("userName");


const logoutBtn =
document.getElementById("logoutBtn");





// ==========================================
// CHECK LOGIN STATUS
// ==========================================


onAuthStateChanged(auth, async(user)=>{


if(user){



// Get user data from Firestore


const userRef =
doc(db,"users",user.uid);



const userSnap =
await getDoc(userRef);




if(userSnap.exists()){


const data =
userSnap.data();



const fullName =
data.firstName + " " + data.lastName;



customerName.innerText =
fullName;



userName.innerText =
"Welcome, " + fullName;



}



else{


customerName.innerText =
"Customer";


}



}

else{


// User not logged in

window.location.href =
"login.html";


}



});






// ==========================================
// LOGOUT
// ==========================================


if(logoutBtn){


logoutBtn.addEventListener("click",async()=>{


try{


await signOut(auth);



alert("Logged out successfully!");



window.location.href =
"login.html";



}

catch(error){


alert(error.message);


}



});


}

