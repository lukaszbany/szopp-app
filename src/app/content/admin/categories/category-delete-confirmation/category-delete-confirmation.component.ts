import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Category} from '../../../../model/category/category.model';

@Component({
  selector: 'app-category-delete-confirmation',
  templateUrl: './category-delete-confirmation.component.html',
  styleUrls: ['./category-delete-confirmation.component.css']
})
export class CategoryDeleteConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<CategoryDeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public category: Category) {
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteCategory() {
    this.dialogRef.close(true);
  }

}
