import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IErrorlog } from '@interfaces';
import { ErrorlogsService } from '../../services/errorlogs/errorlogs.service';

@Component({
  selector: 'webstore-errorlogs',
  templateUrl: './errorlogs.component.html',
  styleUrls: ['./errorlogs.component.css', '../../../assets/styling/table.css'],
})
export class ErrorlogsComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['name', 'priority', 'createdAt', 'userId'];
  errorlogs!: IErrorlog[];

  constructor(private errorlogsService: ErrorlogsService) {}

  /**
   * Fetches the errorlogs.
   */
  ngOnInit(): void {
    this.fetchErrorlogs();
  }

  /**
   * Fetches the errorlogs from the API.\
   * \
   * Will toggle `isLoading` to `true` while the errorlogs are being fetched
   * and revert it to `false` when they have been fetched.\
   */
  fetchErrorlogs(): void {
    this.isLoading = true;
    this.errorlogsService.get({}).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (errorlogs: IErrorlog[]) => {
        this.isLoading = false;
        this.errorlogs = errorlogs;
      },
    });
  }
}
