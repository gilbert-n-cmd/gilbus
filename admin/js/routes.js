// ===================================
// BUSGO ADMIN - ROUTES.JS
// FIREBASE ROUTES MANAGEMENT
// ===================================


import { db } from "./firebase-config.js";


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





// ELEMENTS


const routeTable =
document.getElementById("routeTable");


const modal =
document.getElementById("routeModal");


const addBtn =
document.getElementById("addRouteBtn");


const cancelBtn =
document.getElementById("cancelRoute");


const form =
document.getElementById("routeForm");



const search =
document.getElementById("searchRoute");


const filter =
document.getElementById("statusFilter");





// INPUTS


const routeId =
document.getElementById("routeId");


const origin =
document.getElementById("origin");


const destination =
document.getElementById("destination");


const distance =
document.getElementById("distance");


const departure =
document.getElementById("departure");


const arrival =
document.getElementById("arrival");


const fare =
document.getElementById("fare");


const status =
document.getElementById("status");




let routes=[];





// =============================
// OPEN ADD MODAL
// =============================


addBtn.onclick=()=>{


form.reset();

routeId.value="";


modal.classList.add("active");


};





cancelBtn.onclick=()=>{


modal.classList.remove("active");


};







// =============================
// REALTIME LOAD ROUTES
// =============================


onSnapshot(

collection(db,"routes"),

(snapshot)=>{


routes=[];


snapshot.forEach((item)=>{


routes.push({

id:item.id,

...item.data()

});


});



displayRoutes(routes);

updateCards();



}


);







// =============================
// DISPLAY ROUTES
// =============================


function displayRoutes(data){


routeTable.innerHTML="";



if(data.length===0){


routeTable.innerHTML=`

<tr>

<td colspan="8">

No routes found.

</td>

</tr>

`;

return;

}




data.forEach(route=>{


routeTable.innerHTML += `


<tr>


<td>${route.origin || ""}</td>


<td>${route.destination || ""}</td>


<td>${route.distance || ""}</td>


<td>${route.departure || ""}</td>


<td>${route.arrival || ""}</td>


<td>

UGX ${route.fare || 0}

</td>


<td>


<span class="status 
${route.status==="Active"
?
"active-status"
:
"inactive-status"}">

${route.status}

</span>


</td>


<td>


<div class="action-buttons">


<button 
class="action-btn edit-btn"
onclick="editRoute('${route.id}')">

<i class="fa fa-edit"></i>

</button>



<button 
class="action-btn delete-btn"
onclick="deleteRoute('${route.id}')">


<i class="fa fa-trash"></i>


</button>


</div>


</td>



</tr>



`;

});


}







// =============================
// ADD / UPDATE ROUTE
// =============================


form.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



const data={


origin:origin.value,

destination:destination.value,

distance:distance.value,

departure:departure.value,

arrival:arrival.value,

fare:Number(fare.value),

status:status.value,

updatedAt:serverTimestamp()


};





if(routeId.value){



await updateDoc(

doc(db,"routes",routeId.value),

data

);



}

else{



await addDoc(

collection(db,"routes"),

{

...data,

createdAt:serverTimestamp()

}

);



}





modal.classList.remove("active");


form.reset();


});








// =============================
// EDIT ROUTE
// =============================


window.editRoute=(id)=>{


const route = routes.find(

r=>r.id===id

);



if(!route) return;



routeId.value=route.id;


origin.value=route.origin;


destination.value=route.destination;


distance.value=route.distance;


departure.value=route.departure;


arrival.value=route.arrival;


fare.value=route.fare;


status.value=route.status;



modal.classList.add("active");


};







// =============================
// DELETE ROUTE
// =============================


window.deleteRoute=async(id)=>{


if(confirm("Delete this route?")){


await deleteDoc(

doc(db,"routes",id)

);


}


};








// =============================
// SEARCH
// =============================


search.oninput=()=>{


const value =
search.value.toLowerCase();



const result = routes.filter(route=>


(route.origin || "")
.toLowerCase()
.includes(value)



||



(route.destination || "")
.toLowerCase()
.includes(value)



);



displayRoutes(result);


};









// =============================
// FILTER STATUS
// =============================


filter.onchange=()=>{


if(filter.value===""){


displayRoutes(routes);


}

else{


displayRoutes(

routes.filter(

route=>

route.status===filter.value

)

);


}


};








// =============================
// UPDATE STATISTICS
// =============================


function updateCards(){



document.getElementById("totalRoutes")
.innerText = routes.length;





document.getElementById("activeRoutes")
.innerText =

routes.filter(

r=>r.status==="Active"

).length;





document.getElementById("inactiveRoutes")
.innerText =

routes.filter(

r=>r.status==="Inactive"

).length;



}

// ===============================
// MOBILE SIDEBAR MENU
// ===============================


const menuBtn = document.getElementById("menuBtn");

const closeMenu = document.getElementById("closeMenu");

const sidebar = document.querySelector(".sidebar");

const overlay = document.getElementById("overlay");



if(menuBtn){

menuBtn.addEventListener("click",()=>{

    if(sidebar){

        sidebar.classList.add("active");

    }


    if(overlay){

        overlay.classList.add("active");

    }

});

}



if(closeMenu){

closeMenu.addEventListener("click",()=>{

    sidebar.classList.remove("active");

    if(overlay){
        overlay.classList.remove("active");
    }

});

}



if(overlay){

overlay.addEventListener("click",()=>{

    sidebar.classList.remove("active");

    overlay.classList.remove("active");

});

}