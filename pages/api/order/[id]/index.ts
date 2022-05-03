import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '../../../../utils/auth';
import client from '../../../../utils/client';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(isAuth);

handler.get(async (req, res) => {
  const order = await client.fetch(`*[_type == "order" && _id == $id][0]`, {
    id: req.query.id,
  });

  res.send(order);
});

export default handler;
