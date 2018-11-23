import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkflowService, AuthenticationService, ErrorService, RedirectPreviousUrl, TranslateService, DatasetsService } from '../../_services';
import { MockWorkflowService, MockAuthenticationService, MockTranslateService, MockDatasetService } from '../../_mocked';

import { DatasetlogComponent } from './datasetlog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslatePipe } from '../../_translate';

describe('DatasetlogComponent', () => {
  let component: DatasetlogComponent;
  let fixture: ComponentFixture<DatasetlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule],
      declarations: [ DatasetlogComponent, TranslatePipe ],
      providers: [ {provide: WorkflowService, useClass: MockWorkflowService},
        { provide: DatasetsService, useClass: MockDatasetService },
        { provide: AuthenticationService, useClass: MockAuthenticationService},
        ErrorService,
        RedirectPreviousUrl,
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetlogComponent);
    component = fixture.componentInstance;
    component.isShowingLog = { topology: 'import', plugin: 'import' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the logs', () => {
    component.isShowingLog = {'externalTaskId' : 'mocked', 'topology' : 'mocked', 'plugin': 'testplugin', 'processed': 100, 'status': 'RUNNING'};
    fixture.detectChanges();
    component.returnLog();
    expect(component.logMessages).toBeTruthy();
    component.closeLog();
  });

  it('should get a from number', () => {
    component.logTo = 200;
    component.logPerStep = 100;
    fixture.detectChanges();
    expect(component.getLogFrom()).toBe(101);
  });

});
