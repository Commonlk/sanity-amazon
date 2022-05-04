import User from '../models/user';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const signToken = (user: User) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

interface ExtendedRequest extends NextApiRequest {
  user: string | jwt.JwtPayload | undefined;
}

const isAuth = (
  req: ExtendedRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // BEARER XXX
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token was not supplied' });
  }
};

export { signToken, isAuth };
