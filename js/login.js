/* ==========================================
   BUSGO LOGIN WITH FIREBASE
========================================== */


import { auth } from "./firebase-config.js";


import {
signInWithEmailAndPassword
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// Password Field

const password =
document.getElementById("password");


const togglePassword =
document.querySelector(".toggle-password");




// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================


if(togglePassword){


togglePassword.addEventListener("click",()=>{


if(password.type==="password"){


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
// LOGIN USER
// ==========================================


const loginForm =
document.getElementById("loginForm");



if(loginForm){


loginForm.addEventListener("submit",async(e)=>{


e.preventDefault();




const email =
document.getElementById("email").value.trim();



const pass =
password.value.trim();





if(email==="" || pass===""){


alert("Please enter email and password.");

return;


}




const loginBtn =
document.querySelector(".login-btn");



loginBtn.disabled=true;


loginBtn.innerHTML =
'<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';






try{


// Firebase Login

await signInWithEmailAndPassword(
auth,
email,
pass
);




alert("Login successful!");




// Redirect to user dashboard

window.location.href="dashboard.html";





}

catch(error){



console.log(error);



loginBtn.disabled=false;


loginBtn.innerHTML =
'<i class="fa-solid fa-right-to-bracket"></i> Login';




if(error.code==="auth/invalid-credential"){


alert("Invalid email or password.");


}

else if(error.code==="auth/user-not-found"){


alert("Account not found.");


}

else{


alert(error.message);


}



}



});


}