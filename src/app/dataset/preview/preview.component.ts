import { Component, OnInit, Input } from '@angular/core';
import { WorkflowService, TranslateService, ErrorService } from '../../_services';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { StringifyHttpError } from '../../_helpers';
import { previewSamples } from '../../_mocked';

import 'codemirror/mode/xml/xml';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';

import * as beautify from 'vkbeautify';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: [
    './preview.component.scss'
   ]
})

export class PreviewComponent implements OnInit {

  constructor(private workflows: WorkflowService, 
    private http: HttpClient,
    private translate: TranslateService,
    private errors: ErrorService) { }

  @Input('datasetData') datasetData;
  editorConfig;
  allWorkflows: Array<any> = [];
  allWorkflowDates: Array<any> = [];
  allPlugins: Array<any> = [];
  allSamples;
  filterWorkflow: boolean = false;
  filterDate: boolean = false;
  filterPlugin: boolean = false;
  selectedWorkflow: string;
  selectedDate: string;
  selectedPlugin: string;
  displayFilterWorkflow;
  displayFilterDate;
  displayFilterPlugin;
  expandedSample;
  nosample: string;
  errorMessage: string;
  nextPage: number = 0;
  datasetHistory;
  execution: number;

  ngOnInit() {
  	this.editorConfig = { 
      mode: 'application/xml',
      lineNumbers: true,
      indentUnit: 2,
      readOnly: true,
      foldGutter: true,
      indentWithTabs: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    };

    if (typeof this.translate.use === 'function') { 
      this.translate.use('en'); 
    }

    if (typeof this.translate.instant === 'function') { 
      this.nosample = this.translate.instant('nosample');
    }
    
    if (this.datasetData) {
      this.addWorkflowFilter();
    }
  }

  addWorkflowFilter() {
    this.onClickedOutside();
    this.workflows.getAllFinishedExecutions(this.datasetData.datasetId, this.nextPage).subscribe(result => {
      for (let i = 0; i < result['results'].length; i++) {
        if (this.allWorkflows.indexOf(result['results'][i]['workflowName']) === -1) {
          this.allWorkflows.push(result['results'][i]['workflowName']);
        }
      }
      this.allWorkflows.sort();
      this.nextPage = result['nextPage'];
      if (this.nextPage >= 0) {
        this.addWorkflowFilter();
      }
    });   
  }

  addDateFilter(workflow) {
    this.onClickedOutside();
    this.selectedWorkflow = workflow;
    this.nextPage = 0;

    this.workflows.getAllFinishedExecutions(this.datasetData.datasetId, this.nextPage, workflow).subscribe(result => {
      for (let i = 0; i < result['results'].length; i++) {  
        this.allWorkflowDates.push(result['results'][i]);
      }

      this.allWorkflowDates.sort();
      this.nextPage = result['nextPage'];
      if (this.nextPage >= 0) {
        this.addWorkflowFilter();
      }
    });     
  }

  addPluginFilter(execution) {
    this.onClickedOutside();
    this.execution = execution;
    this.selectedDate = execution['startedDate'];    
    this.nextPage = 0;

    for (let i = 0; i < execution['metisPlugins'].length; i++) {  
      this.allPlugins.push(execution['metisPlugins'][i].pluginType);
    }
  }

  getXMLSamples(plugin) {
    this.onClickedOutside();
    this.selectedPlugin = plugin; 
    this.workflows.getWorkflowSamples(this.execution['id'], plugin).subscribe(result => {
      this.allSamples = result['records']; 
      if (this.allSamples.length === 1) {
       this.expandedSample = 0;
      }
    }, (err: HttpErrorResponse) => {
      let error = this.errors.handleError(err); 
      this.errorMessage = `${StringifyHttpError(error)}`;   
    });
  }

  expandSample(i) {
    if (this.expandedSample === i) {
      this.expandedSample = undefined;
    } else {
      this.expandedSample = i;
    }
  }

  toggleFilterWorkflow() {
    this.onClickedOutside();
    if (this.filterWorkflow === false) {
      this.filterWorkflow = true;
    } else {
      this.filterWorkflow = false;
    }
  }

  toggleFilterDate() {
    this.onClickedOutside();
    if (this.filterDate === false) {
      this.filterDate = true;
    } else {
      this.filterDate = false;
    }
  }

  toggleFilterPlugin() {
    this.onClickedOutside();
    if (this.filterPlugin === false) {
      this.filterPlugin = true;
    } else {
      this.filterPlugin = false;
    }
  }

  onClickedOutside(e?) {
    this.filterWorkflow = false;  
    this.filterDate = false;   
    this.filterPlugin = false;   
  }

}
