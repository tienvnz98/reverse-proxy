const { createHash, validHash } = require('../libs/hash');

module.exports = () => {
  return async (req, res, next) => {
    const { client_key = '' } = req.headers || {};
    const body = req.body || {};
    const hash = createHash(body);
    console.log('Create:', hash);

    const valid = validHash(body, client_key);
    // Validate client here
    if (!valid) {
      res.status(401);
      return res.end('401 unauthorized');
    }

    await next();
  }
}   