import childProcess from 'child_process';

function startPackager() {
  return new Promise((resolve) => {
    const pwd = process.cwd();
    const path = `${pwd}/example/node_modules/react-native/packager/packager.sh`;

    const packager = childProcess.spawn('bash', [path, '--port', '8081']);

    let packagerReady = false;
    packager.stdout.on('data', (data) => {
      if (packagerReady) return;
      console.log(`[PACKAGER]: ${data}`);
      if (
        data.indexOf('React packager ready.') >= 0 ||
        data.indexOf("Packager can't listen on port") >= 0
      ) {
        packagerReady = true;
        resolve(packager);
      }
    });

    packager.stderr.on('data', (data) => {
      console.log(`[PACKAGER]: error ${data}`);
    });

    packager.on('close', (code) => {
      console.log(`[PACKAGER]: exited with code ${code}`);
    });

    process.on('exit', () => {
      packager.kill();
    });
  });
}

class Packager {
  constructor() {
    this.server = null;
  }

  async start() {
    if (this.server) { return this.server; }

    this.server = await startPackager();

    return this.server;
  }

  async stop() {
    if (!this.server) { return; }

    // For some reason kill() does not kill the server.
    // await new Promise((resolve) => {
    //   this.server.on('close', resolve);
    //   this.server.kill('SIGKILL');
    // });
  }
}

export default Packager;
