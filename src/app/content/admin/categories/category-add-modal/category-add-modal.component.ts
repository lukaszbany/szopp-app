import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {Category} from '../../../../model/category/category.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryService} from '../../../../service/product/category.service';
import {map, startWith} from 'rxjs/operators';
import {ValidationErrorHandler} from '../../../../service/utils/validation.error.handler';
import {AddCategory} from '../../../../model/category/add.category.model';

@Component({
  selector: 'app-category-add-modal',
  templateUrl: './category-add-modal.component.html',
  styleUrls: ['./category-add-modal.component.css']
})
export class CategoryAddModalComponent implements OnInit {

  @ViewChild('categoryAddForm') categoryAddForm: NgForm;

  parentCategoryControl = new FormControl();
  filteredCategories: Observable<Category[]>;
  category: AddCategory = new AddCategory();

  constructor(
    public dialogRef: MatDialogRef<CategoryAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService) {
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.saveProposedParent();
    this.initCategoryFilter();
  }

  private saveProposedParent() {
    if (this.data.proposedParent) {
      this.parentCategoryControl.setValue(this.data.proposedParent);
    }
  }

  private initCategoryFilter() {
    this.filteredCategories = this.parentCategoryControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.data.availableAsParent.slice())
      );
  }

  submit() {
    this.category.parentCategoryId = this.parentCategoryControl.value ? this.parentCategoryControl.value.id : null;

    this.categoryService
      .addCategory(this.category)
      .subscribe(() => {
        this.dialogRef.close(true);
      }, error => {
        this.handleError(error);
        this.snackBar.open(error.error.message, null, {duration: 3000});
      });
  }

  private handleError(error) {
    if (error.error) {
      ValidationErrorHandler.saveErrors(this.categoryAddForm, error.error);
    }
  }

  isIncorrect(field: string): boolean {
    return this.categoryAddForm && this.categoryAddForm.controls[field] && this.categoryAddForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.categoryAddForm.controls[field].getError('message');
  }

  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }

  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();

    return this.data.availableAsParent.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
