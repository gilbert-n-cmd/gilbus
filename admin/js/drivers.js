// ===================================
// BUSGO ADMIN - DRIVERS.JS
// FIREBASE DRIVERS MANAGEMENT
// ===================================


import { db, storage } from "./firebase-config.js";


import {

collection,
addDoc,
doc,
deleteDoc,
updateDoc,
onSnapshot,
getDoc,
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


const driverTable =
document.getElementById("driverTable");


const addDriverBtn =
document.getElementById("addDriverBtn");


const driverModal =
document.getElementById("driverModal");


const cancelDriver =
document.getElementById("cancelDriver");


const driverForm =
document.getElementById("driverForm");



const searchDriver =
document.getElementById("searchDriver");





let drivers = [];

let editId = null;





// ===============================
// OPEN MODAL
// ===============================


addDriverBtn.onclick = ()=>{

driverModal.classList.add("show");

driverForm.reset();

editId=null;

};





// CLOSE MODAL


cancelDriver.onclick = ()=>{

driverModal.classList.remove("show");

};








// ===============================
// LOAD DRIVERS
// ===============================


onSnapshot(

collection(db,"drivers"),

(snapshot)=>{


drivers=[];


snapshot.forEach((doc)=>{


drivers.push({

id:doc.id,

...doc.data()

});


});


displayDrivers(drivers);

updateStats(drivers);


}

);









// ===============================
// DISPLAY TABLE
// ===============================


function displayDrivers(data){



driverTable.innerHTML="";



if(data.length===0){


driverTable.innerHTML=`

<tr>

<td colspan="9">

No drivers found.

</td>

</tr>

`;


return;

}





data.forEach(driver=>{



driverTable.innerHTML += `

<tr>


<td>

<img 
src="${driver.photo || 'images/avatar.png'}"
class="driver-img">

</td>



<td>

${driver.driverId || "-"}

</td>



<td>

${driver.name || "-"}

</td>



<td>

${driver.phone || "-"}

</td>



<td>

${driver.company || "-"}

</td>



<td>

${driver.bus || "-"}

</td>



<td>

${driver.license || "-"}

</td>



<td>

<span class="status ${driver.status.toLowerCase()}">

${driver.status}

</span>

</td>



<td>


<div class="actions">


<button 
class="edit-btn"
onclick="editDriver('${driver.id}')">

<i class="fa fa-edit"></i>

</button>



<button
class="delete-btn"
onclick="deleteDriver('${driver.id}')">

<i class="fa fa-trash"></i>

</button>


</div>


</td>



</tr>

`;


});


}









// ===============================
// ADD / UPDATE DRIVER
// ===============================


driverForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



const photoFile =
document.getElementById("driverPhoto").files[0];



let photoURL="";



if(photoFile){


const imageRef =
ref(storage,
`drivers/${Date.now()}-${photoFile.name}`);



await uploadBytes(

imageRef,

photoFile

);



photoURL =
await getDownloadURL(imageRef);


}





const driverData={


driverId:
document.getElementById("driverId").value,


name:
document.getElementById("driverName").value,


phone:
document.getElementById("phone").value,


email:
document.getElementById("email").value,


license:
document.getElementById("license").value,


company:
document.getElementById("company").value,


bus:
document.getElementById("bus").value,


status:
document.getElementById("status").value,


photo:
photoURL,


updatedAt:
serverTimestamp()

};







try{


if(editId){


await updateDoc(

doc(db,"drivers",editId),

driverData

);


}

else{


await addDoc(

collection(db,"drivers"),

{

...driverData,

createdAt:serverTimestamp()

}

);


}



alert("Driver saved successfully");


driverModal.classList.remove("show");

driverForm.reset();


}

catch(error){

console.log(error);

alert(error.message);

}


}

);









// ===============================
// EDIT DRIVER
// ===============================


window.editDriver = async(id)=>{


const snap =
await getDoc(

doc(db,"drivers",id)

);



if(snap.exists()){


const d=snap.data();


editId=id;



document.getElementById("driverId").value=d.driverId;

document.getElementById("driverName").value=d.name;

document.getElementById("phone").value=d.phone;

document.getElementById("email").value=d.email;

document.getElementById("license").value=d.license;

document.getElementById("company").value=d.company;

document.getElementById("bus").value=d.bus;

document.getElementById("status").value=d.status;



driverModal.classList.add("show");


}


};









// ===============================
// DELETE DRIVER
// ===============================


window.deleteDriver = async(id)=>{


if(confirm("Delete this driver?")){


await deleteDoc(

doc(db,"drivers",id)

);


}


};









// ===============================
// SEARCH
// ===============================


searchDriver.addEventListener(

"input",

()=>{


const value =
searchDriver.value.toLowerCase();



const filtered =
drivers.filter(driver=>


driver.name
?.toLowerCase()
.includes(value)

);



displayDrivers(filtered);



}

);









// ===============================
// STATISTICS
// ===============================


function updateStats(data){


document.getElementById("totalDrivers").innerHTML =
data.length;



document.getElementById("availableDrivers").innerHTML =

data.filter(
d=>d.status==="Available"
).length;



document.getElementById("tripDrivers").innerHTML =

data.filter(
d=>d.status==="On Trip"
).length;



document.getElementById("offDutyDrivers").innerHTML =

data.filter(
d=>d.status==="Off Duty"
).length;



}

