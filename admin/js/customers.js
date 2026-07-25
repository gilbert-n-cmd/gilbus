// ===================================
// BUSGO ADMIN - CUSTOMERS.JS
// FIREBASE CUSTOMERS MANAGEMENT
// ===================================


import { db, storage } from "./firebase-config.js";


import {

collection,
addDoc,
doc,
deleteDoc,
updateDoc,
getDoc,
onSnapshot,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

ref,
uploadBytes,
getDownloadURL

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";




// ============================
// ELEMENTS
// ============================


const customerTable =
document.getElementById("customerTable");


const customerModal =
document.getElementById("customerModal");


const customerForm =
document.getElementById("customerForm");


const addCustomerBtn =
document.getElementById("addCustomerBtn");


const cancelCustomer =
document.getElementById("cancelCustomer");


const searchCustomer =
document.getElementById("searchCustomer");


const filterStatus =
document.getElementById("filterStatus");



let customers=[];

let editId=null;





// ============================
// OPEN MODAL
// ============================


addCustomerBtn.onclick=()=>{


customerModal.classList.add("show");

customerForm.reset();

editId=null;


};





// CLOSE MODAL


cancelCustomer.onclick=()=>{


customerModal.classList.remove("show");


};







// ============================
// LOAD CUSTOMERS
// ============================


onSnapshot(

collection(db,"customers"),

(snapshot)=>{


customers=[];


snapshot.forEach((item)=>{


customers.push({

id:item.id,

...item.data()

});


});



displayCustomers(customers);

updateStatistics(customers);


}

);







// ============================
// DISPLAY CUSTOMERS
// ============================


function displayCustomers(data){


customerTable.innerHTML="";



if(data.length===0){


customerTable.innerHTML=`

<tr>

<td colspan="9">

No customers found.

</td>

</tr>

`;


return;


}





data.forEach(customer=>{


customerTable.innerHTML += `


<tr>


<td>

<img 
src="${customer.photo || 'images/avatar.png'}"
class="customer-img">

</td>



<td>

${customer.customerId || "-"}

</td>



<td>

${customer.name || "-"}

</td>



<td>

${customer.phone || "-"}

</td>



<td>

${customer.email || "-"}

</td>



<td>

${customer.location || "-"}

</td>



<td>

${customer.bookings || 0}

</td>



<td>

<span class="status ${customer.status.toLowerCase()}">

${customer.status}

</span>

</td>



<td>


<div class="actions">


<button 
class="edit-btn"
onclick="editCustomer('${customer.id}')">

<i class="fa fa-edit"></i>

</button>




<button 
class="delete-btn"
onclick="deleteCustomer('${customer.id}')">

<i class="fa fa-trash"></i>

</button>


</div>


</td>


</tr>


`;


});


}









// ============================
// SAVE CUSTOMER
// ============================


customerForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



const photoFile =

document.getElementById("customerPhoto")
.files[0];



let photo="";



if(photoFile){


const imageRef =

ref(
storage,
`customers/${Date.now()}-${photoFile.name}`
);



await uploadBytes(

imageRef,

photoFile

);



photo =

await getDownloadURL(imageRef);


}







const customerData={


customerId:

document.getElementById("customerId").value || 
"CUS-"+Date.now(),


name:

document.getElementById("customerName").value,


phone:

document.getElementById("phone").value,


email:

document.getElementById("email").value,


location:

document.getElementById("location").value,


status:

document.getElementById("status").value,


photo:photo,


updatedAt:

serverTimestamp()


};






try{


if(editId){


await updateDoc(

doc(db,"customers",editId),

customerData

);


}

else{


await addDoc(

collection(db,"customers"),

{

...customerData,

bookings:0,

createdAt:serverTimestamp()

}

);


}



alert("Customer saved successfully");


customerModal.classList.remove("show");


customerForm.reset();


}

catch(error){

alert(error.message);

}


}

);









// ============================
// EDIT CUSTOMER
// ============================


window.editCustomer = async(id)=>{


const snap =

await getDoc(

doc(db,"customers",id)

);



if(snap.exists()){


const data=snap.data();



editId=id;



document.getElementById("customerId").value =
data.customerId;


document.getElementById("customerName").value =
data.name;


document.getElementById("phone").value =
data.phone;


document.getElementById("email").value =
data.email;


document.getElementById("location").value =
data.location;


document.getElementById("status").value =
data.status;



customerModal.classList.add("show");


}


};









// ============================
// DELETE CUSTOMER
// ============================


window.deleteCustomer = async(id)=>{


if(confirm("Delete this customer?")){


await deleteDoc(

doc(db,"customers",id)

);


}


};









// ============================
// SEARCH
// ============================


searchCustomer.addEventListener(

"input",

()=>{


const value=

searchCustomer.value.toLowerCase();



const result=

customers.filter(customer=>

customer.name
?.toLowerCase()
.includes(value)

||
customer.phone
?.includes(value)

);



displayCustomers(result);


}

);








// ============================
// FILTER STATUS
// ============================


filterStatus.addEventListener(

"change",

()=>{


const value=

filterStatus.value;



if(value===""){


displayCustomers(customers);


}

else{


displayCustomers(

customers.filter(

customer=>

customer.status===value

)

);


}


}

);








// ============================
// STATISTICS
// ============================


function updateStatistics(data){



document.getElementById("totalCustomers").innerHTML =

data.length;



document.getElementById("activeCustomers").innerHTML =

data.filter(

c=>c.status==="Active"

).length;




document.getElementById("blockedCustomers").innerHTML =

data.filter(

c=>c.status==="Blocked"

).length;




let today =
new Date();


let newCustomers =

data.filter(c=>{


if(!c.createdAt) return false;


let date =
c.createdAt.toDate();


return (

today-date

)<

(7*24*60*60*1000)

});


document.getElementById("newCustomers").innerHTML =

newCustomers.length;


}

