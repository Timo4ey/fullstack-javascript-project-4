#!/usr/bin/env node

import { Command } from 'commander';
import dataLoader from '../src/loaders/dataLoader.js';

const program = new Command();
// program.name('page-loader').description('Page loader utility').version('0.0.1');

// program
//   .argument('<url>')
//   .option('-o, --output [dir]', 'output dir path', process.cwd())
//   .action((link, dir) => {
//     console.log(program.opts());
//     dataLoader(link, dir.output).catch((err) => {
//       console.error(err);
//       process.exit(1);
//     });
//   });

program
  .description('Page loader utility')
  .arguments('<url>')
  .version('0.0.1')
  .option('-o, --output [dir]', 'output dir path', process.cwd())
  .action((url) => {
    const options = program.opts();
    dataLoader(url, options.output)
      .then((filePath) => console.log(`Page was successfully downloaded into '${filePath}'`))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  });

program.parse(process.argv);
