import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as JSONlocations from '../assets/json/locations.json';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  constructor(private snackBar: MatSnackBar, private clipboard: Clipboard) { }

  private locationData: any = (JSONlocations as any);

  public getParams(value: string) {
    return new URLSearchParams(window.location.search).get(value);
  }

  public shareEncode(id: number, distance: number) {
    this.clipboard.copy('My guess was ' + distance.toFixed(2) + ' miles off on this location, see if you can beat me! ' + window.location.href + '?share='
    + btoa(String(id)));
    this.alertBox('Copied to clipboard!', 'Dismiss');
  }

  public shareDecode(id: string): number {
    return parseInt(atob(id));
  }

  public alertBox(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 5000,
       panelClass: ['snackbar', 'mat-toolbar']
    });
   } 

   public getLocation(value: number): Array<number> {
    if(value > this.locationData.locations.size.csize || value < 0) {
      console.log("Location retrieval error: Out of range" + value);
      let data = this.locationData.locations[0];
      return [parseFloat(data.lat), parseFloat(data.long)];
    } else {
      let data = this.locationData.locations[String(value)];
      return [parseFloat(data.lat), parseFloat(data.long)];
    }
  }

  public randomLocation(): Array<number> {
    let rand = Math.floor(Math.random() * parseInt(this.locationData.locations.size.csize)); 
    let data = this.locationData.locations[String(rand)];
    return [parseFloat(data.lat), parseFloat(data.long), rand];
  }

  public distance(loc1: Array<number>, loc2: Array<number>): number {
    //haversine distance formula
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = loc1[0] * (Math.PI/180); // Convert degrees to radians
    var rlat2 = loc2[0] * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (loc2[1]-loc1[1]) * (Math.PI/180); // Radian difference (longitudes)
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
  }
}
