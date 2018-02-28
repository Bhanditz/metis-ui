import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { apiSettings } from '../../environments/apisettings';

import 'rxjs/Rx';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class DatasetsService {
  private datasets = [];
  datasetMessage;
  tempPreviewFilers;
  
  constructor(private http: HttpClient) { }
  
  setDatasetMessage(message) {
    this.datasetMessage = message;
  }

  getDatasetMessage() {
    return this.datasetMessage;
  }

  getDataset(id: number) {
    const url = `${apiSettings.apiHostCore}/${environment.apiDatasets}/${id}`;    
    return this.http.get(url).map(data => {   
      const dataset = data;
      if (dataset) {
        return dataset;
      } else {
        return false;
      }
    });    
  }

  createDataset(datasetFormValues) {    
    const url = `${apiSettings.apiHostCore}/${environment.apiDatasets}`;    
    return this.http.post(url, datasetFormValues).map(data => {      
      const dataset = data;
      if (dataset) {
        return dataset;
      } else {
        return false;
      }
    });
  }

  updateDataset(datasetFormValues) {
    const url = `${apiSettings.apiHostCore}/${environment.apiDatasets}`;    
    return this.http.put(url, datasetFormValues).map(data => {      
      const dataset = data;
      if (dataset) {
        return dataset;
      } else {
        return false;
      }
    });
  }

  setPreviewFilters(tempFilters) {
    this.tempPreviewFilers = tempFilters;
  }

  getPreviewFilters() {
    return this.tempPreviewFilers;
  }

}
