import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private inj: Injector) {}

  /** intercept
  /* this hooks into all outgoing HTTP requests, and if the user is logged in,
  /* an authorization header is inserted: { Authorization: 'Bearer [token]' }
  /*
  /* the token is that which was passed back during successful login and was saved
  /* insert authorization header into all outgoing calls
  /*
  /* @param {httprequest} request - identify the http request, url
  /* @param {httphandler} next
  */
  intercept(
    // tslint:disable-next-line: no-any
    request: HttpRequest<any>,
    next: HttpHandler,
    // tslint:disable-next-line: no-any
  ): Observable<HttpEvent<any>> {
    if (!request.url.match(/signin|register/)) {
      const auth = this.inj.get<AuthenticationService>(AuthenticationService);
      const token = auth.getToken();

      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        request = request.clone({
          setHeaders: headers,
        });
      }
    }
    return next.handle(request);
  }
}
