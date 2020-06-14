import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../model/category/category.model';

@Component({
  selector: 'app-categories-mobile',
  templateUrl: './categories-mobile.component.html',
  styleUrls: ['./categories-mobile.component.css']
})
export class CategoriesMobileComponent {

  @Input() categories: Category[];

  constructor() { }

}
