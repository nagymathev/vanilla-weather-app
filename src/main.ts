import "./style.css";

type WeatherData = {
    name: string;
    condition: {
        code: number;
        icon: string;
        text: string;
    };
    temp_c: number;
};

let input = document.querySelector<HTMLInputElement>("#cityInput")!;
input.addEventListener("input", () => {
    if (input.value !== "") submit.classList.remove("btn-disabled");
    else submit.classList.add("btn-disabled");
});

let submit = document.querySelector(".query button")!;
let loadingIcon = document.createElement("span");
loadingIcon.classList.add("loading");
submit.addEventListener("click", (e) => {
    e.preventDefault();
    submit.insertBefore(loadingIcon, submit.firstChild);
    getWeatherData(input.value).then((data: WeatherData) => {
        displayResults(data);
        setTimeout(() => submit.firstElementChild!.remove(), 1000);
    });
});

async function getWeatherData(city: string) {
    let res = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${city}`
    );
    let data = await res.json();
    return {
        name: data.location.name,
        condition: data.current.condition,
        temp_c: data.current.temp_c,
    };
}

async function displayResults(data: WeatherData) {
    let gifData = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_KEY}&q=${
            data.condition.text
        }`
    );
    let gif = await gifData.json();
    let resElem = document.querySelector(".result")!;
    resElem.classList.remove("hidden");
    document.querySelector(".divider")!.classList.remove("hidden");
    resElem.innerHTML = `
        <div>
            <h2 class="inline">The weather in ${data.name} is: ${data.condition.text}</h2>
            <img class="max-h-10 inline" src=${data.condition.icon} alt=${data.condition.text}>
        </div>
        <p>The temperature is: ${data.temp_c}&deg;C</p>
        <div class="divider my-1 ">
            <span class="font-extrabold bg-gradient-to-r text-transparent bg-clip-text from-pink-500 to-teal-500">Special GIF</span>
        </div>
        <img class="rounded-md" src=${
            gif.data[Math.round(Math.random() * 50)].images.original.url
        } alt=${data.condition.text}>
    `;
}
