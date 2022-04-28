import jwt from 'jsonwebtoken';
import IUser from '../models/user';

const signToken = (user: IUser) => {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

export { signToken };
