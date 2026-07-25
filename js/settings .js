/* ==========================================
   BUSGO ADMIN - SETTINGS.JS
   PART 1
   Firebase Setup, Load Settings,
   Profile & Company Saving
========================================== */


// ================================
// FIREBASE IMPORTS
// ================================

import { 
    db,
    auth,
    storage

} from "./firebase-config.js";


import {

    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

    ref,
    uploadBytes,
    getDownloadURL

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// ================================
// ELEMENTS
// ================================


const adminName =
document.getElementById("adminName");


const adminEmail =
document.getElementById("adminEmail");


const adminPhone =
document.getElementById("adminPhone");


const profileImage =
document.getElementById("profileImage");


const companyName =
document.getElementById("companyName");


const companyEmail =
document.getElementById("companyEmail");


const companyPhone =
document.getElementById("companyPhone");


const companyAddress =
document.getElementById("companyAddress");



const saveProfile =
document.getElementById("saveProfile");


const saveCompany =
document.getElementById("saveCompany");



let currentUser = null;



// ================================
// CHECK LOGIN USER
// ================================


onAuthStateChanged(auth, async(user)=>{


    if(user){


        currentUser = user;


        await loadProfile();


        await loadCompanySettings();


    }

    else{


        window.location.href="login.html";


    }


});



// ================================
// LOAD ADMIN PROFILE
// ================================


async function loadProfile(){


    try{


        const userRef =
        doc(db,"users",currentUser.uid);



        const snapshot =
        await getDoc(userRef);



        if(snapshot.exists()){


            const data =
            snapshot.data();



            adminName.value =
            data.fullName || "";



            adminEmail.value =
            data.email || currentUser.email;



            adminPhone.value =
            data.phone || "";


        }


    }


    catch(error){


        showAlert(
            "Failed to load profile",
            "error"
        );


        console.error(error);


    }


}



// ================================
// SAVE ADMIN PROFILE
// ================================


saveProfile.addEventListener(
"click",
async()=>{


    try{


        saveProfile.disabled=true;


        let imageURL="";



        // Upload Image

        if(profileImage.files.length > 0){


            const image =
            profileImage.files[0];



            const storageRef =
            ref(
                storage,
                "profiles/"+currentUser.uid
            );



            await uploadBytes(
                storageRef,
                image
            );



            imageURL =
            await getDownloadURL(storageRef);


        }



        const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );



        await setDoc(

            userRef,

            {

                fullName:
                adminName.value,


                email:
                adminEmail.value,


                phone:
                adminPhone.value,


                profileImage:
                imageURL,


                updatedAt:
                serverTimestamp()

            },

            {

                merge:true

            }

        );



        showAlert(
            "Profile saved successfully",
            "success"
        );


    }


    catch(error){


        console.error(error);


        showAlert(
            error.message,
            "error"
        );


    }


    finally{


        saveProfile.disabled=false;


    }


});



// ================================
// LOAD COMPANY SETTINGS
// ================================


async function loadCompanySettings(){


    try{


        const companyRef =
        doc(
            db,
            "settings",
            "company"
        );



        const snapshot =
        await getDoc(companyRef);



        if(snapshot.exists()){


            const data =
            snapshot.data();



            companyName.value =
            data.companyName || "";



            companyEmail.value =
            data.companyEmail || "";



            companyPhone.value =
            data.companyPhone || "";



            companyAddress.value =
            data.companyAddress || "";


        }


    }


    catch(error){


        console.error(error);


    }


}



// ================================
// SAVE COMPANY SETTINGS
// ================================


saveCompany.addEventListener(
"click",
async()=>{


    try{


        saveCompany.disabled=true;



        const companyRef =
        doc(
            db,
            "settings",
            "company"
        );



        await setDoc(

            companyRef,

            {


                companyName:
                companyName.value,


                companyEmail:
                companyEmail.value,


                companyPhone:
                companyPhone.value,


                companyAddress:
                companyAddress.value,


                updatedAt:
                serverTimestamp()


            },


            {


                merge:true


            }

        );



        showAlert(
            "Company settings saved",
            "success"
        );


    }


    catch(error){


        console.error(error);


        showAlert(
            error.message,
            "error"
        );


    }


    finally{


        saveCompany.disabled=false;


    }


});

