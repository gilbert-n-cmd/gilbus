/* ==========================================
   BUSGO - MY BOOKINGS JAVASCRIPT
========================================== */


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
updateDoc,
orderBy

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ================================
// ELEMENT
// ================================


const bookingList =
document.querySelector(".booking-list");






// ================================
// CHECK LOGIN
// ================================


onAuthStateChanged(auth, async(user)=>{


if(!user){


window.location.href="login.html";

return;

}



loadBookings(user.uid);



});








// ================================
// LOAD USER BOOKINGS
// ================================


async function loadBookings(uid){


try{



const q = query(


collection(
db,
"bookings"
),


where(
"userId",
"==",
uid
),


orderBy(
"createdAt",
"desc"
)


);




const snapshot =
await getDocs(q);




bookingList.innerHTML="";





if(snapshot.empty){


bookingList.innerHTML=`

<div class="empty">


<h3>
No bookings found
</h3>


<p>
Start your journey by booking a bus.
</p>


</div>

`;


return;


}







snapshot.forEach((item)=>{


const booking =
item.data();



const card =
document.createElement("div");



card.className =
"booking-card";





card.innerHTML = `



<div class="booking-icon">

<i class="fa-solid fa-bus"></i>

</div>





<div class="details">


<h3>

${booking.route || "Unknown Route"}

</h3>




<p>

Bus:

<strong>

${booking.bus || "-"}

</strong>

</p>





<p>

Travel Date:

${booking.travelDate || "-"}

</p>





<p>

Seat:

<strong>

${booking.seat || "-"}

</strong>

</p>





<p>

Amount:

<strong>

UGX ${booking.amount || 0}

</strong>

</p>





<p>

Payment:

<span class="${

(booking.paymentStatus || "Pending")
.toLowerCase()

}">


${booking.paymentStatus || "Pending"}


</span>


</p>







<p>

Status:

<span class="${

(booking.status || "Pending")
.toLowerCase()

}">


${booking.status || "Pending"}


</span>


</p>




</div>






<div class="actions">





<a href="ticket.html?id=${item.id}">


<i class="fa-solid fa-ticket"></i>

View Ticket


</a>





${
booking.status !== "Cancelled"

?

`

<button

class="cancel-btn"

data-id="${item.id}">

Cancel

</button>

`

:

`

<button disabled>

Cancelled

</button>

`

}




</div>


`;





bookingList.appendChild(card);



});






// Add cancel events


document
.querySelectorAll(".cancel-btn")
.forEach(button=>{


button.addEventListener(
"click",
async()=>{


const bookingId =
button.dataset.id;



const confirmCancel =
confirm(
"Are you sure you want to cancel this booking?"
);



if(!confirmCancel)

return;





try{



await updateDoc(

doc(
db,
"bookings",
bookingId
),

{


status:"Cancelled"


}


);




alert(
"Booking cancelled successfully"
);



loadBookings(uid);



}

catch(error){


console.log(error);


alert(
"Failed to cancel booking"
);



}



});


});






}

catch(error){


console.log(error);


bookingList.innerHTML=`

<div class="empty">


<h3>
Error loading bookings
</h3>


<p>
Please try again later.
</p>


</div>

`;



}



}