import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { StreetViewComponent } from './street-view/street-view.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { HistoryComponent } from './history/history.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterTestingModule } from "@angular/router/testing";
//material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StreetViewComponent,
    ActionBarComponent,
    ToolbarComponent,
    HistoryComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
      RouterModule.forRoot([
      {path: 'world-search', component: AppComponent },
    ]),

  //material
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
