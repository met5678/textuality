const { spawn } = require('child_process');
const path = require('path');
const colors = require('colors');

const adminDir = path.join(__dirname, '../textuality-admin');
let adminProc = spawn('npm', ['start'], {
	cwd: adminDir,
	stdio: []
});

adminProc.on('error', err => {
	console.log(err.toString().red);
});

adminProc.stdout.on('data', chunk => {
	console.log(chunk.toString('utf8').trim().blue);
});

const clientDir = path.join(__dirname, '../textuality-client');
let clientProc = spawn('npm', ['start'], {
	cwd: clientDir,
	stdio: []
});

clientProc.on('error', err => {
	console.log(err.toString().red);
});

clientProc.stdout.on('data', chunk => {
	console.log(chunk.toString('utf8').trim().green);
});
