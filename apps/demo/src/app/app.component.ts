import { Component } from '@angular/core';

const name = '$localize';
const lib = 'Locl';

@Component({
  selector: 'locl-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = $localize`Welcome to the demo of ${name} and ${lib} made for ${name}!`;

  constructor() {
    console.log($localize`:@@foo:custom id!`);
  }
}
