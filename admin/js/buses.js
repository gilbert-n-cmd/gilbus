// ===================================
// BUSGO ADMIN - BUSES.JS
// FIREBASE BUS MANAGEMENT
// ===================================


import { db, storage } from "./firebase-config.js";


import {

collection,
addDoc,
doc,
deleteDoc,
updateDoc,
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





// ===============================
// ELEMENTS
// ===============================


const busTable = document.getElementById("busTable");

const modal = document.getElementById("busModal");

const addBtn = document.getElementById("addBusBtn");

const cancelBtn = document.getElementById("cancelBus");

const form = document.getElementById("busForm");

const search = document.getElementById("searchBus");

const filterCompany = document.getElementById("filterCompany");




// INPUTS


const busId = document.getElementById("busId");

const busNumber = document.getElementById("busNumber");

const registrationNumber =
document.getElementById("registrationNumber");

const company =
document.getElementById("company");

const driver =
document.getElementById("driver");

const route =
document.getElementById("route");

const seats =
document.getElementById("seats");

const status =
document.getElementById("status");

const busImage =
document.getElementById("busImage");



let buses = [];





// ===============================
// OPEN ADD BUS MODAL
// ===============================


if(addBtn && modal){


addBtn.addEventListener("click",()=>{


form.reset();

busId.value="";


modal.classList.add("active");


});


}





// ===============================
// CLOSE MODAL
// ===============================


if(cancelBtn && modal){


cancelBtn.addEventListener("click",()=>{


modal.classList.remove("active");


});


}




// CLOSE WHEN CLICK OUTSIDE

if(modal){


modal.addEventListener("click",(e)=>{


if(e.target === modal){


modal.classList.remove("active");


}


});


}






// ===============================
// LOAD BUSES FROM FIRESTORE
// ===============================


onSnapshot(

collection(db,"buses"),

(snapshot)=>{


buses=[];


snapshot.forEach((item)=>{


buses.push({

id:item.id,

...item.data()

});


});



displayBuses(buses);

updateCards();

loadCompanies();



},


(error)=>{


console.log(error);

alert(
"Failed loading buses"
);


}


);
// ===============================
// DISPLAY BUSES TABLE
// ===============================


function displayBuses(data){


if(!busTable) return;


busTable.innerHTML="";



if(data.length === 0){


busTable.innerHTML = `

<tr>

<td colspan="9" style="text-align:center">

No buses found

</td>

</tr>

`;


return;

}




data.forEach((bus)=>{


busTable.innerHTML += `

<tr>


<td>

<img 
src="${bus.imageURL || 'images/bus.png'}"
class="bus-image">

</td>



<td>

${bus.busNumber || ""}

</td>



<td>

${bus.registrationNumber || ""}

</td>



<td>

${bus.company || ""}

</td>



<td>

${bus.driver || ""}

</td>



<td>

${bus.route || ""}

</td>



<td>

${bus.seats || 0}

</td>



<td>

<span class="status">

${bus.status || ""}

</span>

</td>




<td>


<button 
class="action-btn edit-btn"
onclick="editBus('${bus.id}')">

<i class="fa fa-edit"></i>

</button>




<button 
class="action-btn delete-btn"
onclick="deleteBus('${bus.id}')">

<i class="fa fa-trash"></i>

</button>


</td>



</tr>


`;


});


}








// ===============================
// SAVE BUS
// ===============================


if(form){


form.addEventListener("submit", async(e)=>{


e.preventDefault();



try{


let imageURL="";



// UPLOAD IMAGE


if(busImage.files.length > 0){


const imageRef = ref(

storage,

"busImages/"+Date.now()

);



await uploadBytes(

imageRef,

busImage.files[0]

);



imageURL = await getDownloadURL(

imageRef

);


}





const busData = {


busNumber:busNumber.value.trim(),


registrationNumber:
registrationNumber.value.trim(),


company:
company.value.trim(),


driver:
driver.value.trim(),


route:
route.value.trim(),


seats:
Number(seats.value),


status:
status.value,


updatedAt:
serverTimestamp()


};





if(imageURL){

busData.imageURL=imageURL;

}






// UPDATE EXISTING BUS


if(busId.value){



await updateDoc(

doc(
db,
"buses",
busId.value

),

busData

);



alert(
"Bus updated successfully"
);



}





// ADD NEW BUS


else{



busData.createdAt =
serverTimestamp();



await addDoc(

collection(db,"buses"),

busData

);



alert(
"Bus added successfully"
);



}







form.reset();


busId.value="";


modal.classList.remove("active");



}



catch(error){


console.log(error);


alert(
error.message
);


}



});


}







// ===============================
// EDIT BUS
// ===============================


window.editBus = function(id){



const bus = buses.find(

item => item.id === id

);



if(!bus) return;




busId.value = bus.id;


busNumber.value =
bus.busNumber || "";



registrationNumber.value =
bus.registrationNumber || "";



company.value =
bus.company || "";



driver.value =
bus.driver || "";



route.value =
bus.route || "";



seats.value =
bus.seats || "";



status.value =
bus.status || "Available";





modal.classList.add("active");



};
// ===============================
// DELETE BUS
// ===============================


window.deleteBus = async function(id){


const confirmDelete = confirm(
"Are you sure you want to delete this bus?"
);



if(!confirmDelete) return;



try{


await deleteDoc(

doc(
db,
"buses",
id

)

);



alert(
"Bus deleted successfully"
);



}


catch(error){


console.log(error);


alert(
error.message
);


}



};








// ===============================
// SEARCH BUS
// ===============================


if(search){


search.addEventListener("input",()=>{


const value =
search.value.toLowerCase();



const result = buses.filter(bus=>{


return (

(bus.busNumber || "")
.toLowerCase()
.includes(value)



||



(bus.registrationNumber || "")
.toLowerCase()
.includes(value)



||



(bus.company || "")
.toLowerCase()
.includes(value)



||



(bus.driver || "")
.toLowerCase()
.includes(value)



);



});



displayBuses(result);



});


}








// ===============================
// COMPANY FILTER
// ===============================


if(filterCompany){


filterCompany.addEventListener("change",()=>{


const companyName =
filterCompany.value;



if(companyName === ""){


displayBuses(buses);


}

else{


const filtered =
buses.filter(bus=>

bus.company === companyName

);



displayBuses(filtered);


}



});


}








// ===============================
// LOAD COMPANY OPTIONS
// ===============================


function loadCompanies(){


if(!filterCompany) return;



const companies = [

...new Set(

buses.map(bus=>bus.company)

)

];



filterCompany.innerHTML = `

<option value="">

All Companies

</option>

`;



companies.forEach(company=>{


if(company){


filterCompany.innerHTML += `

<option value="${company}">

${company}

</option>

`;

}


});



}








// ===============================
// UPDATE STATISTICS CARDS
// ===============================


function updateCards(){



const total =
document.getElementById("totalBuses");


const available =
document.getElementById("availableBuses");


const trip =
document.getElementById("tripBuses");


const maintenance =
document.getElementById("maintenanceBuses");





if(total){

total.textContent =
buses.length;

}



if(available){

available.textContent =

buses.filter(bus=>

bus.status === "Available"

).length;

}





if(trip){

trip.textContent =

buses.filter(bus=>

bus.status === "On Trip"

).length;

}





if(maintenance){

maintenance.textContent =

buses.filter(bus=>

bus.status === "Maintenance"

).length;

}



}








// ===============================
// END BUS MANAGEMENT
// ===============================