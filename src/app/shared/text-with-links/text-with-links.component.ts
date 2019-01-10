import { Component, Input } from '@angular/core';

export interface IPart {
  content: string;
  isLink?: boolean;
}

@Component({
  selector: 'app-text-with-links',
  templateUrl: './text-with-links.component.html',
  styleUrls: ['./text-with-links.component.scss'],
})
export class TextWithLinksComponent {
  parts: IPart[] = [];

  @Input() set text(value: string | undefined) {
    const parts: IPart[] = [];
    while (value) {
      const match = /^(.*?)(https?:\/\/[^\s"']+)/.exec(value);
      if (match) {
        if (match[1]) {
          parts.push({ content: match[1] });
        }
        parts.push({ content: match[2], isLink: true });
        value = value.substr(match[0].length);
      } else {
        parts.push({ content: value });
        value = '';
      }
    }
    this.parts = parts;
  }
}