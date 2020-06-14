import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../../model/user/user.model';

@Component({
  selector: 'app-remove-user-confirmation',
  templateUrl: './remove-user-confirmation.component.html',
  styleUrls: ['./remove-user-confirmation.component.css']
})
export class RemoveUserConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<RemoveUserConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User) {
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteUser() {
    this.dialogRef.close(true);
  }

}
