import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { StringifyHttpError } from '../_helpers';
import { environment } from '../../environments/environment';
import { timer, Subscription } from 'rxjs';

import { AuthenticationService, DatasetsService, WorkflowService, ErrorService, TranslateService } from '../_services';

import { Dataset } from '../_models/dataset';
import { Workflow } from '../_models/workflow';
import { HarvestData } from '../_models/harvest-data';
import { WorkflowExecution } from '../_models/workflow-execution';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})

export class DatasetComponent implements OnInit {

  constructor(private authentication: AuthenticationService,
    private datasets: DatasetsService,
    private workflows: WorkflowService,
    private errors: ErrorService,
    private translate: TranslateService,
    private route: ActivatedRoute) { }

  activeTab = 'new';
  prevTab: string | undefined;
  errorMessage?: string;
  successMessage?: string;
  harvestIsLoading = true;
  harvestSubscription: Subscription;
  workflowIsLoading = true;
  workflowSubscription: Subscription;
  lastExecutionIsLoading = true;
  lastExecutionSubscription: Subscription;

  public isShowingLog: boolean;
  public datasetData: Dataset;
  public activeSet: string;
  public workflowData?: Workflow;
  public harvestPublicationData?: HarvestData;
  public lastExecutionData?: WorkflowExecution;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activeTab = params['tab']; //if no tab defined, default tab is 'new'
      this.activeSet = params['id']; // if no id defined, let's create a new dataset
      if (this.activeTab === 'preview' && this.prevTab === 'mapping') {
        this.datasets.setTempXSLT(this.datasets.getTempXSLT());
      } else {
        this.datasets.setTempXSLT(null);
      }
      this.prevTab = this.activeTab;
      this.successMessage = this.datasets.getDatasetMessage();

      this.returnDataset(this.activeSet);
    });

    this.translate.use('en');
  }

  ngOnDestroy(): void {
    if (this.harvestSubscription) { this.harvestSubscription.unsubscribe(); }
    if (this.workflowSubscription) { this.workflowSubscription.unsubscribe(); }
    if (this.lastExecutionSubscription) { this.lastExecutionSubscription.unsubscribe(); }
  }

  returnDataset(id?: string): void {
    if (!id) {
      return;
    }

    this.datasets.getDataset(id, true).subscribe(result => {
      this.datasetData = result;
    }, (err: HttpErrorResponse) => {
      const error = this.errors.handleError(err);
      this.errorMessage = `${StringifyHttpError(error)}`;
    });

    // check for harvest data every x seconds
    if (this.harvestSubscription || !this.authentication.validatedUser()) { this.harvestSubscription.unsubscribe(); }
    const harvestTimer = timer(0, environment.intervalStatusMedium);
    this.harvestSubscription = harvestTimer.subscribe(t => {
      this.workflows.getPublishedHarvestedData(id).subscribe(resultHarvest => {
        this.harvestPublicationData = resultHarvest;
        this.harvestIsLoading = false;
      }, (err: HttpErrorResponse) => {
        const error = this.errors.handleError(err);
        this.errorMessage = `${StringifyHttpError(error)}`;
        this.harvestSubscription.unsubscribe();
        this.harvestIsLoading = false;
      });
    });

    // check workflow for every x seconds
    if (this.workflowSubscription) { this.workflowSubscription.unsubscribe(); }
    const workflowTimer = timer(0, environment.intervalStatusMedium);
    this.workflowSubscription = workflowTimer.subscribe(t => {
      this.workflows.getWorkflowForDataset(id).subscribe(workflow => {
        this.workflowData = workflow;
        this.workflowIsLoading = false;
      }, (err: HttpErrorResponse) => {
        const error = this.errors.handleError(err);
        this.errorMessage = `${StringifyHttpError(error)}`;
        this.workflowSubscription.unsubscribe();
        this.workflowIsLoading = false;
      });
    });

    // check for last execution every x seconds
    if (this.lastExecutionSubscription || !this.authentication.validatedUser()) { this.lastExecutionSubscription.unsubscribe(); }
    const executionsTimer = timer(0, environment.intervalStatus);
    this.lastExecutionSubscription = executionsTimer.subscribe(t => {
      this.workflows.getLastDatasetExecution(id).subscribe(execution => {
        this.lastExecutionData = execution;
        this.lastExecutionIsLoading = false;
      }, (err: HttpErrorResponse) => {
        const error = this.errors.handleError(err);
        this.errorMessage = `${StringifyHttpError(error)}`;
        this.lastExecutionSubscription.unsubscribe();
        this.lastExecutionIsLoading = false;
      });
    });
  }

  /** onNotifyShowLogStatus
  /*  opens/closes the log messages
  */
  onNotifyShowLogStatus(message: boolean): void {
    this.isShowingLog = message;
  }

  /** clickOutsideMessage
  /*  click outside message to close it
  */
  clickOutsideMessage(): void {
    this.errorMessage = undefined;
    this.successMessage = undefined;
    this.datasets.clearDatasetMessage();
  }
}
