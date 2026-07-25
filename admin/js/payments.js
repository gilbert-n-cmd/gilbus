/* ==========================================
   BUSGO ADMIN - PAYMENTS MANAGEMENT
========================================== */


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
doc,
updateDoc,
query,
orderBy

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===============================
// ELEMENTS
// ===============================


const paymentTable =
document.getElementById("paymentTable");



const searchPayment =
document.getElementById("searchPayment");



const filterMethod =
document.getElementById("filterMethod");



const filterPaymentStatus =
document.getElementById("filterPaymentStatus");





const totalRevenue =
document.getElementById("totalRevenue");



const paidPayments =
document.getElementById("paidPayments");



const pendingPayments =
document.getElementById("pendingPayments");



const failedPayments =
document.getElementById("failedPayments");






// MODAL


const paymentModal =
document.getElementById("paymentModal");



const closePayment =
document.getElementById("closePayment");



const markPaid =
document.getElementById("markPaid");



const markFailed =
document.getElementById("markFailed");





// DETAILS


const transactionId =
document.getElementById("transactionId");


const customerName =
document.getElementById("customerName");


const bookingId =
document.getElementById("bookingId");


const paymentAmount =
document.getElementById("paymentAmount");


const paymentMethod =
document.getElementById("paymentMethod");


const paymentDate =
document.getElementById("paymentDate");


const paymentStatus =
document.getElementById("paymentStatus");





let payments=[];


let selectedPayment=null;







// ===============================
// LOAD PAYMENTS
// ===============================


async function loadPayments(){


try{


payments=[];



const q =
query(

collection(
db,
"payments"
),

orderBy(
"createdAt",
"desc"
)

);



const snapshot =
await getDocs(q);





snapshot.forEach(item=>{


payments.push({

id:item.id,

...item.data()

});


});





displayPayments(payments);


updateStatistics();



}

catch(error){


console.log(error);


alert(
"Failed to load payments"
);


}



}









// ===============================
// DISPLAY PAYMENTS
// ===============================


function displayPayments(data){



paymentTable.innerHTML="";




if(data.length===0){


paymentTable.innerHTML=`

<tr>

<td colspan="8"
class="empty-message">

No payments found.

</td>

</tr>

`;


return;

}







data.forEach(payment=>{



paymentTable.innerHTML +=`



<tr>


<td>

${payment.transactionId || payment.id}

</td>




<td>

${payment.customerName || "-"}

</td>





<td>

${payment.bookingId || "-"}

</td>





<td>

UGX ${payment.amount || 0}

</td>





<td>

<span class="method">

${payment.method || "-"}

</span>

</td>





<td>

${payment.date || "-"}

</td>





<td>


<span class="payment-status 

${

(payment.status || "Pending")
.toLowerCase()

}">


${payment.status || "Pending"}


</span>


</td>





<td class="actions">



<button

class="view-btn"

onclick="viewPayment('${payment.id}')">

<i class="fa-solid fa-eye"></i>

</button>





</td>


</tr>



`;



});



}









// ===============================
// VIEW PAYMENT
// ===============================


window.viewPayment=function(id){



const payment =
payments.find(
p=>p.id===id
);



selectedPayment=id;



transactionId.textContent =
payment.transactionId || id;



customerName.textContent =
payment.customerName || "-";



bookingId.textContent =
payment.bookingId || "-";



paymentAmount.textContent =
"UGX " + payment.amount;



paymentMethod.textContent =
payment.method;



paymentDate.textContent =
payment.date;



paymentStatus.textContent =
payment.status;



paymentModal.classList.add("show");



};










// ===============================
// UPDATE STATUS
// ===============================



markPaid.onclick=async()=>{


if(!selectedPayment)

return;



await updateDoc(

doc(
db,
"payments",
selectedPayment
),

{

status:"Paid"

}

);



alert(
"Payment marked as Paid"
);



paymentModal.classList.remove("show");


loadPayments();


};







markFailed.onclick=async()=>{


if(!selectedPayment)

return;



await updateDoc(

doc(
db,
"payments",
selectedPayment
),

{

status:"Failed"

}

);



alert(
"Payment marked as Failed"
);



paymentModal.classList.remove("show");


loadPayments();


};









// ===============================
// STATISTICS
// ===============================


function updateStatistics(){



let revenue=0;


let paid=0;


let pending=0;


let failed=0;





payments.forEach(payment=>{


let amount =
Number(payment.amount || 0);



if(payment.status==="Paid"){


revenue += amount;

paid++;


}



if(payment.status==="Pending"){


pending++;

}



if(payment.status==="Failed"){


failed++;

}



});






totalRevenue.textContent =

"UGX " + revenue.toLocaleString();



paidPayments.textContent =
paid;



pendingPayments.textContent =
pending;



failedPayments.textContent =
failed;



}









// ===============================
// SEARCH
// ===============================


searchPayment.addEventListener(
"input",
()=>{


let value =
searchPayment.value.toLowerCase();



let result =
payments.filter(payment=>


(payment.customerName || "")
.toLowerCase()
.includes(value)


||


(payment.transactionId || "")
.toLowerCase()
.includes(value)


||


(payment.bookingId || "")
.toLowerCase()
.includes(value)



);



displayPayments(result);



});









// ===============================
// FILTERS
// ===============================


filterMethod.onchange =
applyFilters;


filterPaymentStatus.onchange =
applyFilters;





function applyFilters(){



let result=[...payments];





if(filterMethod.value){


result=result.filter(payment=>

payment.method === filterMethod.value

);


}





if(filterPaymentStatus.value){


result=result.filter(payment=>

payment.status === filterPaymentStatus.value

);


}




displayPayments(result);



}








// ===============================
// CLOSE MODAL
// ===============================


closePayment.onclick=()=>{


paymentModal.classList.remove("show");


};







// INITIAL LOAD


loadPayments();

