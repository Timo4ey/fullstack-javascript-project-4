#!/usr/bin/env node

import { Command } from 'commander';
import dataLoader from '../src/loaders/dataLoader.js';

const program = new Command();
program.name('page-loader').description('Page loader utility').version('0.0.1');

program
  .option(
    '-o, --output [dir]',

    'output dir',
    '/home/user/current-dir',
  )
  .argument('<url>')
  .action((link, dir) => dataLoader(link, dir.output))
  // .then((filePath) => console.log(`Page was successfully downloaded into '${filePath}'`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

program.parse(process.argv);
