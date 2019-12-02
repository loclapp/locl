import { Component } from '@angular/core';

@Component({
  selector: 'locl-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <h1 i18n>Welcome to app {{ title }}!</h1>
  `
})
export class AppComponent {
  title = 'web-demo';

  constructor() {
    console.log($localize`:@@foo:Welcome to ${'web'}!`);
    console.log($localize`foo`);
  }
}
