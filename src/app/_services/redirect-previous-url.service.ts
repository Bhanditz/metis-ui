import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RedirectPreviousUrl {
  private url: string | undefined;

  set(_url: string | undefined): void {
    this.url = _url;
  }

  get(): string | undefined {
    const previous_url = this.url;
    this.url = undefined;
    return previous_url;
  }
}
