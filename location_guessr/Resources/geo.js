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
  var res = "0";
  var lat = (Math.random()*90) ; //
  lat *= Math.round(Math.random()) ? 1 : -1;
  var long = (Math.random()*180) ; // t
  long *= Math.round(Math.random()) ? 1 : -1;
  while (long>-80&&long<-124){
    long = (Math.random()*180) ; // this will get a number between 1 and 99;
  long *= Math.round(Math.random()) ? 1 : -1;
  }
  while (lat<25&&lat>48){
    lat = (Math.random()*180) ; // this will get a number between 1 and 99;
  lat *= Math.round(Math.random()) ? 1 : -1;
  }
  //alert("lat:"+lat+"long:"+long);
  let location = [String(lat),String(long)];

  
  //return(location);
  return location;


}
function loc_check(location){
  
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
var loc1;
while (loc1!="OK"){
  loc=randloc();
  loc1=loc_check(loc);
}
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