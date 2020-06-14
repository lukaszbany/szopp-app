import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../../../service/product/category.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, NgForm} from '@angular/forms';
import {ValidationErrorHandler} from '../../../../service/utils/validation.error.handler';
import {Observable} from 'rxjs';
import {Category} from '../../../../model/category/category.model';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-category-edit-modal',
  templateUrl: './category-edit-modal.component.html',
  styleUrls: ['./category-edit-modal.component.css']
})
export class CategoryEditModalComponent implements OnInit {

  @ViewChild('categoryEditForm') categoryEditForm: NgForm;
  categoryName: string;

  parentCategoryControl = new FormControl();
  filteredCategories: Observable<Category[]>;

  constructor(
    public dialogRef: MatDialogRef<CategoryEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService) {
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.categoryName = this.data.category.name;

    let parentCategory = this.data.availableAsParent.find(cat => cat.id === this.data.category.parentCategoryId);
    this.parentCategoryControl.setValue(parentCategory);

    this.filteredCategories = this.parentCategoryControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.data.availableAsParent.slice())
      );
  }

  submit() {
    this.data.category.parentCategoryId = this.parentCategoryControl.value ? this.parentCategoryControl.value.id : null;

    this.categoryService
      .editCategory(this.data.category)
      .subscribe(() => {
        this.dialogRef.close(true);
      }, error => {
        this.handleError(error);
        this.snackBar.open(error.error.message, null, {duration: 3000});
      });
  }

  private handleError(error) {
    if (error.error) {
      ValidationErrorHandler.saveErrors(this.categoryEditForm, error.error);
    }
  }

  isIncorrect(field: string): boolean {
    return this.categoryEditForm && this.categoryEditForm.controls[field] && this.categoryEditForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.categoryEditForm.controls[field].getError('message');
  }

  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }

  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();

    return this.data.availableAsParent.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
