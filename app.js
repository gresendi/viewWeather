let cities = JSON.parse(localStorage.getItem('cities')) || []
let lastCity = (localStorage.getItem('last')) || ""

renderCities(cities, lastCity)





document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()
  let cityName = document.getElementById('city').value
  let duplicate = false
  cities.forEach(element => {
    if (element.toUpperCase() === cityName.toUpperCase()) {
      duplicate = true
    }
  })
  if (duplicate === false) {
    cities.push(cityName)
    localStorage.setItem('cities', JSON.stringify(cities))
  }

  renderCities(cities, cityName)
  getWeather(cityName)
  lastCity = cityName
  localStorage.setItem('last', lastCity)
  document.getElementById('city').value=''

})

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}


function renderCities(cities, current) {
  let list = document.getElementById("cityList")
  removeAllChildNodes(list)

  cities.forEach(element => {
    let city = document.createElement('button')
    city.type = 'button'
    if (current.toUpperCase() === element.toUpperCase()) {
      city.className = "list-group-item list-group-item-action active city"
    } else {


      city.className = "list-group-item list-group-item-action city"
    }
    city.innerHTML = element
    list.append(city)

  });
  // getWeather(lastCity)

}

document.addEventListener('click', event => {
  if (event.target.classList.contains('city')) {
    let cityName = event.target.innerHTML
    console.log(cityName)
    lastCity= cityName
    renderCities(cities, cityName)
    getWeather(cityName)
    localStorage.setItem('last',lastCity)
  }

})

const getWeather = (city)=>{
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=f0f53dca921e411cb0c59f4206e79a70`)
    .then(res => {
      let icon = res.data.weather[0].icon; // For instance "09d"
     
      let erase = document.getElementById('todaysWeather')
      removeAllChildNodes(erase)
      console.log(res.data)
      let container = document.createElement('div')
      let header = document.createElement('h3')
      header.innerHTML= `
      
      ${res.data.name}
      ${moment().format('l')}
       <img id="wicon" src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
      `
      container.append(header)
      let temperature = document.createElement('p')
      temperature.textContent = `Temperature: ${res.data.main.temp} F`
      container.append(temperature)
      let humidity = document.createElement('p')
      humidity.textContent = `Humidity: ${res.data.main.humidity}%`
      container.append(humidity)
      let windSpeed = document.createElement('p')
      windSpeed.textContent = `Wind Speed: ${res.data.wind.speed} MPH`
      container.append(windSpeed)
      
      document.getElementById('todaysWeather').append(container)
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&exclude=minutely,hourly&units=imperial&appid=f0f53dca921e411cb0c59f4206e79a70`)
      .then(res=>{
        console.log(res)
        let uvIndex = document.createElement('div')
        let uv = res.data.current.uvi
        let uviColor = getColorCodeForUVIndex(uv)
        uvIndex.innerHTML = `<p style= "display: inline-block;">UV Index:    </p><span style= "display: 'inline-block'; background-color:${uviColor};margin:4px; padding: 5px; text-align:center;">    ${uv}</span>`
        
        container.append(uvIndex)


        let container2 = document.createElement('div')
        container2.innerHTML=`
        <h4 class = 'ms-3'>5-Day Forcast</h4>
        `
        removeAllChildNodes(document.getElementById('daily'))
        document.getElementById('daily').append(container2)
       
        for(i=1; i<6;i++)
        {
          let card = document.createElement('div')
          let icon = res.data.daily[i].weather[0].icon

          card.style.display = "inline-block"
          card.className ="card bg-primary text-white m-3"
          // card.style.backgroundColor = "blue"
          // card.style.cssText = 'color:white; background-color:blue'
          card.style.width = '10rem'
          // card.style.margin = '10px;'
          card.style.justifyContent ="space-between"
          card.innerHTML=`
          
          <div class="card-body">
         <h5 class="card-title">${moment().add(i,'days').format('l')}</h5>
         <img id="wicon" src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
          <p class="card-text">Temperature: ${ res.data.daily[i].temp.day } F
          </p>
          <p class="card-text">Humidity: ${res.data.daily[i].humidity}% </p>
          
           </div>
          
          
          
          `
          
          container2.append(card)
          
        }


      }).catch(function (error) {
        console.error(error);
      })







    }).catch(function (error) {
      console.error(error);
    })
}


function getColorCodeForUVIndex(uvIndex) {
  var uvIndexValue = parseFloat(uvIndex);
  var colorcode = "";
  if (uvIndexValue <= 2) {
    colorcode = "#00ff00";
  }
  else if ((uvIndexValue > 2) && (uvIndexValue <= 5)) {
    colorcode = "#ffff00";
  }
  else if ((uvIndexValue > 5) && (uvIndexValue <= 7)) {
    colorcode = "#ffa500";
  }
  else if ((uvIndexValue > 7) && (uvIndexValue <= 10)) {
    colorcode = "#9e1a1a";
  }
  else if (uvIndexValue > 10) {
    colorcode = "#7f00ff";
  }
  return colorcode;
}
getWeather(lastCity)