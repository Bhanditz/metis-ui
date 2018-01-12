import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import 'rxjs/Rx';

import { CountriesService, DatasetsService, AuthenticationService } from '../../_services';
import { StringifyHttpError, convertDate } from '../../_helpers';

@Component({
  selector: 'app-datasetform',
  templateUrl: './datasetform.component.html',
  styleUrls: ['./datasetform.component.scss']
})

export class DatasetformComponent implements OnInit {

  @Input() datasetData: any;
  autosuggest;
  autosuggestId: String;
  datasetOptions: Object;
  formMode: String = 'create'; // create, read, update
  errorMessage;
  successMessage;
  harvestprotocol; 
  selectedCountry;
  selectedLanguage;

  private datasetForm: FormGroup;
  private countryOptions;
  private languageOptions;

 
  constructor(private countries: CountriesService,
    private datasets: DatasetsService,
    private authentication: AuthenticationService,
    private route: ActivatedRoute, 
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {

    if (!this.datasetData) {      
      const tempdata = JSON.parse(localStorage.getItem('tempDatasetData')); // something in localstorage? 
      this.datasetData = tempdata;
      this.formMode = 'create';
    } else {
      this.formMode = 'read';
    }

    this.returnCountries();
    this.returnLanguages();

    this.buildForm();
    this.saveTempData();
    
  }

  returnCountries() {
    
    this.countries.getCountries().subscribe(result => {
      this.countryOptions = result;
      if (this.datasetData.country && result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].enum = this.datasetData.country.enum) {
            this.selectedCountry = this.countryOptions[i];
          }
        }
      }
    },(err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 406) {
        this.authentication.logout();
        this.router.navigate(['/login']);
      }
    });

  }

  returnLanguages() {

    this.countries.getLanguages().subscribe(result => {

      this.languageOptions = result;
      if (this.datasetData.language && result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].enum = this.datasetData.country.enum) {
            this.selectedLanguage = this.languageOptions[i];
          }
        }
      }
    },(err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 406) {
        this.authentication.logout();
        this.router.navigate(['/login']);
      }
    });

  }

  /* buildForm
    creates a new form
    if datasetid exists: prefill form
    disable/enable fields
  */
  buildForm() {
     /* populated the form or leave empty when creating a new dataset */

    this.datasetForm = this.fb.group({
      datasetId: [(this.datasetData ? this.datasetData.datasetId : '')],
      datasetName: [(this.datasetData ? this.datasetData.datasetName : ''), [Validators.required]],
      dataProvider: [(this.datasetData ? this.datasetData.dataProvider : '')],
      provider: [(this.datasetData ? this.datasetData.provider : ''), [Validators.required]],
      intermediateProvider: [(this.datasetData ? this.datasetData.intermediateProvider : '')],
      dateCreated: [(this.datasetData ? convertDate(this.datasetData.createdDate) : '')],
      dateUpdated: [(this.datasetData ? convertDate(this.datasetData.updatedDate) : '')],
      status: [(this.datasetData ? this.datasetData.datasetStatus : '')],
      replaces: [(this.datasetData ? this.datasetData.replaces : '')],
      replacedBy: [(this.datasetData ? this.datasetData.replacedBy : '')],
      country: [],
      language: [(this.datasetData ? this.datasetData.language : '')],
      description: [(this.datasetData ? this.datasetData.description : '')],
      notes: [(this.datasetData ? this.datasetData.notes : '')],
      createdBy: [(this.datasetData ? this.datasetData.createdByUserId : '')],
      firstPublished: [(this.datasetData ? convertDate(this.datasetData.firstPublishedDate) : '')],
      lastPublished: [(this.datasetData ? convertDate(this.datasetData.lastPublishedDate) : '')],
      numberOfItemsPublished: [(this.datasetData ? this.datasetData.publishedRecords : '')],
      lastDateHarvest: [(this.datasetData ? convertDate(this.datasetData.harvestedDate) : '')],
      numberOfItemsHarvested: [(this.datasetData ? this.datasetData.harvestedRecords : '')],
      pluginType: [''],
      harvestUrl: [(this.datasetData ? this.datasetData.harvestingMetadata.url : '')],
      setSpec: [(this.datasetData ? this.datasetData.harvestingMetadata.setSpec : '')],
      metadataFormat: [(this.datasetData ? this.datasetData.harvestingMetadata.metadataFormat : '')],
      recordXPath: [''],
      ftpHttpUser: [''],
      ftpHttpPassword: [''],
      url: ['']
    });

    if (this.datasetData) {
      if (this.datasetData.harvestingMetadata) {
        this.harvestprotocol = (this.datasetData ? this.datasetData.harvestingMetadata.pluginType : '');
      }
    }

    if (this.formMode == 'read') { 
      this.datasetForm.controls['country'].disable();
      this.datasetForm.controls['language'].disable();
      this.datasetForm.controls['description'].disable();
      this.datasetForm.controls['notes'].disable();
    }

  }

  saveTempData() {

    if (this.datasetForm.touched === false) { return false }

    this.datasetForm.valueChanges.subscribe(val => {
      this.formatFormValues();
      localStorage.removeItem('tempDatasetData');
      localStorage.setItem('tempDatasetData', JSON.stringify(this.datasetForm.value));
    });

  }

  formatFormValues() {

    this.datasetForm.value.harvestingMetadata = {
      pluginType: this.datasetForm.value.pluginType ? this.datasetForm.value.pluginType : 'VOID',
      mocked: true,
      url: this.datasetForm.value.harvestUrl ? this.datasetForm.value.harvestUrl : '',
      metadataFormat: this.datasetForm.value.metadataFormat ? this.datasetForm.value.metadataFormat : '',
      setSpec: this.datasetForm.value.setSpec ? this.datasetForm.value.setSpec : ''
    };

    delete this.datasetForm.value['pluginType'];
    delete this.datasetForm.value['harvestUrl'];
    delete this.datasetForm.value['metadataFormat'];
    delete this.datasetForm.value['setSpec'];

    if (!this.datasetForm.value['country']) {
      this.datasetForm.value['country'] = null;
    }

    if (!this.datasetForm.value['language']) {
      this.datasetForm.value['language'] = null;
    }

  }

  /* onSubmit
    submits the form and shows an error or success message
  */
  onSubmit() {

    this.successMessage = '';
    this.errorMessage = '';

    this.formatFormValues();

    if (this.formMode === 'update') {

      this.datasets.updateDataset(this.datasetForm.value).subscribe(result => {

        localStorage.removeItem('tempDatasetData');
        this.successMessage = 'Dataset updated!';
        
      }, (err: HttpErrorResponse) => {

        if (err.error.errorMessage === 'Wrong access token') {
          this.authentication.logout();
          this.router.navigate(['/login']);
        }

        this.errorMessage = `Not able to load this dataset: ${StringifyHttpError(err)}`;  

      });

    } else {

      this.datasets.createDataset(this.datasetForm.value).subscribe(result => {
        
        localStorage.removeItem('tempDatasetData');
        this.datasets.setDatasetMessage('New dataset created! Id: ' + result['datasetId']);
        this.router.navigate(['/dataset/new/' + result['datasetId']]);
      
      }, (err: HttpErrorResponse) => {

        if (err.error.errorMessage === 'Wrong access token') {
          this.authentication.logout();
          this.router.navigate(['/login']);
        }

        this.errorMessage = `Not able to load this dataset: ${StringifyHttpError(err)}`;  

      });

    }

    window.scrollTo(0, 0);

  }

  /* updateForm
    update an existing dataset
    using (new) values from the form
    show an error or success message
  */
  updateForm() {
    this.formMode = 'update';

    this.datasetForm.controls['country'].enable();
    this.datasetForm.controls['language'].enable();
    this.datasetForm.controls['description'].enable();
    this.datasetForm.controls['notes'].enable();
    
    window.scrollTo(0, 0);

  }   

}
