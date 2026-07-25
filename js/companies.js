// =======================================
// BUSGO ADMIN - COMPANIES.JS
// =======================================

import { auth, db, storage } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// =======================================
// ELEMENTS
// =======================================

const companyTable = document.getElementById("companyTable");
const companyForm = document.getElementById("companyForm");
const companyModal = document.getElementById("companyModal");
const addCompanyBtn = document.getElementById("addCompanyBtn");
const cancelCompany = document.getElementById("cancelCompany");
const searchCompany = document.getElementById("searchCompany");


// =======================================
// CHECK LOGIN
// =======================================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    const adminRef = doc(db,"users",user.uid);

    const adminSnap = await getDoc(adminRef);

    if(adminSnap.exists()){

        document.getElementById("adminName").innerText =
        adminSnap.data().name || "Administrator";

    }

    loadCompanies();

});


// =======================================
// LOAD COMPANIES
// =======================================

async function loadCompanies(){

    companyTable.innerHTML="";

    const snapshot =
    await getDocs(collection(db,"companies"));

    document.getElementById("totalCompanies").innerText =
    snapshot.size;

    if(snapshot.empty){

        companyTable.innerHTML=`
        <tr>
        <td colspan="7">No companies found.</td>
        </tr>`;
        return;

    }

    snapshot.forEach(docSnap=>{

        const company = docSnap.data();

        companyTable.innerHTML +=`

<tr>

<td>
<img src="${company.logo}" class="company-logo">
</td>

<td>${company.name}</td>

<td>${company.email}</td>

<td>${company.phone}</td>

<td>${company.address}</td>

<td>
<span class="status-active">
${company.status}
</span>
</td>

<td>

<button class="edit-btn"
onclick="editCompany('${docSnap.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button class="delete-btn"
onclick="deleteCompany('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}


// =======================================
// ADD COMPANY
// =======================================

companyForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const id=document.getElementById("companyId").value;

    const logoFile=
    document.getElementById("companyLogo").files[0];

    let logoURL="";

    if(logoFile){

        const storageRef=
        ref(storage,"companies/"+Date.now());

        await uploadBytes(storageRef,logoFile);

        logoURL=
        await getDownloadURL(storageRef);

    }

    const data={

        name:document.getElementById("companyName").value,

        phone:document.getElementById("companyPhone").value,

        email:document.getElementById("companyEmail").value,

        address:document.getElementById("companyAddress").value,

        status:document.getElementById("companyStatus").value,

        logo:logoURL

    };

    if(id){

        await updateDoc(doc(db,"companies",id),data);

    }else{

        await addDoc(collection(db,"companies"),data);

    }

    companyModal.classList.remove("active");

    companyForm.reset();

    loadCompanies();

});


// =======================================
// DELETE COMPANY
// =======================================

window.deleteCompany=async(id)=>{

    if(confirm("Delete this company?")){

        await deleteDoc(doc(db,"companies",id));

        loadCompanies();

    }

};


// =======================================
// EDIT COMPANY
// =======================================

window.editCompany=async(id)=>{

    const snap=
    await getDoc(doc(db,"companies",id));

    const c=snap.data();

    document.getElementById("companyId").value=id;
    document.getElementById("companyName").value=c.name;
    document.getElementById("companyPhone").value=c.phone;
    document.getElementById("companyEmail").value=c.email;
    document.getElementById("companyAddress").value=c.address;
    document.getElementById("companyStatus").value=c.status;

    companyModal.classList.add("active");

};


// =======================================
// SEARCH
// =======================================

searchCompany.addEventListener("keyup",()=>{

    const value=
    searchCompany.value.toLowerCase();

    const rows=
    companyTable.querySelectorAll("tr");

    rows.forEach(row=>{

        row.style.display=
        row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

});


// =======================================
// MODAL
// =======================================

addCompanyBtn.onclick=()=>{

    companyForm.reset();

    document.getElementById("companyId").value="";

    companyModal.classList.add("active");

};

cancelCompany.onclick=()=>{

    companyModal.classList.remove("active");

};


// =======================================
// LOGOUT
// =======================================

document.getElementById("logoutBtn")
.addEventListener("click",async()=>{

    await signOut(auth);

    location.href="login.html";

});


// =======================================
// MOBILE MENU
// =======================================

const menuBtn=document.getElementById("menuBtn");
const closeBtn=document.getElementById("closeMenu");
const sidebar=document.querySelector(".sidebar");

menuBtn.onclick=()=>{

    sidebar.classList.add("active");

};

closeBtn.onclick=()=>{

    sidebar.classList.remove("active");

};

