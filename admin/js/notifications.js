/* ==========================================
   BUSGO ADMIN - NOTIFICATIONS MANAGEMENT
========================================== */


import { db } from "./firebase-config.js";


import {

collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc,
serverTimestamp,
query,
orderBy

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// ===============================
// ELEMENTS
// ===============================


const notificationTable =
document.getElementById("notificationTable");



const searchNotification =
document.getElementById("searchNotification");



const filterType =
document.getElementById("filterType");



const filterStatus =
document.getElementById("filterStatus");



const notificationModal =
document.getElementById("notificationModal");



const addNotificationBtn =
document.getElementById("addNotificationBtn");



const cancelNotification =
document.getElementById("cancelNotification");



const notificationForm =
document.getElementById("notificationForm");






const totalNotifications =
document.getElementById("totalNotifications");



const readNotifications =
document.getElementById("readNotifications");



const unreadNotifications =
document.getElementById("unreadNotifications");



const importantNotifications =
document.getElementById("importantNotifications");







let notifications=[];







// ===============================
// LOAD NOTIFICATIONS
// ===============================


async function loadNotifications(){


try{


notifications=[];



const q = query(

collection(
db,
"notifications"
),

orderBy(
"createdAt",
"desc"
)

);




const snapshot =
await getDocs(q);




snapshot.forEach(item=>{


notifications.push({

id:item.id,

...item.data()

});


});






displayNotifications(notifications);


updateStatistics();



}


catch(error){


console.log(error);


alert(
"Failed to load notifications"
);


}


}








// ===============================
// DISPLAY NOTIFICATIONS
// ===============================


function displayNotifications(data){



notificationTable.innerHTML="";




if(data.length===0){


notificationTable.innerHTML=`

<tr>

<td colspan="7"
class="empty-message">

No notifications found.

</td>

</tr>

`;

return;

}







data.forEach(notification=>{



notificationTable.innerHTML +=`


<tr>



<td>

<div class="notification-icon">

<i class="fa-solid fa-bell"></i>

</div>

</td>





<td>

<strong>

${notification.title}

</strong>

</td>






<td>

${notification.message}

</td>






<td>

<span class="type-badge ${notification.type.toLowerCase()}">

${notification.type}

</span>

</td>






<td>

${notification.date || "-"}

</td>






<td>


<span class="status-badge 

${notification.status.toLowerCase()}">

${notification.status}

</span>


</td>






<td class="actions">



<button 

class="read-btn"

onclick="markRead('${notification.id}')">

<i class="fa-solid fa-check"></i>

</button>






<button

class="delete-btn"

onclick="deleteNotification('${notification.id}')">


<i class="fa-solid fa-trash"></i>


</button>



</td>



</tr>



`;



});


}









// ===============================
// STATISTICS
// ===============================


function updateStatistics(){



let read=0;

let unread=0;

let important=0;



notifications.forEach(item=>{



if(item.status==="Read")

read++;



else

unread++;




if(item.priority==="Important")

important++;



});






totalNotifications.textContent =
notifications.length;



readNotifications.textContent =
read;



unreadNotifications.textContent =
unread;



importantNotifications.textContent =
important;



}









// ===============================
// OPEN MODAL
// ===============================


addNotificationBtn.onclick=()=>{


notificationModal.classList.add("show");


};








cancelNotification.onclick=()=>{


notificationModal.classList.remove("show");


};









// ===============================
// SEND NOTIFICATION
// ===============================


notificationForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();




const notification={


title:
document.getElementById("notificationTitle").value,



message:
document.getElementById("notificationMessage").value,



type:
document.getElementById("notificationType").value,



priority:
document.getElementById("notificationPriority").value,



status:"Unread",



createdAt:
serverTimestamp(),



date:
new Date().toLocaleDateString()


};





await addDoc(

collection(
db,
"notifications"
),

notification

);





alert(
"Notification sent successfully"
);



notificationForm.reset();



notificationModal.classList.remove("show");



loadNotifications();



});









// ===============================
// MARK AS READ
// ===============================


window.markRead = async(id)=>{


await updateDoc(

doc(
db,
"notifications",
id
),

{

status:"Read"

}

);



loadNotifications();


};









// ===============================
// DELETE NOTIFICATION
// ===============================


window.deleteNotification = async(id)=>{



let confirmDelete =
confirm(
"Delete notification?"
);



if(confirmDelete){



await deleteDoc(

doc(
db,
"notifications",
id
)

);



loadNotifications();



}



};









// ===============================
// SEARCH
// ===============================


searchNotification.addEventListener(
"input",
()=>{


let value =
searchNotification.value.toLowerCase();



let result =
notifications.filter(item=>


item.title.toLowerCase()
.includes(value)


||

item.message.toLowerCase()
.includes(value)



);



displayNotifications(result);



});









// ===============================
// FILTERS
// ===============================


filterType.onchange =
applyFilters;



filterStatus.onchange =
applyFilters;






function applyFilters(){



let result=[...notifications];





if(filterType.value){


result =
result.filter(item=>

item.type === filterType.value

);


}







if(filterStatus.value){


result =
result.filter(item=>

item.status === filterStatus.value

);


}





displayNotifications(result);



}








// START

loadNotifications();

