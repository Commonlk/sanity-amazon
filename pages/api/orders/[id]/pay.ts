import nc from 'next-connect';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { isAuth } from '../../../../utils/auth';
import config from '../../../../utils/config';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(isAuth);

handler.put(async (req, res) => {
  const tokenWithRW = process.env.SANITY_AUTH_TOKEN;
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.query.id,
            set: {
              isPaid: true,
              paidAt: new Date().toISOString(),
              'paymentResult.id': req.body.id,
              'paymentResult.status': req.body.status,
              'paymentResult.email_address': req.body.email_address,
            },
          },
        },
      ],
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenWithRW}`,
      },
    }
  );
  res.send({ message: 'Order paid' });
});

export default handler;
