import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.css']
})

export class StreetViewComponent implements OnInit {
  @ViewChild('streetView', {static: false}) streetViewHTML!: ElementRef;
  panorama!: any; 
  init: boolean = true;

  constructor() { }

  newPano(location: Array<number>) {
    console.log("Street view init");
    this.panorama = new google.maps.StreetViewPanorama(this.streetViewHTML.nativeElement,
      {
        position: { lat: location[0], lng: location[1] },
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

  editPano(location: Array<number>) {
    let current = new google.maps.LatLng(location[0], location[1])
    this.panorama.set('position', current);
  }

  loadPano(location: Array<number>) {
    if(location.length != 2) {
      console.log("Street View error: Location " + location + " not valid");
    } else {
      if(this.init) {
        this.newPano(location);
      } else {
        this.editPano(location);
      }
      this.init = false;
    }
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {

  }

}
