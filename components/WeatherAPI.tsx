"use client";
// WeatherApp.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import Axios from "axios";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { Container, Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./HumidityInfo.module.css"; // Import your CSS module

//declaring typescript datatypes
interface Province {
  code: string;
  name: string;
}

interface CityOrMunicipality {
  code: string;
  name: string;
}

interface WeatherData {
  name: string;
  weather: { main: string }[];
  main: {
    temp: number;
    humidity: number;
  };
}

const api = {
  key: process.env.NEXT_PUBLIC_REACT_APP_WEATHER_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
  iconLink: "https://openweathermap.org/img/wn/",
};

const WeatherApp: React.FC = () => {
  const [province, setProvince] = useState<Province[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [citiesOrMunicipalities, setCitiesOrMunicipalities] = useState<
    CityOrMunicipality[]
  >([]);
  const [selectedCitiesOrMunicipalities, setSelectedCitiesOrMunicipalities] =
    useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Axios.get<Province[]>(`https://psgc.gitlab.io/api/provinces/`).then(
      (res) => {
        setProvince(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      }
    );
  }, []);

  useEffect(() => {
    if (selectedProvinceCode) {
      Axios.get<CityOrMunicipality[]>(
        `https://psgc.gitlab.io/api/provinces/${selectedProvinceCode}/cities-municipalities/`
      )
        .then((res) => {
          setCitiesOrMunicipalities(
            res.data.sort((a, b) => a.name.localeCompare(b.name))
          );
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [selectedProvinceCode]);

  const provinceChange = (event: ChangeEvent<{ value: unknown }>) => {
    const newSelectedProvinceCode = event.target.value as string;
    setSelectedProvinceCode(newSelectedProvinceCode);
    setSelectedCitiesOrMunicipalities("");
    setWeatherData(null);
  };

  const handleCityOrMuni = (event: ChangeEvent<{ value: unknown }>) => {
    const newSelectedCityOrMuni = event.target.value as string;
    setSelectedCitiesOrMunicipalities(newSelectedCityOrMuni);
  };

  const handleCheckWeather = () => {
    Axios.get<WeatherData>(
      `${api.base}weather?q=${selectedCitiesOrMunicipalities}&appid=${api.key}&units=metric`
    )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError(`City not found: ${error.message}`);
      });
  };

  const baseUrl = "https://openweathermap.org/img/wn/";

  const imageUrl = `${baseUrl}`;

  console.log("Version 2");

  return (
    <div>
      <AppBar position="relative">
        <Toolbar>
          <NightsStayIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Weather App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Typography variant="h6" align="center">
          <br />
          SELECT A LOCATION
        </Typography>
        <Container align="center">
          <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
            <InputLabel id="demo-simple-select-label">Province</InputLabel>
            <Select
              align="left"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Province"
              onChange={provinceChange}
              value={selectedProvinceCode}
            >
              {province.map((prov) => (
                <MenuItem key={prov.code} value={prov.code}>
                  {prov.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedProvinceCode && (
            <div>
              <Typography variant="h6">CITY/MUNICIPALITY</Typography>
              <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
                <InputLabel id="demo-simple-select-label">
                  City/Municipality
                </InputLabel>
                <Select
                  align="left"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="City/Municipality"
                  onChange={handleCityOrMuni}
                  value={selectedCitiesOrMunicipalities}
                >
                  {citiesOrMunicipalities.map((cityOrMuni) => (
                    <MenuItem key={cityOrMuni.code} value={cityOrMuni.name}>
                      {cityOrMuni.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
          {selectedCitiesOrMunicipalities && (
            <div>
              <br />
              <Button variant="contained" onClick={handleCheckWeather}>
                Check Weather
              </Button>
              <br />
              <br />

              {weatherData ? (
                <div>
                  {/* Use the dynamic image source */}
                  <img
                    src={`${baseUrl}${weatherData.weather[0].icon}@4x.png`}
                    width="150"
                    alt="Weather Icon"
                  />

                  <Typography variant="h2">
                    {weatherData.main.temp || ""}
                    <span style={{ fontSize: "35pt" }}>°С</span>
                  </Typography>

                  <Typography variant="h5">{weatherData.name} </Typography>

                  <br />

                  <div className={styles.weatherDetailsContainer}>
                    {/* Left side: Wind information */}
                    <div className={styles.windContainer}>
                      {/* Wind icon */}
                      <div className={styles.iconContainer}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 256 256"
                        >
                          <path
                            fill="currentColor"
                            d="M184 184a32 32 0 0 1-32 32c-13.7 0-26.95-8.93-31.5-21.22a8 8 0 0 1 15-5.56C137.74 195.27 145 200 152 200a16 16 0 0 0 0-32H40a8 8 0 0 1 0-16h112a32 32 0 0 1 32 32Zm-64-80a32 32 0 0 0 0-64c-13.7 0-26.95 8.93-31.5 21.22a8 8 0 0 0 15 5.56C105.74 60.73 113 56 120 56a16 16 0 0 1 0 32H24a8 8 0 0 0 0 16Zm88-32c-13.7 0-26.95 8.93-31.5 21.22a8 8 0 0 0 15 5.56C193.74 92.73 201 88 208 88a16 16 0 0 1 0 32H32a8 8 0 0 0 0 16h176a32 32 0 0 0 0-64Z"
                          />
                        </svg>
                      </div>

                      {/* Wind speed and title */}
                      <div className={styles.windDetails}>
                        <div className={styles.windSpeed}>
                          {weatherData.wind.speed} m/s
                        </div>
                        <div className={styles.windTitle}>Wind Speed</div>
                      </div>
                    </div>

                    {/* Right side: Humidity information */}
                    <div className={styles.humidityContainer}>
                      {/* Humidity icon */}
                      <div className={styles.iconContainer}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M21.86 12.5A4.313 4.313 0 0 0 19 11c0-1.95-.68-3.6-2.04-4.96C15.6 4.68 13.95 4 12 4c-1.58 0-3 .47-4.25 1.43s-2.08 2.19-2.5 3.72c-1.25.28-2.29.93-3.08 1.95S1 13.28 1 14.58c0 1.51.54 2.8 1.61 3.85C3.69 19.5 5 20 6.5 20h12c1.25 0 2.31-.44 3.19-1.31c.87-.88 1.31-1.94 1.31-3.19c0-1.15-.38-2.15-1.14-3m-1.59 4.77c-.48.49-1.07.73-1.77.73h-12c-.97 0-1.79-.34-2.47-1C3.34 16.29 3 15.47 3 14.5s.34-1.79 1.03-2.47C4.71 11.34 5.53 11 6.5 11H7c0-1.38.5-2.56 1.46-3.54C9.44 6.5 10.62 6 12 6s2.56.5 3.54 1.46C16.5 8.44 17 9.62 17 11v2h1.5c.7 0 1.29.24 1.77.73S21 14.8 21 15.5s-.24 1.29-.73 1.77M8.03 10.45c0-.78.64-1.42 1.42-1.42c.78 0 1.42.64 1.42 1.42c0 .78-.64 1.42-1.42 1.42c-.78 0-1.42-.64-1.42-1.42m7.94 5.1c0 .78-.64 1.42-1.42 1.42c-.78 0-1.42-.64-1.42-1.42c0-.78.64-1.42 1.42-1.42c.78 0 1.42.64 1.42 1.42M14.8 9l1.2 1.2L9.2 17L8 15.8L14.8 9Z"
                          />
                        </svg>
                      </div>

                      {/* Humidity percentage and title */}
                      <div className={styles.humidityDetails}>
                        <div className={styles.humidityPercentage}>
                          {weatherData.main.humidity}%
                        </div>
                        <div className={styles.humidityTitle}>Humidity</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p> {error}</p>
              )}
            </div>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default WeatherApp;
