import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-image-delete-confirmation',
  templateUrl: './image-delete-confirmation.component.html',
  styleUrls: ['./image-delete-confirmation.component.css']
})
export class ImageDeleteConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<ImageDeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteImage() {
    this.dialogRef.close(true);
  }

}
