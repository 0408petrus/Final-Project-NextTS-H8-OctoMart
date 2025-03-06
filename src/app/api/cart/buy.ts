import { db } from "@/app/db/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cartItems } = await req.json();
  const productCollection = db.collection("products");

  for (const item of cartItems) {
    await productCollection.updateOne(
      { id: item.id },
      { $inc: { "rating.count": -item.quantity } }
    );
  }

  return NextResponse.json({ message: "Checkout successful" }, { status: 200 });
}
