#!/usr/bin/env node
import { Command } from 'commander';
import { getPage } from '../pageLoader/pageLoader.js';

const program = new Command();
program.name('page-loader').description('Page loader utility').version('0.0.1');

program
  .option(
    '-o, --output [dir]',

    'output dir',
    '/home/user/current-dir',
  )
  .argument('<url>')
  .action((link, dir) => getPage(link, dir.output));

program.parseAsync();

export default program;
