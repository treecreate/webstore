import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorlogPriorityEnum, IErrorlog } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { ErrorlogsService } from '../../services/errorlogs/errorlogs.service';

enum LabelColorsEnum {
  critical = '#dc143c',
  high = '#ff4500',
  medium = '#ffa500',
  low = '#8b0000',
}

@Component({
  selector: 'webstore-errorlogs',
  templateUrl: './errorlogs.component.html',
  styleUrls: ['./errorlogs.component.css', '../../../assets/styling/table.css'],
})
export class ErrorlogsComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['name', 'priority', 'createdAt', 'userId', 'extra', 'actions'];
  errorlogs!: IErrorlog[];

  errorlogsDisplayList: IErrorlog[] = [];
  showCritical = true;
  showHigh = true;
  showMedium = true;
  showLow = true;

  constructor(
    private errorlogsService: ErrorlogsService,
    private clipboardService: ClipboardService,
    private snackBar: MatSnackBar
  ) {}

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
        this.errorlogsDisplayList = errorlogs;
      },
    });
  }

  /**
   * Updates the list of discounts based off active / disabled
   */
  updateList(): void {
    this.errorlogsDisplayList = [];

    if (this.showCritical) {
      this.errorlogsDisplayList = this.errorlogsDisplayList.concat(
        this.errorlogs.filter((errorlog) => errorlog.priority === ErrorlogPriorityEnum.critical)
      );
    }
    if (this.showHigh) {
      this.errorlogsDisplayList = this.errorlogsDisplayList.concat(
        this.errorlogs.filter((errorlog) => errorlog.priority === ErrorlogPriorityEnum.high)
      );
    }

    if (this.showMedium) {
      this.errorlogsDisplayList = this.errorlogsDisplayList.concat(
        this.errorlogs.filter((errorlog) => errorlog.priority === ErrorlogPriorityEnum.medium)
      );
    }

    if (this.showLow) {
      this.errorlogsDisplayList = this.errorlogsDisplayList.concat(
        this.errorlogs.filter((errorlog) => errorlog.priority === ErrorlogPriorityEnum.low)
      );
    }
  }

  /**
   * Marks the given errorlog as resolved and refetches the list.
   * @param errorlogId the errorlog id.
   */
  markAsResolved(errorlog: IErrorlog): void {
    this.isLoading = true;
    this.errorlogsService.markAsResolved(errorlog.errorlogId).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchErrorlogs();
        this.updateList();
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open(
          `This errorlog is so bad it even failed to get resolved: ${error.error.error}`,
          `The hell, I said RESOLVE!`,
          { duration: 15000 }
        );
        this.isLoading = false;
      },
    });
  }

  getErrorTextColor(priority: ErrorlogPriorityEnum): string {
    switch (priority) {
      case ErrorlogPriorityEnum.critical:
        return LabelColorsEnum.critical;
      case ErrorlogPriorityEnum.high:
        return LabelColorsEnum.high;
      case ErrorlogPriorityEnum.medium:
        return LabelColorsEnum.medium;
      case ErrorlogPriorityEnum.low:
        return LabelColorsEnum.low;
      default:
        return 'gray';
    }
  }

  copyToClipboard(content: string): void {
    this.clipboardService.copyFromContent(content);
  }
}
