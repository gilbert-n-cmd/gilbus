/* ==========================================
   BACK TO TOP BUTTON
========================================== */

const topBtn = document.getElementById("topBtn");

if(topBtn){

    window.addEventListener("scroll", () => {

        if(window.scrollY > 300){

            topBtn.style.display = "flex";

        }else{

            topBtn.style.display = "none";

        }

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}
// ==========================================
// MOBILE MENU
// ==========================================

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");


if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        nav.classList.toggle("active");

    });

}





// ==========================================
// FAQ ACCORDION
// ==========================================


const faqButtons = document.querySelectorAll(".faq-question");


faqButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        const item = button.parentElement;


        item.classList.toggle("active");



        const icon = button.querySelector("span");


        if(icon){

            icon.textContent =
            item.classList.contains("active") ? "-" : "+";

        }


    });


});






// ==========================================
// NUMBER COUNTER
// ==========================================


const counters = document.querySelectorAll(".counter");


counters.forEach(counter=>{


    const updateCounter = ()=>{


        const target =
        Number(counter.dataset.target);


        const current =
        Number(counter.innerText);



        const increment =
        Math.ceil(target / 100);



        if(current < target){


            counter.innerText =
            current + increment;


            setTimeout(updateCounter,20);


        }

        else{


            counter.innerText =
            target.toLocaleString()+"+";


        }


    };



    updateCounter();


});







// ==========================================
// TESTIMONIAL SLIDER
// ==========================================


const track =
document.querySelector(".testimonial-track");


const reviews =
document.querySelectorAll(".testimonial-card");


let reviewIndex = 0;



function showReview(){


    if(track){

        track.style.transform =
        `translateX(-${reviewIndex * 100}%)`;

    }


}



const nextReview =
document.getElementById("nextReview");

const prevReview =
document.getElementById("prevReview");



if(nextReview){


nextReview.addEventListener("click",()=>{


    reviewIndex++;


    if(reviewIndex >= reviews.length){

        reviewIndex = 0;

    }


    showReview();


});


}




if(prevReview){


prevReview.addEventListener("click",()=>{


    reviewIndex--;


    if(reviewIndex < 0){

        reviewIndex = reviews.length - 1;

    }


    showReview();


});


}





// Auto slide reviews


setInterval(()=>{


    if(nextReview){

        nextReview.click();

    }


},5000);






// ==========================================
// SEARCH BUS FORM
// ==========================================


const searchForm =
document.querySelector(".search-box");



if(searchForm){


searchForm.addEventListener("submit",(e)=>{


    e.preventDefault();



    const from =
    searchForm.querySelectorAll("input")[0].value;



    const to =
    searchForm.querySelectorAll("input")[1].value;



    if(from==="" || to===""){


        alert("Please enter departure and destination");


        return;

    }



    alert(
    `Searching buses from ${from} to ${to}`
    );



    window.location.href="buses.html";



});


}