import { timer as observableTimer, Subscription } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { StringifyHttpError, copyExecutionAndTaskId } from '../../_helpers';

import { WorkflowService, ErrorService, TranslateService, DatasetsService, AuthenticationService } from '../../_services';
import { environment } from '../../../environments/environment';
import { LogStatus } from '../../_models/log-status';
import { WorkflowExecution } from '../../_models/workflow-execution';

@Component({
  selector: 'app-ongoingexecutions',
  templateUrl: './ongoingexecutions.component.html',
  styleUrls: ['./ongoingexecutions.component.scss']
})
export class OngoingexecutionsComponent {

  constructor(private workflows: WorkflowService,
    private errors: ErrorService,
    private authentication: AuthenticationService,
    private translate: TranslateService,
    private datasets: DatasetsService) { }

  @Output() notifyShowLogStatus: EventEmitter<LogStatus> = new EventEmitter<LogStatus>();
  @Input('isShowingLog') isShowingLog: LogStatus;
  @Input('runningExecutionDataOutput') ongoingExecutionDataOutput: WorkflowExecution[];

  ongoingExecutions: WorkflowExecution[];
  ongoingExecutionsTotal: number;
  errorMessage: string;
  subscription: Subscription;
  intervalTimer = environment.intervalStatusShort;
  cancelling: string;
  currentPlugin = 0;
  datasetNames: Array<string> = [];
  viewMore = false;
  logIsOpen?: string;
  contentCopied = false;

  /** ngOnInit
  /* init of this component:
  /* start polling/checking for updates
  /* set translation languages
  /* translate some values to use in this component
  */
  ngOnInit(): void {
    this.startPolling();
    if (!this.datasets.updateLog) { return; }
    this.datasets.updateLog.subscribe(
      (log: LogStatus) => {
        if (this.isShowingLog) {
          this.showLog(log['externaltaskId'], log['topology'], log['plugin'], this.logIsOpen, log['processed'], log['status']);
        } else {
          this.logIsOpen = undefined;
        }
    });

    this.translate.use('en');
    this.cancelling = this.translate.instant('cancelling');
  }

  /** startPolling
  /*  check for ongoing executions
  */
  startPolling(): void {
    if (this.subscription || !this.authentication.validatedUser()) { this.subscription.unsubscribe(); }
    const timer = observableTimer(0, this.intervalTimer);
    this.subscription = timer.subscribe(t => {
      this.getOngoing();
    });
  }

  /** getOngoing
  /*  get ongoing executions, either in queue or running, most recent started
  /*  showing up to 5 executions
  */
  getOngoing(): void {
    if (!this.authentication.validatedUser()) { return; }

    const executions = this.ongoingExecutionDataOutput;
    const max = 5;
    if (!executions) { return; }

    this.ongoingExecutions = this.datasets.addDatasetNameAndCurrentPlugin(executions.slice(0, max), this.logIsOpen);
    if (executions.length > max) {
      this.viewMore = true;
    } else {
      this.viewMore = false;
    }
  }

  /** cancelWorkflow
  /*  start cancellation of the dataset with id
  /* @param {number} id - id of the dataset to cancel
  */
  cancelWorkflow(id: string): void {
    if (!id) { return; }
    this.getOngoing();
    this.workflows.promptCancelThisWorkflow(id);
  }

  /** showLog
  /*  show the log for the current/last execution
  /* @param {number} externaltaskId - id of the external task that belongs to topology/plugin
  /* @param {string} topology - name of the topology
  */
  showLog(externaltaskId: string, topology: string, plugin: string, datasetId?: string, processed?: number, status?: string): void {
    const message = {'externaltaskId' : externaltaskId, 'topology' : topology, 'plugin': plugin, 'processed': processed, 'status': status};
    this.logIsOpen = datasetId;
    this.notifyShowLogStatus.emit(message);
  }

  /** viewAll
  /*  scrolls to top of all executions table/top of page
  */
  viewAll(): void {
    window.scrollTo(0, 0);
  }

  /*** copyInformation
  /* after double clicking, copy the execution and task id to the clipboard
  /* @param {string} type - execution or plugin
  /* @param {string} id1 - an id, depending on type
  /* @param {string} id2 - an id, depending on type
  */
  copyInformation (type: string, id1: string, id2: string): void {
    copyExecutionAndTaskId(type, id1, id2);
    this.contentCopied = true;
  }

}
