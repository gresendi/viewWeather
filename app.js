let cities = JSON.parse(localStorage.getItem('cities')) || []

renderCities(cities, "")




document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()
  let cityName = document.getElementById('city').value
  let duplicate = false
  cities.forEach(element =>{
    if(element.toUpperCase() ===cityName.toUpperCase()){
      duplicate = true
    }
  })
  if(duplicate === false){
    cities.push(cityName)
    localStorage.setItem('cities', JSON.stringify(cities))
  }
  
  renderCities(cities, cityName)

})

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}


function renderCities(cities, current){
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
    city.innerHTML= element
    list.append(city)

  });
  
}

document.addEventListener('click',event=>{
  if(event.target.classList.contains('city')){
    let cityName = event.target.innerHTML
    console.log(cityName)
    renderCities(cities,cityName)
  }

})