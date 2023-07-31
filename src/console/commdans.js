#!/usr/bin/env node
import { Command } from 'commander';
import { loadImagesFromDOM } from '../loaders/imageLoader.js';

const program = new Command();
program.name('page-loader').description('Page loader utility').version('0.0.1');

program
  .option(
    '-o, --output [dir]',

    'output dir',
    '/home/user/current-dir',
  )
  .argument('<url>')
  .action((link, dir) => loadImagesFromDOM(link, dir.output));

export default program;
