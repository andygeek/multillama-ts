#!/usr/bin/env node
import http from 'http';
import ConfigManager from './config/ConfigManager.js';

const args = process.argv.slice(2);

function startWeb(port: number) {
  let config;
  try {
    config = ConfigManager.getConfig();
  } catch (err) {
    try {
      ConfigManager.initializeFromFile('multillama.config.json');
      config = ConfigManager.getConfig();
    } catch (err2) {
      console.error('MultiLlama configuration not found.');
      process.exit(1);
    }
  }
  const html = `<html><head><title>MultiLlama Connections</title></head><body><h1>MultiLlama Connections</h1><pre>${JSON.stringify(config, null, 2)}</pre></body></html>`;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

if (args[0] === 'web') {
  const port = 3300;
  startWeb(port);
} else {
  console.log('Usage: multillama web');
}
