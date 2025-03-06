import { db } from "@/app/db/mongo";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collection = db.collection("cart");
  const product = await collection.findOne({ productId: id });
  return new Response(JSON.stringify({ isInCart: !!product }), { status: 200 });
}
