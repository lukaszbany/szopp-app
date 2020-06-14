import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Role} from '../../../../model/user/role.model';

@Component({
  selector: 'app-add-role-confirmation',
  templateUrl: './add-role-confirmation.component.html',
  styleUrls: ['./add-role-confirmation.component.css']
})
export class AddRoleConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<AddRoleConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public role: Role) {
  }

  close(): void {
    this.dialogRef.close();
  }

  changeRole() {
    this.dialogRef.close(this.role);
  }

}
