import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import client from '../../../utils/client';
import { signToken } from '../../../utils/auth';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const user = await client.fetch('*[_type == "user" && email == $email][0]', {
    email: req.body.email,
  });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

export default handler;
