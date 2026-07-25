import { } from "./firebase-config.js";



// Get booking information

const booking = 
JSON.parse(
localStorage.getItem("busgoBooking")
);



if(!booking){

alert("No booking found");

window.location.href="buses.html";

}





// Display booking details


document.getElementById("passengerName")
.innerText = booking.passengerName;


document.getElementById("route")
.innerText = booking.route;


document.getElementById("bus")
.innerText = booking.bus;


document.getElementById("seat")
.innerText = booking.seat;


document.getElementById("amount")
.innerText =
booking.amount.toLocaleString();





// Payment button


const payBtn =
document.getElementById("payBtn");



payBtn.addEventListener("click",()=>{


const phone =
document.getElementById("paymentPhone")
.value.trim();



if(phone===""){

alert("Enter payment phone number");

return;

}




payBtn.disabled=true;


payBtn.innerHTML=

'<i class="fa fa-spinner fa-spin"></i> Processing...';





setTimeout(()=>{


booking.paymentStatus="Paid";


booking.paymentMethod =
document.querySelector(
'input[name="payment"]:checked'
).value;



localStorage.setItem(

"busgoBooking",

JSON.stringify(booking)

);




alert("Payment successful!");



window.location.href="ticket.html";



},2000);



});

