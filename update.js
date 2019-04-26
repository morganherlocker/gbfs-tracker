const fs = require('fs')
const config = require('./config.json')
const fetch = require('node-fetch')
const hash = require("string-hash");
const turf = require('@turf/turf')

async function update (){
  var vehicles = {}

  if(fs.existsSync('./vehicles.json'))
    vehicles = JSON.parse(fs.readFileSync('./vehicles.json').toString())

  for (let api of config.apis) {
    try {
      var time = (new Date).getTime();
      const response = await fetch(api)
      var json = await response.json()
      if(json.data) json = json.data


      if(json.bikes && json.bikes.length) {
        json.bikes.forEach(bike => {
          var id = hash(api + '!' + bike.bike_id)

          const ping = {
            id: id,
            time: time,
            location: [+bike.lon, +bike.lat]
          }

          if(!vehicles[id]) vehicles[id] = [ping]
          else {
            if (
              JSON.stringify(vehicles[id][vehicles[id].length - 1].location) !==
              JSON.stringify(ping.location)
            ) {
              vehicles[id].push(ping)
            }
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  fs.writeFileSync('./vehicles.json', JSON.stringify(vehicles))
}


update()
