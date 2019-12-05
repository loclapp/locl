import { Component } from '@angular/core';

@Component({
  selector: 'locl-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div>
      <h1>Welcome to {{ title }}!</h1>
      <button class="button is-primary">click me</button>
      <input class="input" type="text" />
    </div>
  `
})
export class AppComponent {
  title = 'web';
}
