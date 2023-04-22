import { Component, Input, OnInit } from '@angular/core';


export type Alert =
  'secondary' |
  'primary' |
  'success' |
  'danger' |
  'warning' |
  'info' |
  'light' |
  'dark'


@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  @Input() alert!: Alert;

  constructor() { }

  ngOnInit(): void {
  }

}
