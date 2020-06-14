import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-product-delete-confirmation',
  templateUrl: './product-delete-confirmation.component.html',
  styleUrls: ['./product-delete-confirmation.component.css']
})
export class ProductDeleteConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<ProductDeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteProduct() {
    this.dialogRef.close(true);
  }

}
