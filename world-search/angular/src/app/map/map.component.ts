import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() resultLocation: Array<number> = [];
  @Output() mapSelect = new EventEmitter<Array<number>>();
  @ViewChild('map', {static: false}) mapHTML!: ElementRef;
  //selectedLocation: Array<number> = [];
  init = true;

  currentMap!: google.maps.Map;
  locationMarker!: google.maps.Marker;
  guessMarker!: google.maps.Marker;
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow({
      content: "Click the map to guess a location",
      position: { lat: -25.363, lng: 131.044 },
  });
  polyline!: google.maps.Polyline;
  clickListen!: any; //not sure type

  constructor() { }

  newMap(center: Array<number>): google.maps.Map {
    console.log("New map init");
    var centerCoord = new google.maps.LatLng(-25.363, 131.044);
    return new google.maps.Map(this.mapHTML.nativeElement, {
      zoom: 1,
      center: centerCoord,
      streetViewControl: false,
    });
  }

  initMap() {
    if(this.init) {
      this.currentMap = this.newMap([-25.363, 131.044]);
      this.init = false;
    }
    if(!this.init) {
      if(this.polyline != undefined) {
        this.clearMap();
      }
      this.infoWindow.set('content', "Click the map to guess a location");
      this.infoWindow.set('position', new google.maps.LatLng(-25.363, 131.044));
      this.currentMap.set('zoom', 1);
      // Create the initial InfoWindow.
      this.infoWindow.open(this.currentMap);
      // Configure the click listener.
      this.clickListen = this.currentMap.addListener("click", (mapsMouseEvent: any) => {
        // Close the current InfoWindow.
        this.infoWindow.close();
        // Create a new InfoWindow.
        this.infoWindow.set('position', mapsMouseEvent.latLng);
        this.infoWindow.setContent(
          "Selected"
        );
        this.infoWindow.open(this.currentMap);
        let selectedLocation = [mapsMouseEvent.latLng.toJSON().lat, mapsMouseEvent.latLng.toJSON().lng];
        this.mapSelect.emit(selectedLocation);
      });
    }
  }

  newMarker(image: string, text: string, location: Array<{ lat: number, lng: number }>, map: google.maps.Map): google.maps.Marker {
    return new google.maps.Marker({
      position: location[0],
      icon: {
        url: image,
        labelOrigin: { x: 12, y: -10}
      },
      map: map,
      label: {
        text: text,
        color: '#222222',
        fontSize: '12px'
      }
    });
  }

  resultMap(guess: Array<number>, result: Array<number>) {
    this.infoWindow.close();
    var center = { lat: result[0], lng: result[1] }; 
    var guessLocation = { lat: guess[0], lng: guess[1] };
    this.currentMap.set('center', new google.maps.LatLng(center.lat, center.lng));
    this.currentMap.set('zoom', '3');
    
    this.polyline = new google.maps.Polyline({path: [center, guessLocation], map: this.currentMap});
    this.locationMarker = this.newMarker('https://maps.google.com/mapfiles/ms/icons/green-dot.png', 'Actual location', [center], this.currentMap);
    this.guessMarker = this.newMarker('https://maps.google.com/mapfiles/ms/icons/red-dot.png', 'Your Guess', [guessLocation], this.currentMap);

    this.clickListen.remove();
  }

  displayMap(guess: Array<number>, result: Array<number>) {
    this.clearMap();
    this.resultMap(guess, result);
  }

  clearMap() {
    this.locationMarker.setMap(null);
    this.guessMarker.setMap(null);
    this.polyline.setMap(null);
    this.clickListen.remove();
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    
  }

}
