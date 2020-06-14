import {Component, Input} from '@angular/core';
import {Category} from '../../../../model/category/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  @Input() categories: Category[];

  constructor() {
  }

}
