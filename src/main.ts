import initAsync from './app';
import config from './config';

async function main(): Promise<void> {
  try {
    const server = await initAsync();
    server.listen(config.port);
    console.log(`HTTP server is listening on ${config.port}`);
  } catch (e) {
    console.log('Error running server!');
    console.error(e);
    process.exit(1);
  }
}

void main();
