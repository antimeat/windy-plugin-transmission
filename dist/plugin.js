"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-transmission",
  "version": "1.0.1",
  "author": "Darryl Vink",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/antimeat/windy-plugin-transmission.git"
  },
  "description": "Windy plugin to overlay some locations",
  "displayName": "Transmission lines ",
  "className": "plugin-rhpane plugin-mobile-fullscreen",
  "classNameMobile": "plugin-mobile-bottom-slide",
  "hook": "menu",
  "exclusive": "rhpane"
},
/* HTML */
'<div class="plugin-content"> <h3>Forecast tools:</h3> <p> <ul> <li><a href="http://wa-aifs-local.bom.gov.au/nwp/viewers1.7/combo/" target="combo">Combo Viewer</a></li> <li><a href="http://wa-aifs-local.bom.gov.au/nwp/viewers1.7/comparison/" target="comparison">Model Comparison</a></li> <li><a href="http://aifs-qld.bom.gov.au/local/qld/rfc/pages/marine/waves/auswave_select.php?state=wa" target="auswave_tables">Auswave tables</a></li> </ul> </p> <h3>Obs:</h3> <p> <ul> <li><a href="https://wa-aifs-local.bom.gov.au/panther/#layersHashed=1&Channels-IR=1&Overlays-Lightning=1&Borders-Coast=1&Warnings-Sev%20TS=1&Warnings-Sev%20Wx=1&Alerts-Gusts=1&Alerts-Precip=1&Alerts-Lightning%20%26%20TAFs=1&Alerts-EnR%20squalls=1&Points-EnR=1&Points-EnR%20Custom=1&Points-EnR%20Squalls=1&Points-Ashburton%20Ob%20Sites=1&Borders-Districts=1&Borders-Marine%20Zones=1" target="panther">Panther</a></li> <li><a href="http://wa-aifs-local.bom.gov.au/davink/swell//html/dashboard.php" target="swell_obs">WA buoys wave/tide</a></li> <li><a href="http://wa-aifs-local.bom.gov.au/davink/swell_archive//html/dashboard.php" target="swell_archive">WA buoys wave/tide (archive)</a></li> <li><a href="http://tropic.ssec.wisc.edu/real-time/windmain.php?&basin=austwest&sat=wgms&prod=wvir&zoom=&time" target="simms">Cimms winds</a></li> </ul> </p> <h3>Rainfall:</h3> <p> <ul> <li><a href="http://www.data.jma.go.jp/omaad/rsmc_nowcast/en/hrp/" target="hrp">Heavy rain potential (HRP)</a></li> <li><a href="https://sigma.cptec.inpe.br/scope" target="scope">Scope-Nowcasting</a></li> <li><a href="https://sharaku.eorc.jaxa.jp/GSMaP_NOW/solomon.htm" target="jaxa">JAXA real-time rainfall</a></li> </ul> </p> <h3>Clients:</h3> <p> <ul> <li><a href="http://ssuweb.bom.gov.au/ssu_internal/ssuindex.pl?p=0&login=cws&pwd=cws" target="repository">Customer/forecast repository</a></li> </ul> </p> </div>',
/* CSS */
'.onwindy-plugin-transmission .right-border{right:250px}.onwindy-plugin-transmission #search{display:display-inside}#windy-plugin-transmission{width:250px;height:100%;z-index:10}#windy-plugin-transmission .closing-x{left:initial;font-size:30px;z-index:10;top:0}#windy-plugin-transmission .plugin-content{padding:15px 10px;color:white;font-size:12px;line-height:1.6;background-color:#343d4f}#windy-plugin-transmission .plugin-content ul{margin:20px 20px}#windy-plugin-transmission .plugin-content ul li{text-decoration:none}#windy-plugin-transmission .plugin-content h2{font-style:italic;color:whitesmoke}#windy-plugin-transmission .plugin-content h3{font-style:italic;color:whitesmoke}#windy-plugin-transmission .plugin-content small{display:block}',
/* Constructor */
function () {
  var bcast = W.require('broadcast');

  var store = W.require('store');

  var _ = W.require('utils');

  var map = W.require('map');

  var locations = [['NW Cape', -21.5, 114, "<a href='http://aifs-qld.bom.gov.au/local/qld/rfc/pages/marine/waves/auswave.php?state=wa&site=Enfield', target='auswave'>Auswave</a>", "<a href='http://wa-aifs-local/images/flamingo/flamingo21.50__S%20114.00__E.png', target='flamingo'>flamingo</a>"], ['Offshore Pilbara', -19.58, 116.14, "<a href='http://aifs-qld.bom.gov.au/local/qld/rfc/pages/marine/waves/auswave.php?state=wa&site=Rankin', target='auswave'>Auswave</a>", "<a href='http://wa-aifs-local/images/flamingo/flamingo19.58__S%20116.13__E.png', target='flamingo'>flamingo</a>"], ['Timor sea', -11.07, 126.61, "<a href='http://aifs-qld.bom.gov.au/local/qld/rfc/pages/marine/waves/auswave.php?state=wa&site=Bayu_Undan', target='auswave'>Auswave</a>", "<a href='http://wa-aifs-local/images/flamingo/flamingo11.07__S%20126.61__E.png', target='flamingo'>flamingo</a>"], ['Browse basin', -13.92, 123.22, "<a href='http://aifs-qld.bom.gov.au/local/qld/rfc/pages/marine/waves/auswave.php?state=wa&site=Ichthys', target='auswave'>Auswave</a>", "<a href='http://wa-aifs-local/images/flamingo/flamingo13.92__S%20123.22__E.png', target='flamingo'>flamingo</a>"]];
  console.log('I am being mounted');
  var icon = L.icon({
    className: 'resources-icon',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    opacity: 0.5
  });
  var markers = null;

  var makeMarkers = function makeMarkers() {
    markers.forEach(function (m, i) {
      var _locations$i = _slicedToArray(locations[i], 5),
          name = _locations$i[0],
          lat = _locations$i[1],
          lon = _locations$i[2],
          auswave = _locations$i[3],
          flamingo = _locations$i[4];
    });
  };

  var makeLines = function makeLines() {
    var response = fetch("transmission_lines.json");
    fetch("transmission_lines.json").then(function (response) {
      return response.json();
    }).then(function (data) {
      L.geoJSON(data).addTo(map);
    });
  };

  var createPopup = function createPopup(name, lat, lon, auswave, flamingo) {
    var marker = L.marker([lat, lon], {
      icon: map.myMarkers.icon,
      zIndexOffset: -300
    }).addTo(map);
    marker.bindTooltip(name);
    marker.bindPopup('<br>' + name + '<br>' + auswave + '<br>' + flamingo);
    return marker;
  };

  bcast.on('rqstClose', function () {
    if (!markers) {
      markers = locations.map(function (p) {
        return createPopup(p[0], p[1], p[2], p[3], p[4]);
      });
      bcast.on('redrawFinished', makeMarkers);
    }
  });

  this.onopen = function () {
    if (!markers) {
      markers = locations.map(function (p) {
        return createPopup(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8]);
      });
    }

    bcast.on('redrawFinished', makeLines);
  };

  this.onclose = function () {
    if (markers) {
      markers.forEach(function (m) {
        return map.removeLayer(m);
      });
      bcast.off('redrawFinished', makeMarkers);
      markers = null;
    }

    bcast.off('redrawFinished', makeLines);
  };
});