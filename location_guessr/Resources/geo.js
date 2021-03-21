var loc_select;
function haversine_distance(mk1, mk2) {
      var R = 3958.8; // Radius of the Earth in miles
      var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
      var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
      }
function initMap() {
  const myLatlng = { lat: -25.363, lng: 131.044 };
  const mappick = new google.maps.Map(document.getElementById("mappick"), {
    zoom: 1,
    center: myLatlng,
  });
  // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to guess a location",
    position: myLatlng,
  });
  infoWindow.open(mappick);
  // Configure the click listener.
  mappick.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infoWindow.open(mappick);
    loc_select=mapsMouseEvent.latLng.toJSON();
  });
}
function initMap2(clat,clng,alat,alng) {
  // The map, centered on Central Park
  const center = {lat: alat, lng: alng};
  const options = {zoom: 3, scaleControl: true, center: center};
  map = new google.maps.Map(
      document.getElementById('mappick'), options);
  // Locations of landmarks
  const dakota = {lat: alat, lng: alng};
  const frick = {lat: clat, lng: clng};

  var line = new google.maps.Polyline({path: [dakota, frick], map: map});
  // The markers for The Dakota and The Frick Collection
  var mk1 = new google.maps.Marker({position: dakota, map: map});
  var mk2 = new google.maps.Marker({position: frick, map: map});
    var distance = haversine_distance(mk1, mk2);
  document.getElementById('msg').innerHTML = "Your guess was: " + distance.toFixed(2) + " miles off!";
  alert("Your guess was: " + distance.toFixed(2) + " miles off!");
}
  



function randloc(){
  var jsonfile2 = "https://vna818.github.io/location_guessr/Resources/data_ctemp.JSON";
//  var jsonfile2 = "http://localhost/geotest/data_ctemp.JSON";
  var valuel= $.ajax({ 
      url: jsonfile2, 
      async: false
   }).responseText;
   var loc_info=JSON.parse(valuel);
 

  var choice = String(Math.floor(Math.random() * 1500)); 
  
  loc_info=loc_info.locations[choice];
  let location = [loc_info.lat,loc_info.long];
  return location;


}
function loc_check(location){
  /*
var jsonfile = "https://maps.googleapis.com/maps/api/streetview/metadata?size=600x300&location="+location[0]+","+location[1]+"&key=AIzaSyBLIjV_yPuibS6by1Lt-fIADrX1NVJHBUA";
 //alert(jsonfile)
 var dstatus;
  var value= $.ajax({ 
      url: jsonfile, 
      async: false
   }).responseText;
   dstatus=JSON.parse(value);
   //alert(dstatus.status);
  return String(dstatus.status);
  */
 }
  

$(document).ready(function() {

  function initPano(ilat,ilon) {
  // Note: constructed panorama objects have visible: true
  // set by default.
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("map"),
    
    {
      position: { lat: ilat, lng: ilon },
      addressControl: false,
      linksControl: false,

      showRoadLabels: false,
      panControl: false,
      enableCloseButton: false,
    }

  );
}

  var status=7;
initPano(59.33622, 18.05637);
//var check=loc_check(loc);
//alert(randloc());


var loc;


  loc=randloc();


alert("Location found!");


initPano(parseFloat(loc[0]), parseFloat(loc[1]));


initMap();
$(".check").click(function() {
    alert(loc_select.lng);
  });

$(".check2").click(function() {
    initMap2(loc_select.lat,loc_select.lng,parseFloat(loc[0]), parseFloat(loc[1]));

  });
});