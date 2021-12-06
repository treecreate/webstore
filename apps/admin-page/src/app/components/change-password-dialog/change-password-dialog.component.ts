import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'webstore-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent implements OnInit {

  constructor(private authService: AuthService, @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit(): void {}
}
