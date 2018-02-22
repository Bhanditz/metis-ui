import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { WorkflowService, AuthenticationService, TranslateService, ErrorService } from '../../_services';

@Component({
  selector: 'app-datasetlog',
  templateUrl: './datasetlog.component.html',
  styleUrls: ['./datasetlog.component.scss']
})
export class DatasetlogComponent implements OnInit {

  constructor(private workflows: WorkflowService, 
    private authentication: AuthenticationService, 
    private router: Router,
    private errors: ErrorService,
    private translate: TranslateService) { }

  @Input('isShowingLog') isShowingLog;
  @Output() notifyShowLogStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  logMessages;

  ngOnInit() {
  	this.returnLog();
    if (typeof this.translate.use === 'function') { 
      this.translate.use('en'); 
    }
  }

  closeLog() {
  	this.notifyShowLogStatus.emit(false);
  }

  returnLog() {
    this.workflows.getLogs(this.isShowingLog['externaltaskId'], this.isShowingLog['topology']).subscribe(result => {
      this.logMessages = result;
    },(err: HttpErrorResponse) => {
      this.errors.handleError(err);
    });
  }

}
