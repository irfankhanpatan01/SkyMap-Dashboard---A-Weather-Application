const menuBtn=document.querySelector(".menu-btn");
const btns=document.querySelector(".btns");
menuBtn.addEventListener("click", ()=>{
    btns.classList.toggle("active");
})
