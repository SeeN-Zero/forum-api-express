import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager.js';
import config from '../../Commons/config.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';
import jwt from 'jsonwebtoken';

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  _createTokenPayload(payload, tokenType) {
    if (this._jwt !== jwt) {
      return payload;
    }

    return {
      ...payload,
      tokenType,
    };
  }

  async createAccessToken(payload) {
    return this._jwt.sign(
      this._createTokenPayload(payload, 'access'),
      config.auth.accessTokenKey,
    );
  }

  async createRefreshToken(payload) {
    return this._jwt.sign(
      this._createTokenPayload(payload, 'refresh'),
      config.auth.refreshTokenKey,
    );
  }

  async verifyRefreshToken(token) {
    let payload;
    try {
      payload = this._jwt.verify(token, config.auth.refreshTokenKey);
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }

    if (payload?.tokenType === 'access') {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async verifyAccessToken(token) {
    let payload;
    try {
      payload = this._jwt.verify(token, config.auth.accessTokenKey);
    } catch {
      throw new AuthenticationError('access token tidak valid');
    }

    if (payload?.tokenType === 'refresh') {
      throw new AuthenticationError('access token tidak valid');
    }
  }

  async decodePayload(token) {
    return this._jwt.decode(token);
  }
}

export default JwtTokenManager;
