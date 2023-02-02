import { Component, Input, OnInit } from '@angular/core';
import { Filter } from '../filters.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() filter?: Filter

  constructor() { }

  ngOnInit(): void {
  }

}
