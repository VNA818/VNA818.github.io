import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent implements OnInit {

  @Input() menu!: MatSidenav;
  @Input() history!: MatSidenav;

  constructor() { }

  menuClick() {
    this.menu.toggle();
  }

  historyClick() {
    this.history.toggle();
  }

  ngOnInit(): void {
  }

}
