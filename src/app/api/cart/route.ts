import { db } from "@/app/db/mongo";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const productId = url.pathname.split('/').pop();
    const collection = db.collection("cart");
    const product = await collection.findOne({ productId });
    return new Response(JSON.stringify({ isInCart: !!product }), { status: 200 });
}

export async function POST(req: Request) {
    const { productId, quantity } = await req.json();
    const collection = db.collection("cart");
    const productCollection = db.collection("products");

    const existingProduct = await collection.findOne({ productId });

    if (existingProduct) {
        return new Response(JSON.stringify({ message: "Product already in cart" }), { status: 400 });
    }

    await collection.insertOne({ productId, quantity });

    // Update the stock count in the products collection
    await productCollection.updateOne(
        { id: productId },
        { $inc: { "rating.count": -quantity } }
    );

    return new Response(JSON.stringify({ message: "Product added to cart" }), { status: 201 });
}
