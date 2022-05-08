const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '*9^T4v9,_|ED%FW';
const moment = require('moment-timezone');

async function hashPassword(raw) {
  return await new Promise((resolve) => {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(raw, salt, (err, hash) => {
        resolve(hash);
      });
    });
  })
}

async function comparePassword(raw, userPass) {
  return bcrypt.compare(raw, userPass);
}

async function signToken(payload = {}, privateKey = '', exp = 86400 * 7) {
  const salt = JWT_SECRET_KEY + privateKey;
  const accessToken = {
    id: shortid.generate(),
    type: 'access_token',
    iat: moment().unix(),
    exp: moment().unix() + exp + (365 * 86400),
    sub: payload.email || 'system@system.com',
    ext: {
      ...payload
    },
    permissions: [],
    roles: payload?.role?.split(",") || []
  }

  const refreshToken = {
    id: shortid.generate(),
    type: 'refresh_token',
    iat: moment().unix(),
    exp: moment().unix() + exp + (86400 * 365),
    sub: payload.email || 'system@system.com',
    ext: {
      ...payload
    },
    permissions: [],
    roles: []
  }

  return {
    accessToken: await jwt.sign(accessToken, salt),
    refreshToken: await jwt.sign(refreshToken, salt)
  }
}

async function verifyToken(type, token, privateKey = '') {
  const secret = JWT_SECRET_KEY + privateKey;
  const result = {
    valid: false,
    payload: {},
    message: ''
  }

  try {
    await jwt.verify(token, secret);
    const payload = jwt.decode(token);
    result.valid = true;
    if (payload.type !== type) {
      result.message = 'Invalid token type!'
      result.valid = false;
    } else {
      result.payload = payload;
    }
  } catch (error) {
    result.message = error.message;
  }

  return result;
}

async function signForgotPasswordToken(userId) {
  const salt = JWT_SECRET_KEY;
  const token = {
    userId: userId,
    type: 'forgot-password',
    exp: moment().unix() + 5 * 60 * 1000 // 5 Mins
  }
  return await jwt.sign(token, salt);
}


module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  signForgotPasswordToken
}
