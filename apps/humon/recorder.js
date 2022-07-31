(function(recorders) {
  recorders.humon = function() {
    var smo2 = "", zone = "";
    var hasHumon = false;
    function onHumon(c) {
        smo2=c.smo2;
        zone=c.zone;
        hasHumon = true;
    }
    return {
      name : "Humon",
      fields : ["SmO2","Zone"],
      getValues : () => {
        var r = [smo2,zone];
        smo2 = "";
        zone = "";
        return r;
      },
      start : () => {
        hasHumon = false;
        Bangle.on('Humon', onHumon);
      },
      stop : () => {
        hasHumon = false;
        Bangle.removeListener('Humon', onHumon);
      },
      draw : (x,y) => g.setColor(hasHumon?"#fff":"#888").drawImage(atob("AAwMAc/4fwfgcA4IQMQcA8A+B/H//w=="),x,y)
    };
  }
})

