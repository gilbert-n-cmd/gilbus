import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged

} 
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
query,
where,
getDocs,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const notificationList =
document.getElementById("notificationList");


const markAll =
document.getElementById("markAll");







// ==========================================
// CHECK LOGIN
// ==========================================


onAuthStateChanged(auth, async(user)=>{


if(!user){


window.location.href="login.html";


return;


}



loadNotifications(user.uid);



});







// ==========================================
// LOAD NOTIFICATIONS
// ==========================================


async function loadNotifications(uid){


try{


const q = query(

collection(db,"notifications"),

where("userId","==",uid)

);




const snapshot =
await getDocs(q);




notificationList.innerHTML="";




if(snapshot.empty){


notificationList.innerHTML=`

<div class="notification-card">

<i class="fa fa-bell"></i>


<div class="notification-content">

<h3>
No Notifications
</h3>


<p>
You don't have any notifications yet.
</p>


</div>


</div>

`;

return;


}





snapshot.forEach((item)=>{


const data =
item.data();



let statusClass =
data.read ? "read" : "unread";




notificationList.innerHTML += `


<div class="notification-card ${statusClass}"

data-id="${item.id}">


<i class="fa ${getIcon(data.type)}"></i>



<div class="notification-content">


<h3>

${data.title}

</h3>



<p>

${data.message}

</p>



<span class="notification-time">

${data.date || "Today"}

</span>



</div>



</div>



`;




});





}

catch(error){


console.log(error);


notificationList.innerHTML=

`

<p>
Failed to load notifications
</p>

`;

}



}








// ==========================================
// ICON SELECTOR
// ==========================================


function getIcon(type){


if(type==="payment"){

return "fa-credit-card";

}


if(type==="booking"){

return "fa-ticket";

}



if(type==="trip"){

return "fa-bus";

}



return "fa-bell";


}








// ==========================================
// MARK ALL READ
// ==========================================


markAll.addEventListener("click",async()=>{


const user =
auth.currentUser;



if(!user)return;




const q = query(

collection(db,"notifications"),

where("userId","==",user.uid)

);



const snapshot =
await getDocs(q);




snapshot.forEach(async(item)=>{


await updateDoc(

doc(db,"notifications",item.id),

{


read:true


}

);


});





alert(
"All notifications marked as read"
);



location.reload();



});