/* ==========================================
   BUSGO ADMIN - SETTINGS.JS
   PART 2
   Payment Settings, Notifications,
   Password Change
========================================== */


// ================================
// PAYMENT ELEMENTS
// ================================


const currency =
document.getElementById("currency");


const mobileMoney =
document.getElementById("mobileMoney");


const bankName =
document.getElementById("bankName");


const accountNumber =
document.getElementById("accountNumber");


const savePayment =
document.getElementById("savePayment");



// ================================
// NOTIFICATION ELEMENTS
// ================================


const emailNotify =
document.getElementById("emailNotify");


const smsNotify =
document.getElementById("smsNotify");


const bookingNotify =
document.getElementById("bookingNotify");


const saveNotifications =
document.getElementById("saveNotifications");



// ================================
// PASSWORD ELEMENTS
// ================================


const currentPassword =
document.getElementById("currentPassword");


const newPassword =
document.getElementById("newPassword");


const confirmPassword =
document.getElementById("confirmPassword");


const changePassword =
document.getElementById("changePassword");



// ================================
// LOAD PAYMENT SETTINGS
// ================================


async function loadPaymentSettings(){


    try{


        const companyRef =
        doc(
            db,
            "settings",
            "company"
        );


        const snapshot =
        await getDoc(companyRef);



        if(snapshot.exists()){


            const data =
            snapshot.data();



            currency.value =
            data.currency || "UGX";


            mobileMoney.value =
            data.mobileMoney || "";


            bankName.value =
            data.bankName || "";


            accountNumber.value =
            data.accountNumber || "";


        }


    }


    catch(error){

        console.error(error);

    }


}




// ================================
// SAVE PAYMENT SETTINGS
// ================================


savePayment.addEventListener(
"click",
async()=>{


    try{


        savePayment.disabled=true;



        const companyRef =
        doc(
            db,
            "settings",
            "company"
        );



        await updateDoc(

            companyRef,

            {

                currency:
                currency.value,


                mobileMoney:
                mobileMoney.value,


                bankName:
                bankName.value,


                accountNumber:
                accountNumber.value,


                updatedAt:
                serverTimestamp()


            }

        );



        showAlert(
            "Payment settings saved",
            "success"
        );


    }


    catch(error){


        console.error(error);



        showAlert(
            error.message,
            "error"
        );


    }


    finally{


        savePayment.disabled=false;


    }


});





// ================================
// LOAD NOTIFICATION SETTINGS
// ================================


async function loadNotificationSettings(){


    try{


        const settingsRef =
        doc(
            db,
            "settings",
            "company"
        );



        const snapshot =
        await getDoc(settingsRef);



        if(snapshot.exists()){


            const data =
            snapshot.data();



            emailNotify.checked =
            data.emailNotifications ?? true;



            smsNotify.checked =
            data.smsNotifications ?? true;



            bookingNotify.checked =
            data.bookingNotifications ?? true;


        }


    }


    catch(error){


        console.error(error);


    }


}




// ================================
// SAVE NOTIFICATIONS
// ================================


saveNotifications.addEventListener(
"click",
async()=>{


    try{


        saveNotifications.disabled=true;



        const settingsRef =
        doc(
            db,
            "settings",
            "company"
        );



        await updateDoc(

            settingsRef,

            {


                emailNotifications:
                emailNotify.checked,


                smsNotifications:
                smsNotify.checked,


                bookingNotifications:
                bookingNotify.checked,


                updatedAt:
                serverTimestamp()


            }

        );



        showAlert(
            "Notification settings updated",
            "success"
        );


    }


    catch(error){


        console.error(error);


        showAlert(
            error.message,
            "error"
        );


    }


    finally{


        saveNotifications.disabled=false;


    }


});





