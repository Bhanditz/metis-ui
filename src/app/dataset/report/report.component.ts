import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { StringifyHttpError } from '../../_helpers';
import { errorNotification, Notification } from '../../_models/notification';
import { ReportRequest } from '../../_models/report';
import { ErrorService, TranslateService, WorkflowService } from '../../_services';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private workflows: WorkflowService,
    private errorService: ErrorService,
  ) {}

  isVisible: boolean;
  isLoading: boolean;
  notification?: Notification;

  // tslint:disable-next-line: no-any
  errors: any;

  @Output() closed = new EventEmitter<void>();

  @Input() set reportRequest(request: ReportRequest | undefined) {
    this.notification = undefined;
    this.errors = undefined;

    if (request) {
      this.isVisible = true;
      this.isLoading = true;
      this.workflows.getReport(request.taskId, request.topology).subscribe(
        (report) => {
          this.isLoading = false;
          if (report && report.errors && report.errors.length) {
            this.errors = report.errors;
          } else {
            this.errors = [];
            this.notification = errorNotification('Report is empty.');
          }
        },
        (err: HttpErrorResponse) => {
          const error = this.errorService.handleError(err);
          this.notification = errorNotification(`${StringifyHttpError(error)}`);
          this.isLoading = false;
        },
      );
    } else {
      this.isVisible = false;
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
    this.translate.use('en');
  }

  reportKeys(o: Object): string[] {
    return Object.keys(o);
  }

  closeReport(): void {
    this.closed.emit();
  }

  // tslint:disable-next-line: no-any
  isObject(val: any): boolean {
    return typeof val === 'object';
  }
}
