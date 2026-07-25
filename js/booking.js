/* ==========================================
   BUSGO BOOKING SYSTEM
========================================== */


// Ticket price

const ticketPrice = 50000;



// Seat buttons

const seats =
document.querySelectorAll(".seat:not(.booked)");



const selectedSeatDisplay =
document.getElementById("selectedSeat");


const totalPriceDisplay =
document.getElementById("totalPrice");


const paymentBtn =
document.getElementById("paymentBtn");



let selectedSeat = null;





// ==========================================
// SEAT SELECTION
// ==========================================


seats.forEach(seat=>{


seat.addEventListener("click",()=>{


// Remove previous selection

seats.forEach(item=>{

item.classList.remove("selected");

});




// Select new seat

seat.classList.add("selected");



selectedSeat = seat.innerText;



selectedSeatDisplay.innerText =
selectedSeat;



totalPriceDisplay.innerText =
ticketPrice.toLocaleString();



});



});







// ==========================================
// CONTINUE TO PAYMENT
// ==========================================


paymentBtn.addEventListener("click",()=>{


const name =
document.getElementById("name").value.trim();


const phone =
document.getElementById("phone").value.trim();


const email =
document.getElementById("email").value.trim();





if(name==="" || phone==="" || email===""){


alert("Please fill passenger details.");

return;


}




if(selectedSeat===null){


alert("Please select a seat.");

return;


}





// Save booking information


const booking = {


passengerName:name,

phone:phone,

email:email,

route:"Arua - Kampala",

bus:"Link Bus",

seat:selectedSeat,

amount:ticketPrice,

status:"Pending Payment"


};




// Save temporary booking

localStorage.setItem(

"busgoBooking",

JSON.stringify(booking)

);





// Go to payment page

window.location.href="payment.html";



});

