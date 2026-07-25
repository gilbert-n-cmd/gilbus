// =====================================
// BUSGO ADMIN DASHBOARD JS
// =====================================


// Firebase Imports

import { auth, db } from "./firebase.js";

import { 
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =====================================
// CHECK ADMIN LOGIN
// =====================================


onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="login.html";

        return;

    }



    // Get admin details

    const adminRef = doc(db,"users",user.uid);

    const adminSnap = await getDoc(adminRef);



    if(adminSnap.exists()){


        const data = adminSnap.data();


        if(data.role !== "admin"){


            alert("Access denied");


            await signOut(auth);


            window.location.href="login.html";


            return;


        }



        document.getElementById("adminName").innerText =
        data.name || "Administrator";


    }



    loadStatistics();



});





// =====================================
// LOAD DASHBOARD COUNTS
// =====================================


async function loadStatistics(){


    const collections = [

        {
            id:"totalBuses",
            collection:"buses"
        },

        {
            id:"totalRoutes",
            collection:"routes"
        },


        {
            id:"totalCompanies",
            collection:"companies"
        },


        {
            id:"totalDrivers",
            collection:"drivers"
        },


        {
            id:"totalCustomers",
            collection:"customers"
        },


        {
            id:"totalBookings",
            collection:"bookings"
        },


        {
            id:"totalPayments",
            collection:"payments"
        }


    ];




    for(let item of collections){


        try{


            const snapshot =
            await getDocs(
                collection(db,item.collection)
            );


            document.getElementById(item.id).innerText =
            snapshot.size;



        }
        catch(error){


            console.log(
                "Error loading "+item.collection,
                error
            );


            document.getElementById(item.id).innerText=0;


        }


    }



}





// =====================================
// ADMIN LOGOUT
// =====================================


const logoutBtn =
document.getElementById("logoutBtn");



if(logoutBtn){


logoutBtn.addEventListener("click",async()=>{


    await signOut(auth);


    window.location.href="login.html";


});


}

// ===============================
// MOBILE SIDEBAR MENU
// ===============================


