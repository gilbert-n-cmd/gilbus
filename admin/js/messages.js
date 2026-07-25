/* ==========================================
   BUSGO ADMIN - MESSAGES MANAGEMENT
========================================== */


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
addDoc,
doc,
updateDoc,
deleteDoc,
query,
orderBy,
serverTimestamp

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===============================
// ELEMENTS
// ===============================


const messageTable =
document.getElementById("messageTable");



const searchMessage =
document.getElementById("searchMessage");



const filterMessageStatus =
document.getElementById("filterMessageStatus");



const filterPriority =
document.getElementById("filterPriority");




const totalMessages =
document.getElementById("totalMessages");



const unreadMessages =
document.getElementById("unreadMessages");



const repliedMessages =
document.getElementById("repliedMessages");



const urgentMessages =
document.getElementById("urgentMessages");





const messageModal =
document.getElementById("messageModal");



const closeMessage =
document.getElementById("closeMessage");



const sendReply =
document.getElementById("sendReply");



const deleteMessageBtn =
document.getElementById("deleteMessage");





const viewCustomer =
document.getElementById("viewCustomer");



const viewEmail =
document.getElementById("viewEmail");



const viewSubject =
document.getElementById("viewSubject");



const viewMessage =
document.getElementById("viewMessage");



const replyMessage =
document.getElementById("replyMessage");








let messages=[];

let selectedMessage=null;








// ===============================
// LOAD MESSAGES
// ===============================


async function loadMessages(){


try{


messages=[];



const q =
query(

collection(
db,
"messages"
),

orderBy(
"createdAt",
"desc"
)

);





const snapshot =
await getDocs(q);





snapshot.forEach(item=>{


messages.push({

id:item.id,

...item.data()

});


});





displayMessages(messages);


updateStats();



}

catch(error){


console.log(error);


alert(
"Failed to load messages"
);


}



}









// ===============================
// DISPLAY MESSAGES
// ===============================


function displayMessages(data){


messageTable.innerHTML="";



if(data.length===0){


messageTable.innerHTML=`

<tr>

<td colspan="7"
class="empty-message">

No messages found

</td>

</tr>

`;

return;

}





data.forEach(msg=>{


messageTable.innerHTML +=`


<tr>


<td>

${msg.customer || "Customer"}

</td>



<td>

${msg.email || "-"}

</td>




<td>

${msg.subject}

</td>




<td>

${msg.message.substring(0,40)}...

</td>




<td>

${msg.date || "-"}

</td>





<td>


<span class="status-badge ${msg.status.toLowerCase()}">

${msg.status}

</span>


</td>





<td class="actions">


<button 
class="view-btn"
onclick="viewMessageData('${msg.id}')">

<i class="fa-solid fa-eye"></i>

</button>



</td>


</tr>


`;



});


}









// ===============================
// STATISTICS
// ===============================


function updateStats(){


let unread=0;

let replied=0;

let urgent=0;




messages.forEach(msg=>{


if(msg.status==="Unread")

unread++;




if(msg.status==="Replied")

replied++;




if(msg.priority==="Urgent")

urgent++;


});





totalMessages.textContent =
messages.length;



unreadMessages.textContent =
unread;



repliedMessages.textContent =
replied;



urgentMessages.textContent =
urgent;



}









// ===============================
// VIEW MESSAGE
// ===============================


window.viewMessageData = (id)=>{


selectedMessage =
messages.find(
item=>item.id===id
);



if(!selectedMessage)
return;





viewCustomer.textContent =
selectedMessage.customer;



viewEmail.textContent =
selectedMessage.email;



viewSubject.textContent =
selectedMessage.subject;



viewMessage.textContent =
selectedMessage.message;




replyMessage.value="";



messageModal.classList.add("show");




};









// ===============================
// CLOSE MODAL
// ===============================


closeMessage.onclick=()=>{


messageModal.classList.remove("show");


};









// ===============================
// MARK AS READ
// ===============================


async function markRead(id){


await updateDoc(

doc(
db,
"messages",
id
),

{

status:"Read"

}

);


loadMessages();


}









// ===============================
// SEND REPLY
// ===============================


sendReply.onclick = async()=>{


if(!selectedMessage)
return;



const reply =
replyMessage.value.trim();




if(reply===""){


alert(
"Write a reply first"
);


return;

}




await addDoc(

collection(
db,
"messageReplies"
),

{

messageId:selectedMessage.id,

customer:selectedMessage.customer,

reply:reply,

createdAt:
serverTimestamp()


}

);





await updateDoc(

doc(
db,
"messages",
selectedMessage.id
),

{

status:"Replied"

}

);





alert(
"Reply sent successfully"
);



messageModal.classList.remove("show");



loadMessages();



};









// ===============================
// DELETE MESSAGE
// ===============================


deleteMessageBtn.onclick =
async()=>{


if(!selectedMessage)
return;



let confirmDelete =
confirm(
"Delete this message?"
);



if(confirmDelete){


await deleteDoc(

doc(
db,
"messages",
selectedMessage.id
)

);



messageModal.classList.remove("show");


loadMessages();


}



};









// ===============================
// SEARCH
// ===============================


searchMessage.oninput=()=>{


let value =
searchMessage.value.toLowerCase();



let result =
messages.filter(msg=>


msg.customer
.toLowerCase()
.includes(value)


||

msg.subject
.toLowerCase()
.includes(value)


);



displayMessages(result);



};









// ===============================
// FILTERS
// ===============================


filterMessageStatus.onchange =
applyFilters;



filterPriority.onchange =
applyFilters;





function applyFilters(){


let result=[...messages];




if(filterMessageStatus.value){


result =
result.filter(msg=>

msg.status === filterMessageStatus.value

);


}






if(filterPriority.value){


result =
result.filter(msg=>

msg.priority === filterPriority.value

);


}





displayMessages(result);


}









// START

loadMessages();

