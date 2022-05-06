import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const categories = ['Game Consoles', 'Headset', 'Virtual Reality'];
  res.send(categories);
});

export default handler;
