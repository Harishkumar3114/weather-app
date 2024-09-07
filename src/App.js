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


const Weather=({icon,country,city,latitude,longitude,degree}) => {
  return(
    <>
      <Stack
        sx={{marginTop:'10%',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center'
        }}>
          <img src={icon} style={{height:'100px',width:'100px'}} />
          <Typography sx={{paddingTop:'5%',fontSize:'20px',fontWeight:'700'}} >{degree}*C</Typography>
          <Typography sx={{fontSize:'35px',color:'rgb(254, 200, 10)',fontWeight:'500'}}>{city}</Typography>
          <Typography>{country}</Typography>
          </Stack>
         <Typography 
         sx={{display:'flex',
          alignItems:'center',
          justifyContent:'space-around',
          paddingLeft:'25%',
          paddingRight:'25%',
          paddingTop:'5%'
         }}>
          <div style={{display:'flex',
          flexDirection:'column',
          alignItems:'center',
          fontWeight:'500'
          }}>
            <div>
              Latitude
            </div>
            <div>
              {latitude}
            </div>
          </div>
          <div style={{display:'flex',
          flexDirection:'column',
          alignItems:'center',
          fontWeight:'500'
          }}>
            <div>
              Longitude
            </div>
            <div>
              {longitude}
            </div>
          </div>
         </Typography>
         
    </>
  )
}



function App() {
  let api_key= `0f97ecbbc1b131432444271043071fb2`;

  const [icon,setIcon] = useState(cloudy);
  const [text,setText]=useState('Madurai')
  const [degree,setdegree] = useState(0);
  const [city,setcity]=useState('');
  const [country,setCountry]=useState("");
  const [latitude,setLatitude] = useState(0);
  const [longitude,setLongitude]=useState(0);

  const [cityNotFound,setCityNotFound] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const search = async()=> {
    setLoading(true);
    setError(null);
    setCityNotFound(false);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
    
    try{
      let res = await fetch(url);
      let data = await res.json();
      //console.log(data);
      if(data.cod=="404"){
        console.error("City not found"); 
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setdegree(Math.floor(data.main.temp));
      setcity(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);

    }catch(error){
      console.log("An error occured",error.message);
      setError("An error occured while fetching data")
    }finally{
      setLoading(false)
    }
  }
  
  const handleCity = (e)=> {
    setText(e.target.value);
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  useEffect(function(){
    search()
  },[])
  return ( 
    <>
    <div className='container'>
      <Box 
      sx={{width:'25rem',
      minHeight:'70vh',
      backgroundColor:'white',
      borderRadius:'20px',
      padding:'5%'
      }}>
        <Typography
         sx={{display:'flex',
          alignItems:'center',
          justifyContent:'center',
          border:'2px solid rgb(79, 220, 255)',
          borderRadius:'5px',
          padding:'2px',
          overflow:'hidden'
         }}>
          <input placeholder='search the city' 
          value={text}
          onChange={handleCity}
          onKeyDown={handleKeyDown}
           style={{border:'none',flex:'1',fontSize:'16px',outline:'none',padding:'0px 0px 0px 10px'}} />
          <SearchIcon onClick={() => {search()}} sx={{cursor:'pointer',padding:'0px 10px 0px 0px'}}/>
        </Typography>
        {!loading && !cityNotFound && < Weather icon={icon} degree={degree} city={city} latitude={latitude} longitude={longitude} country={country} /> }
        { loading && <div className='loading-message'>Loading...</div>}
        { error && <div className='error-message'>{error}</div>}
        { cityNotFound &&  <div className='city-not-found'>city not found</div>}
      </Box>
    </div>
    </>
  );
}

export default App;

