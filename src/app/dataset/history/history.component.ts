import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subscription, timer as observableTimer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

import { WorkflowService, ErrorService, TranslateService } from '../../_services';
import { StringifyHttpError, copyExecutionAndTaskId } from '../../_helpers';
import { Dataset } from '../../_models/dataset';
import { WorkflowExecution, PluginExecution } from '../../_models/workflow-execution';
import { Report } from '../../_models/report';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  constructor(public workflows: WorkflowService,
    private errors: ErrorService,
    private translate: TranslateService,
    private route: ActivatedRoute) { }

  @Input('datasetData') datasetData: Dataset;
  @Input('lastExecutionData') lastExecutionData: WorkflowExecution;
  @Input('inCollapsablePanel') inCollapsablePanel: boolean;

  errorMessage?: string;
  successMessage?: string;
  report?: Report;
  allExecutions: Array<WorkflowExecution | PluginExecution> = []; // TODO: check type
  historyInPanel: PluginExecution[] = [];
  currentPlugin = 0;
  nextPage = 0;
  totalPages = 0;
  contentCopied = false;
  workflowHasFinished = false;
  subscription: Subscription;
  intervalTimer = environment.intervalStatusShort;
  checkStatusStarted = false;
  thisDatasetId: string;
  checkTrigger: Subscription;


  /** ngOnInit
  /* init for this specific component
  /* if in collapsable panel, subscribe to selected workflow so trigger after change
  /* if nog in collapsable panel, check for current page number and get all executions for all pages
  /* act upon changes in workflow
  /* act when workflow is done
  /* get all workflows
  /* and set translation langugaes
  */

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.thisDatasetId = params['id']; // if no id defined, let's create a new dataset
    });

    this.checkStatus();

    if (!this.inCollapsablePanel) {
      this.returnAllExecutions();
    } else {
      this.getLatestExecution();
    }

    this.workflows.reloadWorkflowExecution.subscribe(
      () => {
        this.allExecutions = [];
        this.nextPage = 0;
        this.workflowHasFinished = true;
        this.returnAllExecutions();
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.checkStatusStarted = false;
      }
    );

    this.translate.use('en');
  }

  ngOnDestroy(): void {
    if (this.checkTrigger) { this.checkTrigger.unsubscribe(); }
  }

  /** checkStatus
  /*  start checking the status of the workflow
  */
  checkStatus (): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
    const timer = observableTimer(0, this.intervalTimer);
    this.subscription = timer.subscribe(() => {
      this.updateExecutionHistoryPanel(this.lastExecutionData);
    });
  }

  /** updateExecutionHistoryPanel
  /*  update execution information in history panel specific
  /* @param {object} workflow - current running workflow
  */
  updateExecutionHistoryPanel(workflow: WorkflowExecution): void {

    if (!workflow) { return; }
    if (this.historyInPanel.length === this.workflows.getCurrentPlugin(workflow) + 1 &&
      this.historyInPanel.length &&
      this.historyInPanel.length > 0 &&
      this.workflows.getCurrentPlugin(workflow) > 0) {
        return;
      }

    this.historyInPanel = [];
    const r = workflow;

    for (let w = 0; w < r['metisPlugins'].length; w++) {
      if (['FINISHED', 'FAILED', 'CANCELLED'].indexOf(r['metisPlugins'][w].pluginStatus) > -1) {
        this.historyInPanel.push(this.getReport(r['metisPlugins'][w]));
      }
    }

    if (this.inCollapsablePanel) {
      const history = this.historyInPanel;
      history.reverse();
      this.allExecutions = history;
    }
  }

  /** returnAllExecutions
  /*  return all executions, either max 1 to display in collapsable panel of list with pagination
  /*  option to filter on workflow in table
  */
  returnAllExecutions(): void {

    if (!this.datasetData) { return; }

    let startPage = 0;
    const totalPageNr = this.totalPages;

    this.workflows.getCompletedDatasetExecutions(this.datasetData.datasetId, this.nextPage).subscribe(result => {

      if (result['results'].length === 0) { this.nextPage = 0; return; }

      let showTotal = result['results'].length;
      if (this.inCollapsablePanel && result['results'].length >= 1 ) {
        showTotal = 1;
      }

      for (let i = 0; i < showTotal; i++) {
        const r = result['results'][i];
        r['metisPlugins'].reverse();
        this.allExecutions.push(r);
        for (let w = 0; w < r['metisPlugins'].length; w++) {
          this.allExecutions.push(this.getReport(r['metisPlugins'][w]));
        }
      }

      if (!this.inCollapsablePanel) {
        startPage = this.nextPage;
        this.totalPages = this.nextPage;
        this.nextPage = result['nextPage'];

        if (totalPageNr > 0) {
          if (startPage < totalPageNr) {
            this.loadNextPage();
          }
        }
      }

    }, (err: HttpErrorResponse) => {
      const error = this.errors.handleError(err);
      this.errorMessage = `${StringifyHttpError(error)}`;
    });
  }

  /** getReport
  /*  check if the execution is finished/failed
  /*  add a report when available
  */
  getReport(w: PluginExecution): PluginExecution {
    const ws: PluginExecution = w;
    ws['hasReport'] = false;

    if (w.pluginStatus === 'FINISHED' || w.pluginStatus === 'FAILED' || w.pluginStatus === 'CANCELLED') {
      if (w.externalTaskId && w.topologyName) {
        this.workflows.getReport(w.externalTaskId, w.topologyName).subscribe(report => {
          if (report['errors'].length > 0) {
            ws['hasReport'] = true;
          }
        }, (err: HttpErrorResponse) => {
          this.errors.handleError(err);
        });
      }
    }
    return ws;
  }

  /** getLatestExecution
  /*  get last execution, set status to running if it indeed does run or is inqueue
  /*  and update the history panel with the most recent details
  */
  getLatestExecution(): void {
    const workflow = this.lastExecutionData;
    if (!workflow) { return; }
    const currentPlugin = this.workflows.getCurrentPlugin(workflow);
    if (!workflow['metisPlugins'][currentPlugin]) { return; }
    this.workflowHasFinished = workflow['metisPlugins'][currentPlugin].pluginStatus !== 'RUNNING' &&
        workflow['metisPlugins'][currentPlugin].pluginStatus !== 'INQUEUE';
    this.updateExecutionHistoryPanel(workflow);
  }

  /** scroll
  /*  scroll to specific point in page after click
  /* @param {Element} el - scroll to defined element
  */
  scroll(el: Element): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  /** loadNextPage
  /*  used in processing history table to display next page
  */
  loadNextPage(): void {
    if (this.nextPage !== -1) {
      this.returnAllExecutions();
    }
  }

  /** openReport
  /*  click on link to open report, if available
  /* @param {number} taskid - id of task
  /* @param {string} topology - name of topology
  */
  openReport (taskid: string, topology: string): void {
    this.workflows.getReport(taskid, topology).subscribe(result => {
      this.report = result;
    }, (err: HttpErrorResponse) => {
      const error = this.errors.handleError(err);
      this.errorMessage = `${StringifyHttpError(error)}`;
    });
  }

  onReportClosed(): void {
    this.report = undefined;
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
