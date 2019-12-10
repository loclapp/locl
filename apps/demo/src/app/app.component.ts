import { Component } from '@angular/core';

const name = '$localize + Locl';

@Component({
  selector: 'locl-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = $localize`Welcome to the demo of ${name}!`;

  constructor() {
    console.log($localize`:@@foo:custom id!`);
  }
}
