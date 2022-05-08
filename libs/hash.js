const sha256 = require('sha256');
const secret = process.env.SECRET_KEY || '%2377sjdhsdh*&*(&S&AD(&*(@gshdhjagd';
const moment = require('moment-timezone').tz('Asia/Ho_Chi_Minh');

function createHash(payload) {
  const dateStr = moment.format('MMMM Do YYYY, h:mm').toString();
  const prefix = `${dateStr}${secret}`;
  const data = payload.toString().replace(/\n/g, '').replace(/ /g, '');
  const str = prefix + data;
  const hash = sha256(str);

  return hash;
}

function validHash(payload, hashStr) {
  const dateStr = moment.format('MMMM Do YYYY, h:mm').toString();
  const prefix = `${dateStr}${secret}`;
  const data = payload.toString().replace(/\n/g, '').replace(/ /g, '');
  const str = prefix + data;
  const hash = sha256(str);
  console.log(hash);
  console.log(hashStr);
  
  return hash === hashStr;
}

module.exports = {
  createHash,
  validHash
}