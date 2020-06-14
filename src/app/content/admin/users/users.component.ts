import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../../model/user/user.model';
import {Role} from '../../../model/user/role.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddRoleConfirmationComponent} from './add-role-confirmation/add-role-confirmation.component';
import {AuthService} from '../../../service/auth/auth.service';
import {RemoveUserConfirmationComponent} from './remove-user-confirmation/remove-user-confirmation.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  hasRole(user: User, role: string) {
    return user.roleNames[0] === role;
  }

  addRoleDialog(user: User, roleName: string) {
    const dialogRef = this.openAddRoleModal(roleName);
    this.handleAddRoleModalClose(dialogRef, user);
  }

  private openAddRoleModal(roleName: string) {
    return this.dialog.open(AddRoleConfirmationComponent, {
      data: Role[roleName]
    });
  }

  private handleAddRoleModalClose(dialogRef: MatDialogRef<AddRoleConfirmationComponent, any>, user: User) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeUserRole(user, result);
      }
    });
  }

  private changeUserRole(user: User, result) {
    this.userService.changeUserRole(user.id, result)
      .subscribe(success => {
        this.loadUsers();
        this.snackBar.open(success.message, null, {duration: 2000});
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 2000});
      });
  }

  isCurrent(user: User) {
    let username = this.authService.getUsername();

    return username === user.username;
  }

  deleteUserModal(user: User) {
    const dialogRef = this.openDeleteUserModal(user);
    this.handleDeleteUserModalClose(dialogRef, user);
  }

  private openDeleteUserModal(user: User) {
    return this.dialog.open(RemoveUserConfirmationComponent, {
      data: user
    });
  }

  private handleDeleteUserModalClose(dialogRef: MatDialogRef<RemoveUserConfirmationComponent, any>, user: User) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user);
      }
    });
  }

  private deleteUser(user: User) {
    this.userService.deleteUser(user.id)
      .subscribe(success => {
        this.loadUsers();
        this.snackBar.open(success.message, null, {duration: 2000});
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 2000});
      });
  }
}
