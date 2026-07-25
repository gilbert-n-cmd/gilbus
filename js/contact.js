import { db } from "./firebase-config.js";


import {

collection,
addDoc,
serverTimestamp

} 
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// CONTACT FORM


const contactForm =
document.getElementById("contactForm");



if(contactForm){



contactForm.addEventListener("submit", async(e)=>{


e.preventDefault();





const name =
document.getElementById("name").value.trim();


const email =
document.getElementById("email").value.trim();


const subject =
document.getElementById("subject").value.trim();


const message =
document.getElementById("message").value.trim();






// VALIDATION


if(

name === "" ||
email === "" ||
subject === "" ||
message === ""

){


alert(
"Please fill all fields"
);


return;


}






// EMAIL CHECK


const emailPattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;



if(!emailPattern.test(email)){


alert(
"Enter a valid email address"
);


return;


}








// BUTTON LOADING


const button =
contactForm.querySelector("button");



button.disabled=true;


button.innerHTML=

`

<i class="fa-solid fa-spinner fa-spin"></i>

Sending...

`;









try{



// SAVE MESSAGE


await addDoc(

collection(db,"messages"),

{


name:name,

email:email,

subject:subject,

message:message,

status:"unread",

createdAt:serverTimestamp()


}

);






alert(

"Message sent successfully. We will reply soon."

);






contactForm.reset();




}

catch(error){



console.log(error);



alert(

"Failed to send message. Try again."

);



}






finally{


button.disabled=false;


button.innerHTML=

`

<i class="fa fa-paper-plane"></i>

Send Message

`;


}



});



}

