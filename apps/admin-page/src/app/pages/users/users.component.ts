import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { ViewUserOrdersDialogComponent } from '../../components/view-user-orders-dialog/view-user-orders-dialog.component';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  userList!: IUser[];
  isLoading = false;
  displayedColumns: string[] = ['email', 'userId', 'createdAt', 'actions'];
  showFullId = false;

  /**
   * @param userService
   * @param snackBar
   * @param dialog
   */
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private clipboardService: ClipboardService,
    private dialog: MatDialog
  ) {
    // Retrieve a list of users.
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (data: IUser[]) => {
        this.userList = data;
        this.snackBar.open('User list retrieved', 'Do i care?', { duration: 2000 });
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Failed to retrieve the list of users', 'Typical', { duration: 5000 });
        this.isLoading = false;
      }
    );
  }

  copyToClipboard(content: string): void {
    this.clipboardService.copyFromContent(content);
  }

  /**
   * Open a view orders dialog displaying the users orders
   * @param userId
   */
  viewOrders(userId: string, email: string): void {
    this.dialog.open(ViewUserOrdersDialogComponent, {
      data: {
        userId: userId,
        email: email,
      },
    });
  }
}