// ================================
// FIREBASE PASSWORD CHANGE
// ================================


import {

    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




changePassword.addEventListener(
"click",
async()=>{


    try{


        if(
            newPassword.value !== 
            confirmPassword.value
        ){

            showAlert(
                "Passwords do not match",
                "error"
            );

            return;

        }



        const credential =
        EmailAuthProvider.credential(

            currentUser.email,

            currentPassword.value

        );



        await reauthenticateWithCredential(

            currentUser,

            credential

        );



        await updatePassword(

            currentUser,

            newPassword.value

        );



        showAlert(
            "Password changed successfully",
            "success"
        );



        currentPassword.value="";
        newPassword.value="";
        confirmPassword.value="";


    }


    catch(error){


        console.error(error);


        showAlert(
            error.message,
            "error"
        );


    }


});





// ================================
// LOAD EXTRA SETTINGS
// ================================


loadPaymentSettings();


loadNotificationSettings();

/* ==========================================
   BUSGO ADMIN - SETTINGS.JS
   PART 3
   Alerts, Sidebar Menu, Logout & Final Setup
========================================== */



// ================================
// ALERT FUNCTION
// ================================


function showAlert(message, type="success"){


    const alertBox =
    document.createElement("div");


    alertBox.className =
    `alert ${type}`;



    let icon="";


    if(type==="success"){

        icon =
        `<i class="fas fa-check-circle"></i>`;

    }

    else if(type==="error"){

        icon =
        `<i class="fas fa-times-circle"></i>`;

    }

    else{

        icon =
        `<i class="fas fa-exclamation-triangle"></i>`;

    }



    alertBox.innerHTML =
    `
    ${icon}
    <span>${message}</span>
    `;



    document.body.appendChild(alertBox);



    setTimeout(()=>{


        alertBox.remove();


    },3000);


}





// ================================
// SIDEBAR MOBILE MENU
// ================================


const menuBtn =
document.getElementById("menuBtn");


const sidebar =
document.getElementById("sidebar");



if(menuBtn){


    menuBtn.addEventListener(
    "click",
    ()=>{


        sidebar.classList.toggle(
            "active"
        );


        createOverlay();


    });


}





// ================================
// SIDEBAR OVERLAY
// ================================


function createOverlay(){


    let overlay =
    document.querySelector(
        ".sidebar-overlay"
    );



    if(!overlay){


        overlay =
        document.createElement("div");


        overlay.className =
        "sidebar-overlay";


        document.body.appendChild(
            overlay
        );


    }



    if(
        sidebar.classList.contains("active")
    ){

        overlay.classList.add(
            "active"
        );

    }

    else{

        overlay.classList.remove(
            "active"
        );

    }



    overlay.onclick = ()=>{


        sidebar.classList.remove(
            "active"
        );


        overlay.classList.remove(
            "active"
        );


    };


}





// ================================
// LOGOUT
// ================================


const logoutBtn =
document.getElementById("logoutBtn");



if(logoutBtn){


    logoutBtn.addEventListener(
    "click",
    async(e)=>{


        e.preventDefault();



        try{


            await auth.signOut();



            window.location.href =
            "login.html";


        }


        catch(error){


            showAlert(
                error.message,
                "error"
            );


        }


    });


}





// ================================
// CLOSE SIDEBAR WHEN LINK CLICKED
// ON MOBILE
// ================================


const sidebarLinks =
document.querySelectorAll(
    ".sidebar a"
);



sidebarLinks.forEach(link=>{


    link.addEventListener(
    "click",
    ()=>{


        if(window.innerWidth <= 1100){


            sidebar.classList.remove(
                "active"
            );


        }


    });


});





// ================================
// INITIAL PAGE CHECK
// ================================


window.addEventListener(
"load",
()=>{


    console.log(
        "BusGo Settings Loaded Successfully"
    );


});

