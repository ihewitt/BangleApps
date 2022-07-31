// TODO Change to a generic multiple sensor widget?

(() => {
  var settings = {};
  var count = 0;
  var smo2 = 0;

  // draw your widget
  function draw() {
    if (!settings.enabled)
      return;
    g.reset();
    g.setFont("6x8", 1).setFontAlign(0, 0);
    g.setFontAlign(0, 0);
    g.clearRect(this.x, this.y, this.x + 23, this.y + 23);

    if (count & 1) {
      g.setColor("#00f"); // blu
    } else {
      g.setColor(g.theme.dark ? "#333" : "#CCC"); // off = grey
    }

    g.drawImage(
        atob("DAyBAAHh0js3EuDMA8A8AWBnDj9A8A=="),
        this.x+(24-12)/2,this.y+1);

    g.setColor(g.theme.fg);
    g.drawString(parseInt(smo2), this.x + 24 / 2, this.y + 18);

    g.setColor(-1);
  }

  // Set a listener to 'blink'
  function onHumon(humon) {
    count = count + 1;
    smo2 = humon.smo2;
    WIDGETS["humon"].draw();
  }

  // Called by sensor app to update status
  function reload() {
    settings = require("Storage").readJSON("humon.json", 1) || {};

    Bangle.removeListener('Humon', onHumon);

    if (settings.enabled) {
      WIDGETS["humon"].width = 24;
      Bangle.on('Humon', onHumon);
    } else {
      WIDGETS["humon"].width = 0;
      count = 0;
    }
  }
  // add the widget
  WIDGETS["humon"] = {
    area : "tl",
    width : 24,
    draw : draw,
    reload : function() {
      reload();
      Bangle.drawWidgets(); // relayout all widgets
    }
  };
  // load settings, set correct widget width
  reload();
})()
