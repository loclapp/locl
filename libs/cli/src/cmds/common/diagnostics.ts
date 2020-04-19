import * as chalk from 'chalk';
import { Diagnostics as _D } from '@angular/localize/src/tools/src/diagnostics';

/**
 * This class is used to collect and then report warnings and errors that occur during the execution
 * of the tools.
 */
export class Diagnostics extends _D {
  readonly messages = [];

  get hasErrors() {
    return this.messages.some(m => m.type === 'error');
  }

  log(message: string) {
    this.messages.push({ type: '', message });
  }

  warn(message: string) {
    this.messages.push({ type: 'warning', message });
  }

  error(message: string) {
    this.messages.push({ type: 'error', message });
  }

  logMessages() {
    while (this.messages.length) {
      const m = this.messages.shift();
      switch (m.type) {
        case 'warning':
          console.warn(chalk.yellow(`Warning: ${m.message}`));
          break;
        case 'error':
          console.error(chalk.red(`Error: ${m.message}`));
          break;
        default:
          console.log(chalk.blue(`${m.message}`));
      }
    }
  }
}
