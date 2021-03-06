import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { apiSettings } from '../../environments/apisettings';
import { MockHttp } from '../_helpers/test-helpers';
import { mockedCountries, mockedLanguages, MockErrorService } from '../_mocked';

import { CountriesService, ErrorService } from '.';

describe('dataset service', () => {
  let mockHttp: MockHttp;
  let service: CountriesService;

  beforeEach(async(() => {
    localStorage.setItem('favoriteDatasetIds', '["5", "6736"]');

    TestBed.configureTestingModule({
      providers: [CountriesService, { provide: ErrorService, useClass: MockErrorService }],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    mockHttp = new MockHttp(TestBed.get(HttpTestingController), apiSettings.apiHostCore);
    service = TestBed.get(CountriesService);
  }));

  afterEach(() => {
    mockHttp.verify();
  });

  it('should get the countries (cached)', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual(mockedCountries);
    });
    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual(mockedCountries);
    });
    mockHttp.expect('GET', '/datasets/countries').send(mockedCountries);
  });

  it('should get the languages (cached)', () => {
    service.getLanguages().subscribe((languages) => {
      expect(languages).toEqual(mockedLanguages);
    });
    service.getLanguages().subscribe((languages) => {
      expect(languages).toEqual(mockedLanguages);
    });
    mockHttp.expect('GET', '/datasets/languages').send(mockedLanguages);
  });
});
