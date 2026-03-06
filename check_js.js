import https from 'https';

https.get('https://portfolio-delta-teal-vfnecry5m3.vercel.app/assets/index-C0rLbgRe.js', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Body:', data.substring(0, 200)));
});
