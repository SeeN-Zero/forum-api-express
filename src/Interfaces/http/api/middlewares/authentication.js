import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

const authenticationMiddleware = (container) => async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AuthenticationError('Missing authentication'));
  }

  try {
    const accessToken = authHeader.replace('Bearer ', '');
    const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);

    await authenticationTokenManager.verifyAccessToken(accessToken);

    req.auth = await authenticationTokenManager.decodePayload(accessToken);
    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticationMiddleware;
