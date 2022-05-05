import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import client from '../../../utils/client';
import User from '../../../models/user';
import { isAuth } from '../../../utils/auth';

interface ExtendedRequest extends NextApiRequest {
  user: User;
}

const handler = nc<ExtendedRequest, NextApiResponse>();

handler.use(isAuth);

handler.get(async (req, res) => {
  const orders = await client.fetch(
    `*[_type == "order" && user._ref == $userId]`,
    { userId: req.user._id }
  );
  res.send(orders);
});

export default handler;
