import { db } from "@/app/db/mongo";
import { IProduct } from "@/app/definitions/products";

export async function POST(req: Request) {
  const { cartItems }: { cartItems: IProduct[] } = await req.json();
  const collection = db.collection("products");

  for (const item of cartItems) {
    await collection.updateOne(
      { id: item.id },
      { $inc: { "rating.count": -item.rating.count } }
    );
  }

  return new Response(JSON.stringify({ message: "Purchase successful" }), { status: 200 });
}
