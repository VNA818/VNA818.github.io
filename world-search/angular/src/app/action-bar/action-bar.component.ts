import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})

export class ActionBarComponent implements OnInit {
  width: string = "100%";
  guessDisable: boolean = true;
  shareDisable: boolean = true;
  @Output() guessClick = new EventEmitter<boolean>();
  @Output() newClick = new EventEmitter<boolean>();
  @Output() rthClick = new EventEmitter<boolean>();
  @Output() shareClick = new EventEmitter<boolean>();
  @Input() distance: number = -1;
  @Input() set selectedLocation(value: Array<number>) {
    if(value.length == 0) {
      this.guessDisable = true;
    } else {
      this.guessDisable = false;
    }
  }

  constructor() { }

  collapse() {
    if(this.width == '100%') {
      this.width = '40px';
    } else {
      this.width = '100%'
    }
  }

  guess() {
    this.shareDisable = false;
    this.guessClick.emit(true);
  }

  newLocation () {
    this.shareDisable = true;
    this.newClick.emit(true);
  }

  rth() {
    this.rthClick.emit(true);
  }

  share() {
    this.shareClick.emit(true);
  }

  showShare() {
    this.shareDisable = false;
  }

  ngOnInit(): void {
  }

}
