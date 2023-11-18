import {tiempoArr, precipitacionArr, uvArr, temperaturaArr} from './static_data.js';

let fechaActual = () => new Date().toISOString().slice(0,10);

let cargarTabla = () => {

  let URLGyeActual = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,precipitation_probability,uv_index"
  fetch(URLGyeActual)
        .then(responseText => responseText.json())
        .then(responseJSON => {

          let arrTime = responseJSON.hourly.time
          let arrTemp = responseJSON.hourly.temperature_2m
          let arrPrecip = responseJSON.hourly.precipitation_probability
          let arrUv = responseJSON.hourly.uv_index
          let actual = fechaActual();
          let datosPrecip = [];
          let datosTemp = [];
          let datosUv = [];

          for(let index = 0; index<arrTime.length; index++){
              const tiempo = arrTime[index];
              const precipitacion = arrPrecip[index];
              const temp = arrTemp[index];
              const uv = arrUv[index];
              if(tiempo.includes(actual)){
                  datosPrecip.push(precipitacion);
                  datosTemp.push(temp);
                  datosUv.push(uv);
              }
          }
          let max = Math.max(...datosPrecip); let maxT = Math.max(...datosTemp); let maxU = Math.max(...datosUv);
          let min = Math.min(...datosPrecip); let minT = Math.min(...datosTemp); let minU = Math.min(...datosUv);
          let sum = datosPrecip.reduce((a, b) => a + b, 0); let sumT = datosTemp.reduce((a, b) => a + b, 0); let sumU = datosUv.reduce((a, b) => a + b, 0);
          let prom = (sum / datosPrecip.length) || 0 ;
          let promT = (sumT / datosTemp.length) || 0 ;
          let promU =  (sumU / datosUv.length) || 0 ;
          let precipitacionMinValue = document.getElementById("precipitacionMinValue");
          let precipitacionPromValue = document.getElementById("precipitacionPromValue");
          let precipitacionMaxValue = document.getElementById("precipitacionMaxValue");

          precipitacionMinValue.textContent = `Min ${min} [mm]`;
          precipitacionMaxValue.textContent = `Max ${max} [mm]`;
          precipitacionPromValue.textContent = `Prom ${ Math.round(prom * 100) / 100 } [mm]`;

          let tempMaxValue = document.getElementById("temperaturaMaxValue");
          let tempMinValue = document.getElementById("temperaturaMinValue");
          let tempPromValue = document.getElementById("temperaturaPromValue");

          tempMinValue.textContent = `Min ${minT} [°C]`;
          tempMaxValue.textContent = `Max ${maxT} [°C]`;
          tempPromValue.textContent = `Prom ${ Math.round(promT * 100) / 100 } [°C]`;

          let uvMaxValue = document.getElementById("uvMaxValue");
          let uvMinValue = document.getElementById("uvMinValue");
          let uvPromValue = document.getElementById("uvPromValue");

          uvMinValue.textContent = `Min ${minU} [--]`;
          uvMaxValue.textContent = `Max ${maxU} [--]`;
          uvPromValue.textContent = `Prom ${ Math.round(promU * 100) / 100 } [--]`;

          
          

})
}


/*let cargarPrecipitacion = () => {

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
*/


let cargarFechaActual = () => {

    let coleccionHTML = document.getElementsByTagName("h6")
    let tituloH6 = coleccionHTML[0]
    tituloH6.textContent = fechaActual()
}

let cargarOpenMeteo = () => {

    let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&timezone=auto";
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
            let labels = responseJSON.hourly.time.slice(0,24);
        
            //Etiquetas de los datos
            let data = responseJSON.hourly.temperature_2m;
            //Objeto de configuración del gráfico
            let config = {
              type: 'line',
              data: {
                labels: labels, 
                datasets: [
                  {
                    label: 'Temperature [2m]',
                    data: data,
                    fill:false,
                    borderColor: 'rgb(99, 207, 207)',
                    tension:0.1 
                  },
                ]
              },
            };
        
            //Objeto con la instanciación del gráfico
            let chart1  = new Chart(plotRef, config);
        
          })

          
                
    .catch(console.error);
}

let cargarOpenMeteo2 = () => {

  let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=relativehumidity_2m&timezone=auto";

    fetch(URL)
        .then(responseText => responseText.json())
        .then(responseJSON => {
        
            //Respuesta en formato JSON
        
            //Referencia al elemento con el identificador plot
            let plotRef = document.getElementById('plot2');
        
            //Etiquetas del gráfico
            let labels = responseJSON.hourly.time.slice(0,24);
        
            //Etiquetas de los datos
            let data = responseJSON.hourly.relativehumidity_2m;
        
            //Objeto de configuración del gráfico
            let config = {
              type: 'bar',
              data: {
                labels: labels, 
                datasets: [
                  {
                    label: 'relativehumidity_2m',
                    data: data, 
                    fill:false,
                    borderColor: "#18d697",
                    backgroundColor: [
                      'rgba(54, 34, 240, 0.3)',
                      'rgba(68, 240, 34, 0.3)',
                      'rgba(255, 150, 203, 0.3)',
                      'rgba(75, 192, 192, 0.3)',
                    ],
                    borderWidth: 3
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
    console.log(cityStorage);
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



cargarTabla()
cargarFechaActual()
cargarOpenMeteo()
cargarOpenMeteo2()
loadForecastByCity()
loadExternalTable()