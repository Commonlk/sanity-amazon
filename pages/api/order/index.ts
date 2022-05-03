import config from '../../../utils/config';
import axios from 'axios';
import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '../../../utils/auth';

interface ExtendedRequest extends NextApiRequest {
  user: any;
}

const handler = nc<ExtendedRequest, NextApiResponse>();

handler.use(isAuth);

handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithRW = process.env.SANITY_AUTH_TOKEN;

  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    {
      mutations: [
        {
          create: {
            _type: 'order',
            createdAt: new Date().toISOString(),
            ...req.body,
            userName: req.user.name,
            user: {
              _type: 'reference',
              _ref: req.user._id,
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

  res.status(201).send(data.results[0].id);
});

export default handler;
