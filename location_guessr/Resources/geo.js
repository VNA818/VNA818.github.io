$(document).ready(function() {

const url = window.location; 
const urlObject = new URL(url);
const multi = urlObject.searchParams.get('multi_mode'); //ex- https://vna818.github.io/location_guessr/?game_mode=5r_game
var loc_select;
var loc2;
$( '.sender' ).hide();
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
  streetViewControl: false,
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
    document.getElementById("check2").disabled = false;
    loc_select=mapsMouseEvent.latLng.toJSON();
  });
}
function initMap2(clat,clng,alat,alng) {
  // The map, centered on Central Park
  const center = {lat: alat, lng: alng};
  const options = {zoom: 3, scaleControl: true, streetViewControl: false, center: center};
  map = new google.maps.Map(
      document.getElementById('mappick'), options);
  // Locations of landmarks
  const dakota = {lat: alat, lng: alng};
  const frick = {lat: clat, lng: clng};
  var line = new google.maps.Polyline({path: [dakota, frick], map: map});
  // The markers for The Dakota and The Frick Collection
  var mk1 = new google.maps.Marker({position: dakota, map: map});
  var mk2 = new google.maps.Marker({position: frick, map: map});
  mk1.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
  /*
  let infoWindow = new google.maps.InfoWindow({
    content: "Street view location!",
    position: center,
  });
  infoWindow.open(map);
  */
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
  var choice = String(Math.floor(Math.random() * parseInt(loc_info.locations.size.csize))); 
  loc_info=loc_info.locations[choice];
  let location = [loc_info.lat,loc_info.long];
  return location;
}
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
      fullscreenControl: false,
      panControl: true,
      panControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      enableCloseButton: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },

    }
  );
}

function run(){
  document.getElementById("check2").disabled = true;
  var status=7;
   loc_select=0;
initPano(59.33622, 18.05637);
if(multi==null){
var loc;
loc=randloc();
}else{
  var loc=loc2;
}
//alert("Location found!");
initPano(parseFloat(loc[0]), parseFloat(loc[1]));
initMap();
$(".rth").click(function() {
    initPano(parseFloat(loc[0]), parseFloat(loc[1]));
  });
$(".check2").click(function() {
    initMap2(loc_select.lat,loc_select.lng,parseFloat(loc[0]), parseFloat(loc[1]));
  });
}
function multiplayer(){
  if(multi=="rec"){
    var inits=false;
  alert("reciever");

  var peer = new Peer(); 
  peer.on('open', function(id) {
      alert('My peer ID is: ' + id);
  });
  peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'

    alert("Recieved:");
    alert(data);

    var conn = peer.connect(data);
 
 conn.on('open', function(){
  alert("connected to "+sq);
  loc2=randloc();
  conn.send(loc2);
  run();
  // here you have conn.id
  /*
  run();
  alert("sending loc");
  if(inits==false){
    alert("sending loc");
    conn.send(loc);
    inits=true;
  }
  */
  
});

  });


});
  
}
if (multi=="send"){
  var initr=false;
  $( '.sender' ).show();
  alert("sender");
  var pid;
  var sq="";
  var peer = new Peer(); 
  peer.on('open', function(id) {
      //alert('My peer ID is: ' + id);
      pid=id;
  });

  $("#submitButton").click(function() {

    var sq= $("#search").val();

 var conn = peer.connect(sq);
 
 conn.on('open', function(){
  alert("connected to "+sq);
  // here you have conn.id
  conn.send(pid);
});

  });

peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'

    alert("Recieved:");
    alert(data);
    if(initr==false){
       loc2=data;
      run();
      initr=true;
    }
 
  });


});

}
}
//-----------------end of functions------------------
if(multi=="rec"||multi=="send"){
  multiplayer();
}
else{
  run();
}
/*
//for 5 round game
for (int i=0;i<6;i++){
  run();
}
*/
//why is run() here running twice with prev loc

$(".reload").click(function() {
    window.location.reload();
  });

});