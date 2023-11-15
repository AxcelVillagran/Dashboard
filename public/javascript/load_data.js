import {tiempoArr, precipitacionArr, uvArr, temperaturaArr} from './static_data.js';

let fechaActual = () => new Date().toISOString().slice(0,10);

let cargarPrecipitacion = () => {

    let actual = fechaActual();
    let datos = [];

    for(let index = 0; index<tiempoArr.length; index++){
        const tiempo = tiempoArr[index];
        const precipitacion = precipitacionArr[index];
        if(tiempo.includes(actual)){
            datos.push(precipitacion);
        }
    }
    let max = Math.max(...datos);
    let min = Math.min(...datos);
    let sum = datos.reduce((a, b) => a + b, 0);
    let prom = (sum / datos.length) || 0 ;
    
    let precipitacionMinValue = document.getElementById("precipitacionMinValue");
    let precipitacionPromValue = document.getElementById("precipitacionPromValue");
    let precipitacionMaxValue = document.getElementById("precipitacionMaxValue");

    precipitacionMinValue.textContent = `Min ${min} [mm]`;
    precipitacionMaxValue.textContent = `Max ${max} [mm]`;
    precipitacionPromValue.textContent = `Prom ${ Math.round(prom * 100) / 100 } [mm]`;
}



let cargarFechaActual = () => {

    let coleccionHTML = document.getElementsByTagName("h6")
    let tituloH6 = coleccionHTML[0]
    tituloH6.textContent = fechaActual()
}

let cargarOpenMeteo = () => {

    let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&timezone=auto";
    let URL2 = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=relativehumidity_2m&timezone=auto";
    /*let respuesta2 = fetch(URL2)
    let respuesta2text = respuesta2.text();
    let respuesta2JSON = respuesta2text.json(); */
    fetch(URL)
        .then(responseText => responseText.json())
        .then(responseJSON => {
        
            //Respuesta en formato JSON
        
            //Referencia al elemento con el identificador plot
            let plotRef = document.getElementById('plot1');
        
            //Etiquetas del gráfico
            let labels = responseJSON.hourly.time;
        
            //Etiquetas de los datos
            let data = responseJSON.hourly.temperature_2m;
            let data2 = responseJSON.hourly.relativehumidity_2m;
            //Objeto de configuración del gráfico
            let config = {
              type: 'line',
              data: {
                labels: labels, 
                datasets: [
                  {
                    label: 'Temperature [2m]',
                    data: data, 
                  },
                  {
                    label: 'Relative Humidity [2m]',
                    data: data2, 
                  }
                ]
              },
            };
        
            //Objeto con la instanciación del gráfico
            let chart1  = new Chart(plotRef, config);
        
          })
          /*let URL2 = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=relativehumidity_2m&timezone=auto";

          fetch(URL2)
              .then(responseText => responseText.json())
              .then(responseJSON => {
              
                  //Respuesta en formato JSON
              
                  //Referencia al elemento con el identificador plot
                  let plotRef = document.getElementById('plot2');
              
                  //Etiquetas del gráfico
                  let labels = responseJSON.hourly.time;
              
                  //Etiquetas de los datos
                  let data = responseJSON.hourly.relativehumidity_2m;
                  let data2= responseJSON.hourly.temperature_2m
                  //Objeto de configuración del gráfico
                  let config2 = {
                    type: 'line',
                    data: {
                      labels: labels, 
                      datasets: [
                        {
                          label: 'relativehumidity_2m',
                          data: data, 
                        }
                      ]
                    }
                  };
              
                  //Objeto con la instanciación del gráfico
                  let chart2  = new Chart(plotRef, config2);
              
                })  
                */    
    .catch(console.error);
}

let cargarOpenMeteo2 = () => {

    let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=precipitation_probability&timezone=auto";

    fetch(URL)
        .then(responseText => responseText.json())
        .then(responseJSON => {
        
            //Respuesta en formato JSON
        
            //Referencia al elemento con el identificador plot
            let plotRef = document.getElementById('plot2');
        
            //Etiquetas del gráfico
            let labels = responseJSON.hourly.time;
        
            //Etiquetas de los datos
            let data = responseJSON.hourly.relativehumidity_2m;
        
            //Objeto de configuración del gráfico
            let config = {
              type: 'line',
              data: {
                labels: labels, 
                datasets: [
                  {
                    label: 'relativehumidity_2m',
                    data: data, 
                  }
                ]
              }
            };
        
            //Objeto con la instanciación del gráfico
            let chart2  = new Chart(plotRef, config);
        
          })
    .catch(console.error);
}

let parseXML = (responseText) => {

  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText,"application/xml");
  let forecastElement = document.querySelector("#forecastbody")
  forecastElement.innerHTML = ''
  let timeArr = xml.querySelectorAll("time")
  timeArr.forEach(time => {
        
    let from = time.getAttribute("from").replace("T", " ")

    let humidity = time.querySelector("humidity").getAttribute("value")
    let windSpeed = time.querySelector("windSpeed").getAttribute("mps")
    let precipitation = time.querySelector("precipitation").getAttribute("probability")
    let pressure = time.querySelector("pressure").getAttribute("value")
    let cloud = time.querySelector("clouds").getAttribute("all")

    let template = `
        <tr>
            <td>${from}</td>
            <td>${humidity}</td>
            <td>${windSpeed}</td>
            <td>${precipitation}</td>
            <td>${pressure}</td>
            <td>${cloud}</td>
        </tr>
    `

    //Renderizando la plantilla en el elemento HTML
    forecastElement.innerHTML += template;
})
  console.log(xml);
}

let selectListener = async (event) => {

  let selectedCity = event.target.value;
  let cityStorage = localStorage.getItem(selectedCity);
  
  if (cityStorage==null){
  try {
    let APIkey = "2e9e59a323a5bcce0c24581ea4755f0b";
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`
    let response = await fetch(url);
    let responseText = await response.text();

    await parseXML(responseText);
    await localStorage.setItem(selectedCity,responseText);

  }catch (error){

    console.log(error);
  }
  
  }else{
    parseXML(cityStorage);
  }
  console.log(selectedCity);
}

let loadForecastByCity = () => {

  let selectElement = document.querySelector("select")
  selectElement.addEventListener("change", selectListener)
}
let loadExternalTable = async() => {

  let proxyURL = 'https://cors-anywhere.herokuapp.com/'
  let URLTabla = 'https://www.gestionderiesgos.gob.ec/monitoreo-de-inundaciones/'
  let endpoint = proxyURL + URLTabla
  let respuesta = await fetch(endpoint)
  let respuestaText = await respuesta.text()
  const parser = await new DOMParser();
  const xml2 = await parser.parseFromString(respuestaText,"text/html");
  let elementoXML = await xml2.querySelector("#postcontent table")
  let elementoDOM = document.getElementById("monitoreo")
  elementoDOM.innerHTML = elementoXML.outerHTML
}



cargarPrecipitacion()
cargarFechaActual()
cargarOpenMeteo()
//cargarOpenMeteo2()
loadForecastByCity()
loadExternalTable()