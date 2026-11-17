import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authenticate } from '@google-cloud/local-auth';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const credentialsPath = path.join(root, 'credentials.json');
const tokenPath = path.join(root, 'token.json');
const scopes = ['https://www.googleapis.com/auth/gmail.modify'];
const client = await authenticate({ scopes, keyfilePath: credentialsPath });
await writeFile(tokenPath, JSON.stringify(client.credentials, null, 2), { mode: 0o600 });
console.log('Autorizzazione Gmail completata. Token salvato in token.json.');
