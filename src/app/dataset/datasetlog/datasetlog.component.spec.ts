import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkflowService, AuthenticationService, ErrorService, RedirectPreviousUrl, TranslateService } from '../../_services';
import { MockWorkflowService, currentWorkflow, currentDataset, MockAuthenticationService, currentUser } from '../../_mocked';

import { DatasetlogComponent } from './datasetlog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TRANSLATION_PROVIDERS, TranslatePipe }   from '../../_translate';

describe('DatasetlogComponent', () => {
  let component: DatasetlogComponent;
  let fixture: ComponentFixture<DatasetlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule],
      declarations: [ DatasetlogComponent, TranslatePipe ],
      providers: [ {provide: WorkflowService, useClass: MockWorkflowService},
        { provide: AuthenticationService, useClass: MockAuthenticationService}, 
        ErrorService, 
        RedirectPreviousUrl,
        { provide: TranslateService,
          useValue: {
            translate: () => {
              return {};
            }
          }
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the logs', () => {
    component.isShowingLog = {'externaltaskId' : 'mocked', 'topology' : 'mocked', 'plugin': 'testplugin', 'processed': 100, 'status': 'RUNNING'};
    fixture.detectChanges();
    component.returnLog();  
    expect(component.logMessages).toBe('mocked');
    component.closeLog();
  });

});
