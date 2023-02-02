import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  @Output() hasChanges: EventEmitter<boolean> = new EventEmitter();
  

  constructor() { }

  ngOnInit(): void {
  }

}
