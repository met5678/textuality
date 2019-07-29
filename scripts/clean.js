const { spawn } = require('child_process');
const path = require('path');
const colors = require('colors');

const	adminDir = path.join(__dirname, '../admin-app');
let adminProc = spawn('npm', ['clean'], {
	cwd: adminDir,
	stdio: [
	]
});

adminProc.on('error', (err) => {
	console.log(err.toString().red);
});

adminProc.stdout.on('data', (chunk) => {
	console.log(chunk.toString('utf8').trim().blue);
});

const	clientDir = path.join(__dirname, '../client-app');
let clientProc = spawn('npm', ['clean'], {
	cwd: clientDir,
	stdio: [
	]
});

clientProc.on('error', (err) => {
	console.log(err.toString().red);
});

clientProc.stdout.on('data', (chunk) => {
	console.log(chunk.toString('utf8').trim().green);
});
