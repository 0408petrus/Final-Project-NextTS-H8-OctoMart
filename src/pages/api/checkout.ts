// filepath: src/pages/api/checkout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../utils/db';
import Product from '../../models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { cart } = req.body;

  for (const item of cart) {
    const product = await Product.findById(item.id);
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    product.stock -= item.quantity;
    await product.save();
  }

  res.status(200).json({ message: 'Checkout successful' });
}