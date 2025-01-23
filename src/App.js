import React, { useEffect, useState } from 'react';
import './App.css';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Stack, Typography } from '@mui/material';
import wind from '../src/assests/wind.png';
import cloudy from '../src/assests/cloudy.png';
import humidity from '../src/assests/humidity.png';
import sun from '../src/assests/sun.png';
import rainy from '../src/assests/rainy-day.png';
import snow from '../src/assests/snow.png';
import tornado from '../src/assests/tornado.png';
import smoke from '../src/assests/smoke.png';
import sunnyVideo from '../src/assests/sunnyvideo.mp4'
import tornadoVideo from '../src/assests/tornado.mp4';
import snowyVideo from '../src/assests/snowy.mp4';
import rainyVideo from '../src/assests/rainyvideo.mp4';
import cloudyVideo from '../src/assests/cloud.mp4';

const Weather = ({ icon, country, city, latitude, longitude, degree }) => {
  return (
    <>
      <Stack
        sx={{
          marginTop: '10%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={icon} style={{ height: '100px', width: '100px' }} />
        <Typography sx={{ paddingTop: '5%', fontSize: '20px', fontWeight: '700' }}>
          {degree}°C
        </Typography>
        <Typography
          sx={{ fontSize: '35px', color: 'rgb(254, 200, 10)', fontWeight: '500' }}
        >
          {city}
        </Typography>
        <Typography>{country}</Typography>
      </Stack>
      <Typography
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: '20px', // Add gap to create space
    paddingTop: '5%',
  }}
>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontWeight: '500',
    }}
  >
    <div>Latitude</div>
    <div>{latitude}</div>
  </div>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontWeight: '500',
    }}
  >
    <div>Longitude</div>
    <div>{longitude}</div>
  </div>
</Typography>

    </>
  );
};

function App() {
  const api_key = `0f97ecbbc1b131432444271043071fb2`;

  const [icon, setIcon] = useState(sun);
  const [backgroundVideo, setBackgroundVideo] = useState(sunnyVideo);
  const [text, setText] = useState('Madurai');
  const [degree, setdegree] = useState(0);
  const [city, setcity] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherConditions = {
    Clear: { icon: sun, video: sunnyVideo },
    Clouds: { icon: cloudy, video: cloudyVideo },
    Rain: { icon: rainy, video: rainyVideo },
    Drizzle: { icon: rainy, video: rainyVideo },
    Thunderstorm: { icon: rainy, video: rainyVideo },
    Snow: { icon: snow, video: snowyVideo },
    Mist: { icon: smoke, video: cloudyVideo },
    Smoke: { icon: smoke, video: cloudyVideo },
    Haze: { icon: smoke, video: cloudyVideo },
    Dust: { icon: smoke, video: cloudyVideo },
    Fog: { icon: smoke, video: cloudyVideo },
    Sand: { icon: smoke, video: cloudyVideo },
    Ash: { icon: smoke, video: cloudyVideo },
    Squall: { icon: tornado, video: cloudyVideo },
    Tornado: { icon: tornado, video: cloudyVideo },
  };

  useEffect(() => {
    console.log('Background video updated:', backgroundVideo);
  }, [backgroundVideo]);

  const search = async () => {
    setLoading(true);
    setError(null);
    setCityNotFound(false);
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.cod === '404') {
        setCityNotFound(true);
        setLoading(false);
        setBackgroundVideo(sunnyVideo); // Fallback for city not found
        return;
      }
  
      setdegree(Math.floor(data.main.temp));
      setcity(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
  
      const weatherMain = data.weather[0].main;
      const weatherData = weatherConditions[weatherMain] || {
        icon: sun,
        video: sunnyVideo,
      };
  
      setIcon(weatherData.icon);
      setBackgroundVideo(weatherData.video);
  
    } catch (error) {
      setError('An error occurred while fetching data');
      setBackgroundVideo(sunnyVideo); // Fallback for API error
    } finally {
      setLoading(false);
    }
  };
  

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <div className="container">
      <video
        key={backgroundVideo} // Force re-render when `backgroundVideo` changes
        autoPlay
        loop
        muted
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: '-1',
          
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>


      <Box
        sx={{
          width: '25rem', // Ensure this matches your design requirements
          minHeight: '70vh',
          backgroundColor: 'white',
          opacity:'0.8',
          borderRadius: '20px',
          padding: '5%',
          position: 'relative',
          zIndex: '1',
          boxSizing: 'border-box', // Ensures padding doesn't affect the overall width
          margin: '0 auto', // Center the box horizontally
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgb(79, 220, 255)',
              borderRadius: '5px',
              padding: '2px',
              overflow: 'hidden',
            }}
          >
            <input
              placeholder="search the city"
              value={text}
              onChange={handleCity}
              onKeyDown={handleKeyDown}
              style={{
                border: 'none',
                flex: '1',
                fontSize: '16px',
                outline: 'none',
                padding: '0px 0px 0px 10px',
              }}
            />
            <SearchIcon
              onClick={() => {
                search();
              }}
              sx={{ cursor: 'pointer', padding: '0px 10px 0px 0px' }}
            />
          </Typography>
          {!loading && !cityNotFound && (
            <Weather
              icon={icon}
              degree={degree}
              city={city}
              latitude={latitude}
              longitude={longitude}
              country={country}
            />
          )}
          {loading && <div className="loading-message">Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          {cityNotFound && <div className="city-not-found">City not found</div>}
        </Box>
      </div>
    </>
  );
}

export default App;
