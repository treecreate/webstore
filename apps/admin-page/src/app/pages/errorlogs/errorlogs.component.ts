import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  displayedColumns: string[] = ['name', 'priority', 'createdAt', 'userId', 'extra'];
  errorlogs!: IErrorlog[];

  constructor(private errorlogsService: ErrorlogsService, private clipboardService: ClipboardService) {}

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
