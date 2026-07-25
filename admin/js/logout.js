import {

getAuth,
signOut

}
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const auth=getAuth();


document
.getElementById("logoutBtn")
.onclick=async()=>{


await signOut(auth);


window.location.href="login.html";


};

// ===============================
// MOBILE SIDEBAR MENU
// ===============================


const menuBtn = document.getElementById("menuBtn");

const closeMenu = document.getElementById("closeMenu");

const sidebar = document.querySelector(".sidebar");

const overlay = document.getElementById("overlay");



if(menuBtn){

menuBtn.addEventListener("click",()=>{

    sidebar.classList.add("active");

    if(overlay){
        overlay.classList.add("active");
    }

});

}



if(closeMenu){

closeMenu.addEventListener("click",()=>{

    sidebar.classList.remove("active");

    if(overlay){
        overlay.classList.remove("active");
    }

});

}



if(overlay){

overlay.addEventListener("click",()=>{

    sidebar.classList.remove("active");

    overlay.classList.remove("active");

});

}