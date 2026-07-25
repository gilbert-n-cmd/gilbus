// ===================================
// BUSGO ADMIN - BOOKINGS MANAGEMENT
// FIREBASE
// ===================================


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
doc,
updateDoc,
getDoc,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ===============================
// ELEMENTS
// ===============================


const bookingTable =
document.getElementById("bookingTable");


const searchBooking =
document.getElementById("searchBooking");


const filterRoute =
document.getElementById("filterRoute");


const filterPayment =
document.getElementById("filterPayment");


const filterStatus =
document.getElementById("filterStatus");



const bookingModal =
document.getElementById("bookingModal");



const closeBooking =
document.getElementById("closeBooking");


const confirmBooking =
document.getElementById("confirmBooking");


const cancelBooking =
document.getElementById("cancelBooking");





// DETAILS


const ticketId =
document.getElementById("ticketId");


const passengerName =
document.getElementById("passengerName");


const passengerPhone =
document.getElementById("passengerPhone");


const bookingRoute =
document.getElementById("bookingRoute");


const travelDate =
document.getElementById("travelDate");


const seatNumber =
document.getElementById("seatNumber");


const bookingAmount =
document.getElementById("bookingAmount");


const paymentStatus =
document.getElementById("paymentStatus");


const bookingStatus =
document.getElementById("bookingStatus");





let bookings=[];

let selectedBooking=null;





// ===============================
// LOAD BOOKINGS
// ===============================


async function loadBookings(){


bookings=[];


const q=query(

collection(db,"bookings"),

orderBy(
"createdAt",
"desc"
)

);



const snapshot =
await getDocs(q);



snapshot.forEach((doc)=>{


bookings.push({

id:doc.id,

...doc.data()

});


});



displayBookings(bookings);


updateStatistics();


loadRoutes();



}







// ===============================
// DISPLAY BOOKINGS
// ===============================


function displayBookings(data){



bookingTable.innerHTML="";



if(data.length===0){


bookingTable.innerHTML=`

<tr>

<td colspan="10"
class="empty-message">

No bookings found.

</td>

</tr>

`;

return;


}






data.forEach(booking=>{


bookingTable.innerHTML += `



<tr>


<td>

${booking.ticketId || booking.id}

</td>



<td>

${booking.passengerName || "-"} 

</td>



<td>

${booking.phone || "-"}

</td>



<td>

${booking.route || "-"}

</td>



<td>

${booking.travelDate || "-"}

</td>



<td>

${booking.seat || "-"}

</td>



<td>

UGX ${booking.amount || 0}

</td>




<td>


<span class="payment-${

(booking.paymentStatus || "")
.toLowerCase()

}">

${booking.paymentStatus || "Pending"}

</span>


</td>





<td>


<span class="status ${

(booking.status || "pending")
.toLowerCase()

}">

${booking.status || "Pending"}

</span>


</td>





<td class="actions">



<button class="view-btn"

onclick="viewBooking('${booking.id}')">

<i class="fa-solid fa-eye"></i>

</button>



<button class="confirm-btn"

onclick="confirmBookingAdmin('${booking.id}')">

<i class="fa-solid fa-check"></i>

</button>



<button class="cancel-btn"

onclick="cancelBookingAdmin('${booking.id}')">

<i class="fa-solid fa-xmark"></i>

</button>


</td>


</tr>



`;



});



}








// ===============================
// VIEW BOOKING
// ===============================


window.viewBooking =
function(id){


const booking =
bookings.find(
(b)=>b.id===id
);



selectedBooking=id;



ticketId.innerHTML =
booking.ticketId || id;


passengerName.innerHTML =
booking.passengerName || "-";


passengerPhone.innerHTML =
booking.phone || "-";


bookingRoute.innerHTML =
booking.route || "-";


travelDate.innerHTML =
booking.travelDate || "-";


seatNumber.innerHTML =
booking.seat || "-";


bookingAmount.innerHTML =
"UGX "+booking.amount;


paymentStatus.innerHTML =
booking.paymentStatus;


bookingStatus.innerHTML =
booking.status;



bookingModal.classList.add("show");



};







// ===============================
// CONFIRM BOOKING
// ===============================


window.confirmBookingAdmin =
async function(id){



await updateDoc(

doc(db,"bookings",id),

{

status:"Confirmed"

}

);



alert(
"Booking confirmed"
);



loadBookings();



};








// ===============================
// CANCEL BOOKING
// ===============================


window.cancelBookingAdmin =
async function(id){



await updateDoc(

doc(db,"bookings",id),

{

status:"Cancelled"

}

);



alert(
"Booking cancelled"
);



loadBookings();



};








// ===============================
// SEARCH
// ===============================


searchBooking.addEventListener(
"input",
()=>{


let value =
searchBooking.value.toLowerCase();



let result =
bookings.filter(b=>


(b.passengerName || "")
.toLowerCase()
.includes(value)


||


(b.route || "")
.toLowerCase()
.includes(value)


||


(b.ticketId || "")
.toLowerCase()
.includes(value)



);



displayBookings(result);



});








// ===============================
// FILTERS
// ===============================


filterRoute.addEventListener(
"change",
applyFilters
);


filterPayment.addEventListener(
"change",
applyFilters
);


filterStatus.addEventListener(
"change",
applyFilters
);




function applyFilters(){



let result=[...bookings];



if(filterRoute.value){


result=result.filter(b=>

b.route===filterRoute.value

);


}



if(filterPayment.value){


result=result.filter(b=>

b.paymentStatus===filterPayment.value

);


}



if(filterStatus.value){


result=result.filter(b=>

b.status===filterStatus.value

);


}



displayBookings(result);



}







// ===============================
// ROUTES FILTER
// ===============================


function loadRoutes(){


filterRoute.innerHTML=

`

<option value="">

All Routes

</option>

`;



let routes=[];



bookings.forEach(b=>{


if(
b.route &&
!routes.includes(b.route)
){

routes.push(b.route);

}


});



routes.forEach(route=>{


filterRoute.innerHTML +=`

<option value="${route}">

${route}

</option>

`;


});


}







// ===============================
// STATISTICS
// ===============================


function updateStatistics(){



document.getElementById(
"totalBookings"
).innerHTML =
bookings.length;



document.getElementById(
"confirmedBookings"
).innerHTML =

bookings.filter(b=>

b.status==="Confirmed"

).length;




document.getElementById(
"pendingBookings"
).innerHTML =

bookings.filter(b=>

b.status==="Pending"

).length;




document.getElementById(
"cancelledBookings"
).innerHTML =

bookings.filter(b=>

b.status==="Cancelled"

).length;



}








// ===============================
// CLOSE MODAL
// ===============================


closeBooking.onclick=()=>{


bookingModal.classList.remove("show");


};





// INITIAL LOAD

loadBookings();

