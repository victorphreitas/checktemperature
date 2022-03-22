//here we require express js which is the frame work for node js
const express = require("express");
//require the https object so we can get data from the api
const https = require("https");
//require body-parser in order to catch data from the form
const bodyParser = require("body-parser");
//json parser
const jsonParser = bodyParser.json();
//requiring absolute path
const path = require('path')
//app is the express function
const app = express();
//port we use to host our application
const port = process.env.PORT || 8080;
//listening the port here
app.listen(port, function(){
  console.log(`The server is running on port ${port}.`) 
})
//connecting css external file 
app.use('/public', express.static(path.join(__dirname, 'public')))

//get method sending information to the index.html file 
app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html")
})

app.use(bodyParser.urlencoded({ extended: false }))

//post method that is connected to elements in the index.html
app.post("/", function(req,res){
  const cityName = req.body.city;

  req.body.city = "";

  https.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=c26ae63fb3faa0a223918da72fed11a2`, function(response){
    let data = "";
   
    response.on("data", function(chunk){
      data += chunk
      let dataObj = JSON.parse(data)
      // console.log(dataObj.main.temp)
      // console.log(dataObj.name)
      // console.log(dataObj.wind.speed)
      // console.log(dataObj.weather[0].description)
      let newTemp = (dataObj.main.temp - 273).toFixed(2)
      let newTempFeel = (dataObj.main.feels_like - 273).toFixed(2)
      let windSpeed = ((dataObj.wind.speed)*3.6).toFixed(2)

      res.send(`
      <style>
      body{
        background-image: url('https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        height: 100vh; 
      }
      h3{
        margin: 13% 20px 0 20px; 
        font-size: 50px;
        color: #C1F4C5;
      }
      a {
        font-size: 20px;
        color: #C1F4C5;
        margin-left: 20px;
        margin-top: 5px;
      }
      a:hover {
        font-size: 20px;
        color: #65C18C; 
      }
      </style>
      <h3>${dataObj.name} is ${newTemp}C and it is showing ${dataObj.weather[0].description} but it feels like ${newTempFeel}C and humidity is ${dataObj.main.humidity}g.kg-1 and the wind speed is ${windSpeed}km/h</h3>
      <a href="http://localhost:8080/">Go Back</a>
      `) 
    })

  })
})
