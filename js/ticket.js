
// Get booking data

const booking =
JSON.parse(
localStorage.getItem("busgoBooking")
);



if(!booking){

alert("Ticket not found");

window.location.href="index.html";

}



// Display ticket data


document.getElementById("name")
.innerText =
booking.passengerName;



document.getElementById("phone")
.innerText =
booking.phone;



document.getElementById("route")
.innerText =
booking.route;



document.getElementById("bus")
.innerText =
booking.bus;



document.getElementById("seat")
.innerText =
booking.seat;



document.getElementById("amount")
.innerText =
booking.amount.toLocaleString();




// Generate QR Code


new QRCode(
document.getElementById("qrcode"),
{

text:

`
BusGo Ticket
Passenger: ${booking.passengerName}
Route: ${booking.route}
Seat: ${booking.seat}
Amount: ${booking.amount}
`,

width:150,

height:150

});
