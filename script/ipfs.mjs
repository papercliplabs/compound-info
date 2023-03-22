import { create, globSource } from 'ipfs-http-client';
import { Agent } from 'https';
import { writeFile } from 'fs/promises';
import * as dotenv from 'dotenv'

dotenv.config()

const ipfsAuth = process.env.IPFS_AUTH ?? "";
const ipfsHost = process.env.IPFS_HOST
const ipfsPort = process.env.IPFS_PORT ? parseInt(process.env.IPFS_PORT) : 5001;
const ipfsProtocol = process.env.IPFS_SSL === 'false' ? 'http' : 'https';
const ipfsDomain = process.env.IPFS_DOMAIN ?? ipfsHost;

if (!ipfsHost) {
  console.error("Must set IPFS_HOST");
  process.exit(1);
}

let authorization = `Basic ${Buffer.from(ipfsAuth).toString('base64')}`;

function buildIpfsClient() {
  return create({
    host: ipfsHost,
    port: ipfsPort,
    protocol: ipfsProtocol,
    headers: {
      authorization
    },
    // apiPath: '/api/v0',
    agent: new Agent({
      keepAlive: false,
      maxSockets: Infinity
    })
  });
}

(async function() {
  let ipfs = buildIpfsClient();
  function progress(size, path) {
    console.log(`Sent ${Math.round(size / 1000)}KB for ${path}`);
  }
  const files = []
  for await (const file of ipfs.addAll(globSource('build', '**/*'), { recursive: true, progress, wrapWithDirectory: true})) {
    files.push(file);
    console.log(file)
  }
  let app = files[files.length - 1]; // Last one if the directory
  if (app === null) {
    throw new Error("Missing core application cid");
  }
  console.log(`Pushed [size=${app.size}, cid=${app.cid}]`);

  const urls = [
    ["IPFS Url", `https://ipfs.io/ipfs/${app.cid}`],
    ["Cloudflare Url", `https://cloudflare-ipfs.com/ipfs/${app.cid}`],
    ["Infura Url", `https://${ipfsDomain}/ipfs/${app.cid}`],
  ];
  const urlText = urls.map(([name, url]) => `  * ${name}: ${url}`).join("\n");

  console.log("\n\n");
  console.log("🗺  App successfully deployed to ipfs:\n");
  console.log(urlText);
  console.log("\n");

  writeFile('.release', `${app.cid}`, 'utf8');
})();
