import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  createMockPipe,
  MockAuthenticationService,
  MockDatasetsService,
  MockErrorService,
  MockWorkflowService,
} from '../_mocked';
import { PluginStatus } from '../_models';
import {
  AuthenticationService,
  DatasetsService,
  ErrorService,
  WorkflowService,
} from '../_services';

import { DashboardComponent } from '.';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, createMockPipe('translate')],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: DatasetsService, useClass: MockDatasetsService },
        { provide: WorkflowService, useClass: MockWorkflowService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open log messages', () => {
    component.showPluginLog = {
      id: 'xx5',
      pluginType: 'OAIPMH_HARVEST',
      pluginStatus: PluginStatus.RUNNING,
      executionProgress: {
        expectedRecords: 1000,
        processedRecords: 500,
        progressPercentage: 50,
        errors: 5,
      },
      pluginMetadata: {
        pluginType: 'OAIPMH_HARVEST',
        url: 'example.com',
        setSpec: 'test',
        metadataFormat: 'edm',
      },
      topologyName: 'oai_harvest',
    };
    fixture.detectChanges();
    expect(component.showPluginLog).toBeTruthy();
  });

  it('should open more than 1 page', () => {
    component.getNextPage();
    fixture.detectChanges();
    expect(component.finishedCurrentPage).toBe(1);
  });

  it('should get a list of executions', () => {
    component.finishedCurrentPage = 1;
    component.getFinishedExecutions();
    fixture.detectChanges();
    expect(component.finishedCurrentPage).toBe(1);
  });
});
