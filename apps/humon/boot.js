//
// If enabled in settings run constantly in background
//
(function() {
//var log = function() {};//print
var log=print;
var settings = {};
var device;
var gatt;
var service;
var characteristic;

class HumonSensor {
  constructor() {
    this.unit = "";
    this.smo2 = -1;
    this.zone = -1;
  }

  updateSensor(event) {
    if (event.target.uuid == "0000deef-1212-efde-1523-785fef13d123") {
        
      var dv = event.target.value;
      n = new Float32Array(event.target.value.buffer);

      this.unit = "%";
      this.smo2 = n[2].toFixed(2)*100;
      this.zone = n[3].toFixed(2);

      Bangle.emit('Humon',
                  {smo2 : this.smo2, zone : this.zone, unit : this.unit});
    }
  }
}

var mySensor = new HumonSensor();

/*    NRF.requestDevice({active:true,timeout : 20000, filters : [ {namePrefix : 'CORE'} ]})
      .then(function(d) {
        device = d;
        log("Found device");
        return device.gatt.connect();
      })
      .then(function(g) {
        gatt = g;*/

function connection_setup() {
    log("Scanning for Humon sensor...");
    NRF.connect("df:65:3c:a2:f6:a5 random") //TODO change to seach for service/id/name/etc
      .then(function(g) {
      gatt = g;

        return gatt.getPrimaryService('0000f00d-1212-efde-1523-785fef13d123');
      })
      .then(function(s) {
        service = s;
        return service.getCharacteristic('0000deef-1212-efde-1523-785fef13d123');
      })
      .then(function(c) {
        characteristic = c;
        characteristic.on('characteristicvaluechanged',
                          (event) => mySensor.updateSensor(event));
        return characteristic.startNotifications();
      })
      .then(function() {
        log("Done!");
      })
      .catch(function(e) {
        log(e.toString(), "ERROR");
        log(e);
      });
}

function connection_end() {
  if (gatt != undefined)
    gatt.disconnect();
}

settings = require("Storage").readJSON("humon.json", 1) || {};
log("Settings:");
log(settings);

if (settings.enabled) {
  connection_setup();
  NRF.on('disconnect', connection_setup);
}

E.on('kill', () => { connection_end(); });

})();
