const menuBtn=document.querySelector(".menu-btn");
const btns=document.querySelector(".btns");
menuBtn.addEventListener("click", ()=>{
    btns.classList.toggle("active");
});
// ! Adding date and time
function currentDateTime(){
    const now=new Date();
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short',
        hour:'numeric',
        minute:'2-digit',
        hour12:true
    };
    const formatted=now.toLocaleString('en-IN', options);
    const parts=formatted.split(", ");
    const finalFormat=`${parts[0]}, ${parts[1]}• ${parts[2]}`;
    document.querySelector("#date-time").textContent=finalFormat
}
currentDateTime();
setInterval(currentDateTime, 1000);
const inputSearch=document.querySelector("#input-search");
const searchBtn=document.querySelector("searchBtn");
const API_KEY="25264983150c5ae492808398dd919ab6";
