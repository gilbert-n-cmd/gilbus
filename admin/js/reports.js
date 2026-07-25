/* ==========================================
   BUSGO ADMIN - REPORTS JAVASCRIPT
========================================== */


import { db } from "./firebase-config.js";


import {

collection,
getDocs

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// ===============================
// ELEMENTS
// ===============================


const totalTrips =
document.getElementById("totalTrips");


const totalRevenue =
document.getElementById("totalRevenue");


const totalRoutes =
document.getElementById("totalRoutes");


const totalBuses =
document.getElementById("totalBuses");



const revenueTable =
document.getElementById("revenueTable");



const routeReportTable =
document.getElementById("routeReportTable");



const busReportTable =
document.getElementById("busReportTable");



const fromDate =
document.getElementById("fromDate");


const toDate =
document.getElementById("toDate");


const filterReport =
document.getElementById("filterReport");


const exportReport =
document.getElementById("exportReport");






let bookings=[];

let payments=[];

let buses=[];

let routes=[];








// ===============================
// LOAD REPORT DATA
// ===============================


async function loadReports(){


try{


const bookingSnap =
await getDocs(
collection(db,"bookings")
);



bookings=[];


bookingSnap.forEach(item=>{


bookings.push({

id:item.id,

...item.data()

});


});







const paymentSnap =
await getDocs(
collection(db,"payments")
);



payments=[];


paymentSnap.forEach(item=>{


payments.push({

id:item.id,

...item.data()

});


});







const busSnap =
await getDocs(
collection(db,"buses")
);



buses=[];


busSnap.forEach(item=>{


buses.push({

id:item.id,

...item.data()

});


});







const routeSnap =
await getDocs(
collection(db,"routes")
);



routes=[];


routeSnap.forEach(item=>{


routes.push({

id:item.id,

...item.data()

});


});






generateReports();


}



catch(error){


console.log(error);


alert(
"Failed to load reports"
);


}



}









// ===============================
// GENERATE REPORTS
// ===============================


function generateReports(){



totalTrips.textContent =
bookings.length;



let revenue=0;



payments.forEach(payment=>{


if(payment.status==="Paid"){


revenue += Number(payment.amount || 0);


}


});





totalRevenue.textContent =

"UGX " + revenue.toLocaleString();





totalRoutes.textContent =
routes.length;





totalBuses.textContent =
buses.length;





generateRevenueTable();


generateRouteReport();


generateBusReport();



}









// ===============================
// REVENUE TABLE
// ===============================


function generateRevenueTable(){



revenueTable.innerHTML="";



let data={};



bookings.forEach(booking=>{


let date =
booking.travelDate || "Unknown";



if(!data[date]){


data[date]={

bookings:0,

revenue:0

};


}



data[date].bookings++;


data[date].revenue +=

Number(
booking.amount || 0
);



});






Object.keys(data)
.forEach(date=>{



revenueTable.innerHTML += `


<tr>


<td>

${date}

</td>



<td>

${data[date].bookings}

</td>



<td class="revenue">

UGX ${data[date].revenue.toLocaleString()}

</td>




<td>

<span class="report-status completed">

Completed

</span>


</td>


</tr>



`;



});


}









// ===============================
// POPULAR ROUTES
// ===============================


function generateRouteReport(){



routeReportTable.innerHTML="";



let routeData={};



bookings.forEach(booking=>{


let route =
booking.route || "Unknown";



if(!routeData[route]){


routeData[route]={

bookings:0,

revenue:0

};


}




routeData[route].bookings++;



routeData[route].revenue +=

Number(
booking.amount || 0
);



});






Object.keys(routeData)
.forEach(route=>{


routeReportTable.innerHTML +=`


<tr>


<td>

${route}

</td>



<td>

${routeData[route].bookings}

</td>



<td>

${routeData[route].bookings}

</td>



<td class="revenue">

UGX ${routeData[route].revenue.toLocaleString()}

</td>



</tr>



`;


});



}









// ===============================
// BUS PERFORMANCE
// ===============================


function generateBusReport(){



busReportTable.innerHTML="";



let busData={};



bookings.forEach(booking=>{


let bus =
booking.bus || "Unknown";



if(!busData[bus]){


busData[bus]={

trips:0,

revenue:0

};


}



busData[bus].trips++;



busData[bus].revenue +=

Number(
booking.amount || 0
);



});






Object.keys(busData)
.forEach(bus=>{


busReportTable.innerHTML +=`


<tr>


<td>

${bus}

</td>



<td>

${busData[bus].trips}

</td>



<td>

${busData[bus].trips}

</td>



<td class="revenue">

UGX ${busData[bus].revenue.toLocaleString()}

</td>



</tr>


`;



});


}









// ===============================
// DATE FILTER
// ===============================


filterReport.onclick=()=>{


let from =
fromDate.value;


let to =
toDate.value;



if(!from || !to){


generateReports();

return;


}




bookings =
bookings.filter(booking=>{


return (

booking.travelDate >= from &&

booking.travelDate <= to

);


});




generateReports();



};









// ===============================
// EXPORT CSV
// ===============================


exportReport.onclick=()=>{



let csv =

"Route,Bus,Date,Seat,Amount,Status\n";




bookings.forEach(booking=>{


csv +=

`${booking.route},${booking.bus},${booking.travelDate},${booking.seat},${booking.amount},${booking.status}\n`;


});






let blob =

new Blob(
[csv],
{
type:"text/csv"
}

);



let url =
URL.createObjectURL(blob);



let link =
document.createElement("a");



link.href=url;


link.download="BusGo_Report.csv";


link.click();



};







// START

loadReports();

