const menuBtn = document.getElementById("menuBtn");

const sidebar = document.querySelector(".sidebar");


if(menuBtn){


    menuBtn.addEventListener("click",()=>{


        sidebar.classList.toggle("active");


    });


}

// CLOSE SIDEBAR BUTTON

const closeMenu =
document.getElementById("closeMenu");


if(closeMenu){

closeMenu.addEventListener("click",()=>{

    sidebar.classList.remove("active");

});

}

