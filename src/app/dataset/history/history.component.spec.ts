import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createMockPipe,
  mockDataset,
  MockErrorService,
  mockWorkflowExecutionResults,
  MockWorkflowService,
} from '../../_mocked';
import { ErrorService, WorkflowService } from '../../_services';

import { HistoryComponent } from '.';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        HistoryComponent,
        createMockPipe('translate'),
        createMockPipe('renameWorkflow'),
      ],
      providers: [
        { provide: WorkflowService, useClass: MockWorkflowService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    component.datasetData = mockDataset;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a report', () => {
    spyOn(component.setReportRequest, 'emit');
    component.openReport('123', 'validation');
    fixture.detectChanges();
    expect(component.setReportRequest.emit).toHaveBeenCalledWith({
      taskId: '123',
      topology: 'validation',
    });
  });

  it('should display history in tabs', () => {
    component.datasetData = mockDataset;
    component.returnAllExecutions();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.history-table tbody tr')).length).toBeTruthy();
  });

  it('should load next page', () => {
    component.datasetData = mockDataset;
    component.loadNextPage();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.history-table tbody tr')).length).toBeTruthy();
  });

  it('should update history panel', () => {
    component.lastExecutionData = mockWorkflowExecutionResults.results[4];
    fixture.detectChanges();
    expect(component.allExecutions).toBeTruthy();
  });

  it('should copy something to the clipboard', () => {
    component.copyInformation('plugin', '1', '2');
    expect(component.contentCopied).toBe(true);
  });
});
