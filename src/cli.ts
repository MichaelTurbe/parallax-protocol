#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
    .name('parallax-protocol-cli')
    .description('TypeScript CLI for Parallax Protocol')
    .version('0.1.0');

// Example command: ping
program
    .command('ping')
    .description('Responds with pong')
    .action(() => {
        console.log('pong');
    });

// Example command: echo
program
    .command('echo <message>')
    .description('Prints a message to the console')
    .option('-u, --upper', 'Convert to uppercase')
    .action((message: string, options: { upper?: boolean }) => {
        const output = options.upper ? message.toUpperCase() : message;
        console.log(output);
    });

// Example command: add
program
    .command('add <a> <b>')
    .description('Adds two numbers')
    .action((a: string, b: string) => {
        const sum = Number(a) + Number(b);
        console.log(`${a} + ${b} = ${sum}`);
    });

// Parse the CLI input
program.parse(process.argv);
