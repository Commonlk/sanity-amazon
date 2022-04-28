import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../utils/config';
import client from '../../../utils/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../../utils/auth';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithRW = process.env.SANITY_AUTH_TOKEN;

  const createMutations = [
    {
      create: {
        _type: 'user',
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
      },
    },
  ];

  const existUser = await client.fetch(
    '*[_type == "user" && email == $email][0]',
    {
      email: req.body.email,
    }
  );

  if (existUser) {
    return res.status(401).send({ message: 'Email already exists' });
  }

  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    {
      mutations: createMutations,
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenWithRW}`,
      },
    }
  );

  const userId = data.results[0].id;
  const user = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    isAdmin: false,
  };

  const token = signToken(user);

  res.send({ ...user, token });
});

export default handler;
