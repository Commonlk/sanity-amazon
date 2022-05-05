import nc from 'next-connect';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import config from '../../../utils/config';
import User from '../../../models/user';
import { isAuth, signToken } from '../../../utils/auth';

interface ExtendedRequest extends NextApiRequest {
  user: User;
}

const handler = nc<ExtendedRequest, NextApiResponse>();

handler.use(isAuth);

handler.put(async (req, res) => {
  const tokenWithRW = process.env.SANITY_AUTH_TOKEN;
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.user._id,
            set: {
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password),
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

  const user = {
    _id: req.user._id,
    name: req.body.name,
    email: req.body.email,
    isAdmin: req.user.isAdmin,
  };

  const token = signToken(user);

  res.send({ ...user, token });
});

export default handler;
