import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear session cookie here
  res.status(200).json({ message: 'Logged out successfully' });
}