const fs = require('fs')
const config = require('./config.json')
const fetch = require('node-fetch')
const hash = require("string-hash");
const turf = require('@turf/turf')

async function dump (){
  var vehicles = {}

  var uniques = Object.keys(vehicles).length
  var pings = 0

  if(fs.existsSync('./vehicles.json'))
    vehicles = JSON.parse(fs.readFileSync('./vehicles.json').toString())

  uniques = Object.keys(vehicles).length

  console.log(JSON.stringify(
  turf.featureCollection(
  Object.keys(vehicles).map(id =>{
    pings += vehicles[id].length
    if(vehicles[id].length > 1) {
      var trace = turf.lineString(vehicles[id].map(ping => {
        return ping.location
      }))

      var length = turf.length(trace)
      //if(length > 0.2)
        return trace
    }
  })
  .filter(trace => {
    return trace
  })
  )
  ))

  console.error('unique vehicles: ', uniques)
  console.error('pings: ', pings)
}

dump()
