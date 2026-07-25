
/* ==========================================
   BUSGO FAQ JAVASCRIPT
========================================== */



// ==========================================
// FAQ ACCORDION
// ==========================================


const questions = 
document.querySelectorAll(".question");



questions.forEach(question => {



    question.addEventListener("click",()=>{



        const item =
        question.parentElement;



        item.classList.toggle("active");



    });


});






// ==========================================
// FAQ SEARCH
// ==========================================


const searchInput =
document.getElementById("faqSearch");



const faqItems =
document.querySelectorAll(".faq-item");




searchInput.addEventListener("keyup",()=>{


const searchValue =
searchInput.value.toLowerCase();




faqItems.forEach(item=>{


const text =
item.innerText.toLowerCase();




if(text.includes(searchValue)){


item.style.display="block";


}


else{


item.style.display="none";


}



});



});
