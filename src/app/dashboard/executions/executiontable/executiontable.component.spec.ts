import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  currentWorkflow,
  MockDatasetService,
  MockTranslateService,
  MockWorkflowService,
} from '../../../_mocked';
import {
  DatasetsService,
  ErrorService,
  RedirectPreviousUrl,
  WorkflowService,
} from '../../../_services';
import { TranslatePipe, TranslateService } from '../../../_translate';

import { ExecutiontableComponent } from '.';

describe('ExecutiontableComponent', () => {
  let component: ExecutiontableComponent;
  let fixture: ComponentFixture<ExecutiontableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ExecutiontableComponent, TranslatePipe],
      providers: [
        ErrorService,
        RedirectPreviousUrl,
        { provide: DatasetsService, useClass: MockDatasetService },
        { provide: WorkflowService, useClass: MockWorkflowService },
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiontableComponent);
    component = fixture.componentInstance;
    component.execution = currentWorkflow.results[0];
    component.plugin = currentWorkflow.results[0].metisPlugins[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy information', () => {
    component.copyInformation('plugin', '1', '2');
    fixture.detectChanges();
    expect(component.contentCopied).toBe(true);
  });
});
