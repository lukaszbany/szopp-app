import {Component, Input} from '@angular/core';
import {Category} from '../../model/category/category.model';

@Component({
  selector: 'app-categories-dropdown',
  templateUrl: './categories-dropdown.component.html',
  styleUrls: ['./categories-dropdown.component.css']
})
export class CategoriesDropdownComponent {

  @Input() categories: Category[];

  hasChildren(category: Category) {
    return category.childCategories && category.childCategories.length > 0;
  }

}
