const https = require('https');
setInterval(() => {
  https.get('https://www.mongodb.com', () => {}).on('error', () => {});
}, 5 * 60 * 1000);

