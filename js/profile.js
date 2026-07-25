/* ==========================================
   BUSGO PROFILE JAVASCRIPT
========================================== */


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged,
updatePassword,
signOut

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc,
updateDoc

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// Elements

const nameInput =
document.querySelectorAll(".info input")[0];


const emailInput =
document.querySelectorAll(".info input")[1];


const phoneInput =
document.querySelectorAll(".info input")[2];


const locationInput =
document.querySelectorAll(".info input")[3];



const saveBtn =
document.querySelector(".save-btn");


const passwordBtn =
document.querySelector(".password-btn");


const logoutBtn =
document.getElementById("logoutBtn");






// ==========================================
// LOAD USER PROFILE
// ==========================================


onAuthStateChanged(auth, async(user)=>{


if(user){


const userRef =
doc(db,"users",user.uid);



const userSnap =
await getDoc(userRef);



if(userSnap.exists()){


const data =
userSnap.data();



nameInput.value =
data.name || "";



emailInput.value =
user.email;



phoneInput.value =
data.phone || "";



locationInput.value =
data.location || "";



document.querySelector(".profile-card h2")
.innerText =
data.name || "Customer";



document.querySelector(".email")
.innerText =
user.email;



}



}

else{


window.location.href="login.html";


}


});







// ==========================================
// UPDATE PROFILE
// ==========================================


saveBtn.addEventListener("click",async()=>{


const user =
auth.currentUser;



if(!user)return;



await updateDoc(

doc(db,"users",user.uid),

{


name:nameInput.value,

phone:phoneInput.value,

location:locationInput.value


}

);



alert("Profile updated successfully!");



});







// ==========================================
// CHANGE PASSWORD
// ==========================================


passwordBtn.addEventListener("click",async()=>{


const newPassword =
document.querySelectorAll(".info input")[5].value;



if(newPassword.length < 6){

alert("Password must be at least 6 characters");

return;

}



try{


await updatePassword(

auth.currentUser,

newPassword

);



alert("Password changed successfully");


}

catch(error){


alert(error.message);


}


});







// ==========================================
// LOGOUT
// ==========================================


logoutBtn.addEventListener("click",async()=>{


await signOut(auth);


window.location.href="login.html";


});

