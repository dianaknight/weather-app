import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import rainBg from "./assets/rain.jpg";
import cloudBg from "./assets/cloud.jpg";
import fogBg from "./assets/fog.jpg";
import thunderBg from "./assets/thunderstorm.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      // dynamic bg
      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [units, city]);

  // changing F and C
  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  const myImage = (e) => {
    if (e == null) {
      return;
    }
    console.log("====================================");
    console.log("current state: " + e.description);
    console.log("====================================");

    let currentDescription = e.description;
    if (currentDescription.includes("cloud")) {
      console.log("cloud picture");
      return `url(${cloudBg})`;
    } else if (currentDescription.includes("clear")) {
      console.log("clear sky picture");
      return `url(${hotBg})`;
    } else if (currentDescription.includes("rain")) {
      console.log("rain picture");
      return `url(${rainBg})`;
    } else if (currentDescription.includes("snow")) {
      console.log("snow picture");
      return `url(${coldBg})`;
    } else if (currentDescription.includes("fog")) {
      console.log("fog picture");
      return `url(${fogBg})`;
    } else if (currentDescription.includes("thunderstorm")) {
      console.log("thunderstorm picture");
      return `url(${thunderBg})`;
    } else {
      return `url(${bg})`;
    }
  };

  return (
    // `url(${bg})`
    <div className="app" style={{ backgroundImage: myImage(weather) }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                {/* ------------------------------------- */}
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
