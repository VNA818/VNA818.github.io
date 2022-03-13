import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HistoryComponent implements OnInit {

  @Input() data: Array<any> = [];
  @Output() historyLoad = new EventEmitter<number>();

  constructor() { }

  historyClick(id: string) {
    this.historyLoad.emit(parseInt(id));
  }

  ngOnInit(): void {
  }

}
