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
const searchBtn=document.querySelector("#searchBtn");
const city=document.querySelector("#city");
const temp=document.querySelector("#temp");
const API_KEY="25264983150c5ae492808398dd919ab6";

async function fetchCityWeather(cityName){
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data=await response.json();
        city.textContent=data.name
        temp.textContent=Math.round(data.main.temp -273.15)+"°C";
}

searchBtn.addEventListener("click", ()=>{
    const cityName=inputSearch.value.trim();
    if(cityName==="")return;
    fetchCityWeather(cityName);
})
inputSearch.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        const cityName=inputSearch.value.trim();
        if(cityName==="")return
        fetchCityWeather(cityName)
    }
})