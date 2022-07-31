// Simply listen for humon events and show data

var btm = g.getHeight() - 1;
var px = g.getWidth() / 2;

// Dark or light logo
var col = (process.env.HWVERSION == 1) ? 65535 : 0;

function onHumon(c) {
  // Large or small font
  var sz = ((process.env.HWVERSION == 1) ? 3 : 2);

  g.setFontAlign(0, 0);
  g.clearRect(0, 32 + 48, g.getWidth(), 32 + 48 + 24 * 4);
  g.setColor(g.theme.dark ? "#CCC" : "#333");  // gray
  g.setFont("6x8", sz).drawString(
      "SmO2: " + c.smo2 + "%", px, 48 + 48);
  g.setFont("6x8", sz).drawString("Zone: " + c.zone, px, 48 + 48 + 24);
}

// Background task will activate once settings are enabled.
function enableSensor() {
  settings = require("Storage").readJSON("humon.json", 1) || {};

  if (!settings.enabled) {
    settings.enabled = true;
    require("Storage").write("humon.json", settings);

    drawBackground("Waiting for\ndata...");
  }
}

function drawBackground(message) {
  g.clear();
  Bangle.loadWidgets();
  Bangle.drawWidgets();
  g.reset().setFont("6x8", 2).setFontAlign(0, 0);
  g.drawString(message, g.getWidth() / 2, g.getHeight() / 2 + 16);
}

Bangle.on('Humon', onHumon);

settings = require("Storage").readJSON("humon.json", 1) || {};

if (!settings.enabled) {
  drawBackground("Sensor off\nBTN" +
                 ((process.env.HWVERSION == 1) ? '2' : '1') + " to enable");
} else {
  drawBackground("Waiting for\ndata...");
}

setWatch(() => { enableSensor(); }, (process.env.HWVERSION == 1) ? BTN2 : BTN1,
         {repeat : false});
