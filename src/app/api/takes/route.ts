import { prisma } from "../../../lib/prisma";

export async function GET() {
  const takes = await prisma.take.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return Response.json({ takes });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const author = (body?.author ?? "").toString().trim();
  const text = (body?.text ?? "").toString().trim();
  const confidence = (body?.confidence ?? "NORMAL").toString().trim();

  if (!author || !text) {
    return Response.json({ error: "author and text are required" }, { status: 400 });
  }

  const take = await prisma.take.create({
    data: {
      author,
      text,
      confidence,
      result: "OPEN"
    }
  });

  return Response.json({ take });
}
