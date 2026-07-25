/* ==========================================
   BUSGO REGISTER WITH FIREBASE
========================================== */


import { auth, db } from "./firebase-config.js";


import {
createUserWithEmailAndPassword
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
doc,
setDoc,
serverTimestamp
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// Password Fields

const password =
document.getElementById("password");


const confirmPassword =
document.getElementById("confirmPassword");


const togglePassword =
document.querySelector(".toggle-password");





// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================


if(togglePassword){

togglePassword.addEventListener("click",()=>{


if(password.type === "password"){


password.type="text";


togglePassword.classList.remove("fa-eye");

togglePassword.classList.add("fa-eye-slash");


}

else{


password.type="password";


togglePassword.classList.remove("fa-eye-slash");

togglePassword.classList.add("fa-eye");


}


});


}






// ==========================================
// REGISTER USER
// ==========================================


const registerForm =
document.getElementById("registerForm");



if(registerForm){


registerForm.addEventListener("submit",async(e)=>{


e.preventDefault();



const firstName =
document.getElementById("firstName").value.trim();


const lastName =
document.getElementById("lastName").value.trim();


const email =
document.getElementById("email").value.trim();


const phone =
document.getElementById("phone").value.trim();


const pass =
password.value.trim();


const confirm =
confirmPassword.value.trim();


const terms =
document.getElementById("terms");





// Validation


if(
firstName==="" ||
lastName==="" ||
email==="" ||
phone==="" ||
pass==="" ||
confirm===""
){

alert("Please complete all fields.");

return;

}




if(pass.length < 6){

alert("Password must be at least 6 characters.");

return;

}




if(pass !== confirm){

alert("Passwords do not match.");

return;

}




if(!terms.checked){

alert("Please accept Terms & Conditions.");

return;

}






const btn =
document.querySelector(".register-btn");



btn.disabled=true;


btn.innerHTML=
'<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';





try{


// Create Firebase Authentication Account


const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
pass
);



const user =
userCredential.user;





// Save user details to Firestore


await setDoc(
doc(db,"users",user.uid),
{


firstName:firstName,

lastName:lastName,

email:email,

phone:phone,


role:"customer",


createdAt:serverTimestamp()


}

);





alert("Account created successfully!");



window.location.href="login.html";



}

catch(error){


console.log(error);



btn.disabled=false;


btn.innerHTML=
'<i class="fa-solid fa-user-plus"></i> Create Account';



if(error.code==="auth/email-already-in-use"){


alert("This email is already registered.");


}

else if(error.code==="auth/weak-password"){


alert("Password is too weak.");


}

else{


alert(error.message);


}



}



});


}