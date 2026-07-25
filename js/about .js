/* ==========================================
   BUSGO ABOUT PAGE JAVASCRIPT
========================================== */



// ==========================================
// COUNTER ANIMATION
// ==========================================


const counters = document.querySelectorAll(".counter");



counters.forEach(counter => {



    const target = 
    parseInt(counter.innerText.replace("+",""));



    let count = 0;



    const speed = 50;



    const updateCounter = () => {



        const increment =
        Math.ceil(target / speed);



        if(count < target){


            count += increment;


            counter.innerText =
            count + "+";


            setTimeout(
                updateCounter,
                40
            );


        }


        else{


            counter.innerText =
            target + "+";


        }



    };



    updateCounter();



});

