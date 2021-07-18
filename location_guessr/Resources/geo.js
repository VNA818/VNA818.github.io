$(document).ready(function() {
//$( '#sidemenu' ).hide();
$( '.sender' ).hide();
$( '#msg2' ).hide();
const url = window.location; 
const urlObject = new URL(url);
const multi = urlObject.searchParams.get('multiplayer');
const prid = urlObject.searchParams.get('prid');
const oprid = urlObject.searchParams.get('oprid');
const shareid = urlObject.searchParams.get('shareid');
 //ex- https://vna818.github.io/location_guessr/?game_mode=5r_game
var loc_select;
var loc2;
var conn;
var peer;
var opploc=null;
var mydist;
var sl=false;
var oppdist=null;
var shrchoice;

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
 // var mk1 = new google.maps.Marker({position: dakota, map: map});
 // var mk2 = new google.maps.Marker({position: frick, map: map});
//mk1.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

  mk1 = new google.maps.Marker({
        position: dakota,
        icon: {
     url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
     labelOrigin: { x: 12, y: -10}
      },
        map: map,
        label: {
     text: "Actual location",
     color: '#222222',
     fontSize: '12px'
    }
    });

  mk2 = new google.maps.Marker({
        position: frick,
        icon: {
     url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
     labelOrigin: { x: 12, y: -10}
      },
        map: map,
        label: {
     text: "Your guess",
     color: '#222222',
     fontSize: '12px'
    }
    });

  
    if(opploc!=null){

    const falcon = {lat: opploc[0], lng: opploc[1]};
   // var mk3 = new google.maps.Marker({position: falcon, map: map});
   // mk3.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');

    marker = new google.maps.Marker({
        position: falcon,
        icon: {
     url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
     labelOrigin: { x: 12, y: -10}
      },
        map: map,
        label: {
     text: "Opponent",
     color: '#222222',
     fontSize: '12px'
    }
    });
    so=true;
  }
    var distance = haversine_distance(mk1, mk2);
    mydist=distance;
    document.getElementById("shrbtn").disabled = false;
   if(oppdist!=null){
      if(oppdist<mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Winner!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Loser!) was: " + distance.toFixed(2) + " miles off!";
  }else if (oppdist==mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Tie!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Tie!) was: " + distance.toFixed(2) + " miles off!";
  }else if (oppdist>mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Loser!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Winner!) was: " + distance.toFixed(2) + " miles off!";
    } 
  }else{
    document.getElementById('msg').innerHTML = "Your guess was: " + distance.toFixed(2) + " miles off!";
  }
  
  alert("Your guess was: " + distance.toFixed(2) + " miles off!");
  document.getElementById("check2").disabled = true;
  sl=true;
}
function randloc(){
  var jsonfile2 = "https://vna818.github.io/location_guessr/Resources/data_ctemp.JSON";
  //  var jsonfile2 = "http://localhost/geotest/data_ctemp.JSON";
  var valuel= $.ajax({ 
      url: jsonfile2, 
      async: false
  }).responseText;
  var loc_info=JSON.parse(valuel);
  if(shareid==null){
    var choice = String(Math.floor(Math.random() * parseInt(loc_info.locations.size.csize))); 
    shrchoice=(choice*82.156)/2;
  }else{
    var choice = (shareid/82.156)*2;
    shrchoice=(choice*82.156)/2;
  }
  
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
  document.getElementById("shrbtn").disabled = true;
  var status=7;
   loc_select=0;
//initPano(59.33622, 18.05637);
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
    $("#shrbtn").css('visibility','visible');
        
        if(multi=="rec"||multi=="send"){
           sl=true;
           //alert("sending loc");
          $( '#msg2' ).show();
        }

  });
}
function multiplayer(){
  if(multi=="rec"){
    document.getElementById("check3").disabled = true;
    var inits=false;
    if(prid!=null){
     
      peer = new Peer(prid); 
      peer.on('open', function(id) {
      alert('Host: Please give your id: ' + id);
      alert(oprid);
      conn = peer.connect(oprid);
      loc2=randloc();
  conn.send(loc2);
  run();
  });
    }else{
      peer = new Peer(); 
  peer.on('open', function(id) {
      alert('Host: Please give your id: ' + id);
  });
    }
   
  
  peer.on('connection', function(conn) {

    
    if(oprid!=null){

     conn = peer.connect(oprid);
   
 conn.on('open', function(){
  alert("connected to "+data);
  loc2=randloc();
  conn.send(loc2);
  run();

  $(".check2").click(function() {
      conn = peer.connect(data);
           conn.on('open', function(){
  alert("Sending to your opponent");

  conn.send(conn.send([loc_select.lat,loc_select.lng,mydist,true]));
  document.getElementById("check2").disabled = true;
    });
});

  
});
}
  conn.on('data', function(data){

    // Will print 'hi!'
if(data[3]==true){
  alert("Your opponent has guessed a location!");
  opploc=[data[0],data[1]];
  oppdist=data[2];
  if(data[2]<mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Winner!): " + data[2].toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Loser!) was: " + mydist.toFixed(2) + " miles off!";
  }else if (data[2]==mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Tie!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Tie!) was: " + mydist.toFixed(2) + " miles off!";
  }else if (data[2]>mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Loser!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Winner!) was: " + mydist.toFixed(2) + " miles off!";
    } 
  

  if(opploc!=null&&sl==true){
    
   oppmarker = new google.maps.LatLng(opploc[0],opploc[1]);
    marker = new google.maps.Marker({
        position: oppmarker,
        icon: {
     url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
     labelOrigin: { x: 12, y: -10}
      },
        map: map,
        label: {
     text: "Opponent",
     color: '#222222',
     fontSize: '12px'
    }
    });

   // marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');

  }
}
  else{
    if(oprid!=null){

     conn = peer.connect(oprid);
    }else{
      conn = peer.connect(data);
    }
 
 conn.on('open', function(){
  alert("connected to "+data);
  loc2=randloc();
  conn.send(loc2);
  run();

  $(".check2").click(function() {
      conn = peer.connect(data);
           conn.on('open', function(){
  alert("Sending to your opponent");

  conn.send(conn.send([loc_select.lat,loc_select.lng,mydist,true]));
  document.getElementById("check2").disabled = true;
    });
});
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
}
  });


});
  
}
if (multi=="send"){
  document.getElementById("check3").disabled = true;
  var initr=false;
  $( '.sender' ).show();
  alert("Player: Please enter hosts's id");
  var pid;
  var sq="";
  
   peer = new Peer(); 
  peer.on('open', function(id) {
      alert('My peer ID is: ' + id);
      pid=id;
  });

  $("#submitButton").click(function() {

     sq= $("#search").val();

  conn = peer.connect(sq);
 
 conn.on('open', function(){
  alert("Connected to "+sq);
  $( '.sender' ).hide();
  // here you have conn.id
  conn.send(pid);
});

  });

peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'
if(data[3]==true){
  alert("Your opponent has guessed a location!");
  opploc=[data[0],data[1]];
  oppdist=data[2];
  if(data[2]<mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Winner!): " + data[2].toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Loser!) was: " + mydist.toFixed(2) + " miles off!";
  }else if (data[2]==mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Tie!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Tie!) was: " + mydist.toFixed(2) + " miles off!";
  }else if (data[2]>mydist){
    document.getElementById('msg2').innerHTML = "Opponent (Loser!): " + oppdist.toFixed(2) + " miles off!";
    document.getElementById('msg').innerHTML = "Your guess (Winner!) was: " + mydist.toFixed(2) + " miles off!";
    } 
  if(opploc!=null&&sl==true){
   oppmarker = new google.maps.LatLng(opploc[0],opploc[1]);
    marker = new google.maps.Marker({
        position: oppmarker,
        icon: {
     url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
     labelOrigin: { x: 12, y: -10}
      },
        map: map,
        label: {
     text: "Opponent",
     color: '#222222',
     fontSize: '12px'
    }
    });
    marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
  }
}

  else{

       loc2=data;
run();
$(".check2").click(function() {
      conn = peer.connect(sq);
           conn.on('open', function(){
  alert("Sending to your opponent");

  conn.send([loc_select.lat,loc_select.lng,mydist,true]);
 document.getElementById("check2").disabled = true;
    });
});
         

          //
      
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
$(".menubutton").click(function() {
  if($( '#sidemenu' ).css('left') == '-305px'){
    $( '#sidemenu' ).css('left','0');
   // $( '#sidemenu' ).removeClass("sidemenu");
  //  $( '#sidemenu' ).addClass("sidemenu2");
    $("#dim").css('visibility','visible');
  }
  else{
     $("#dim").css('visibility','hidden');
     $( '#sidemenu' ).css('left','-305px');
   
  }
  });
$("#dim").click(function() {
    $("#dim").css('visibility','hidden');
     $( '#sidemenu' ).css('left','-305px');
  });

$(".reload").click(function() {
  if(shareid!=null){
    window.location="https://vna818.github.io/location_guessr/";
  }else{
    window.location.reload();
  }
  
  });

$("#shrbtn").click(function() {
  alert("Link copied to clipboard!");
  const body = document.querySelector('body');
  const area = document.createElement('textarea');
  body.appendChild(area);

  area.value = "My guess was "+mydist.toFixed(2)+" off on this location, see if you can beat me! http://localhost/geotest/?shareid="+shrchoice;
  area.select();
  document.execCommand('copy');

  body.removeChild(area);
  });


});