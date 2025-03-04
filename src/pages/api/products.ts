// filepath: src/pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../utils/db';
import Product from '../../models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const products = await Product.find({});
  res.status(200).json(products);
}