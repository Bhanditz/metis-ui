import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { apiSettings } from '../../../environments/apisettings';
import { createMockPipe, mockDataset, mockHarvestData } from '../../_mocked';

import { GeneralinfoComponent } from '.';

describe('GeneralinfoComponent', () => {
  let component: GeneralinfoComponent;
  let fixture: ComponentFixture<GeneralinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralinfoComponent, createMockPipe('translate')],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralinfoComponent);
    component = fixture.componentInstance;
    component.datasetData = mockDataset;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should try to find publication data', () => {
    component.harvestPublicationData = mockHarvestData;
    fixture.detectChanges();
    expect(component.harvestPublicationData).toBe(mockHarvestData);
    expect(component.lastPublishedRecords).toBe(842);
    expect(component.lastPublishedDate).toBe('2018-03-30T13:53:04.762Z');
    expect(component.viewPreview).toBe(apiSettings.viewPreview + '1_*');
    expect(component.buttonClassPreview).toBe('');
    expect(component.viewCollections).toBe(apiSettings.viewCollections + '1_*');
    expect(component.buttonClassCollections).toBe('');
  });
});
