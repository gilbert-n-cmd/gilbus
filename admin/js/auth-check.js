import {

getAuth,
onAuthStateChanged

}
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

getFirestore,
doc,
getDoc

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const auth = getAuth();

const db = getFirestore();



onAuthStateChanged(auth,async(user)=>{


if(!user){


window.location.href="login.html";


return;


}



const userDoc =
await getDoc(
doc(db,"users",user.uid)
);



if(!userDoc.exists()
||
userDoc.data().role !== "admin"){



alert("Access denied");


window.location.href="login.html";


return;


}



document.getElementById("adminName")
.innerText =
userDoc.data().name;


});

