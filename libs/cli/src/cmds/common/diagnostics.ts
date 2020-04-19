import * as chalk from 'chalk';

/**
 * This class is used to collect and then report warnings and errors that occur during the execution
 * of the tools.
 */
export class Diagnostics {
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

  formatDiagnostics(message: string): string {
    const errors = this.messages!.filter(d => d.type === 'error').map(
      d => ' - ' + d.message
    );
    const warnings = this.messages!.filter(d => d.type === 'warning').map(
      d => ' - ' + d.message
    );
    if (errors.length) {
      message += '\nERRORS:\n' + errors.join('\n');
    }
    if (warnings.length) {
      message += '\nWARNINGS:\n' + warnings.join('\n');
    }
    return message;
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
