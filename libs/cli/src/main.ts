import * as yargs from 'yargs';
import * as findUp from 'find-up';
import * as fs from 'fs';
const configPath = findUp.sync(['.loclrc', '.locl.json']);
const config = configPath
  ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }))
  : {};

const args = process.argv.slice(2);
yargs
  .config(config)
  .commandDir('cmds')
  .demandCommand()
  .strict()
  .help()
  .version(false)
  .parse(args);
