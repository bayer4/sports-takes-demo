import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const takeId = parseInt(id, 10);

  if (isNaN(takeId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const result = body?.result?.toString().toUpperCase();

  if (!["HIT", "MISS", "PUSH"].includes(result)) {
    return Response.json(
      { error: "Result must be HIT, MISS, or PUSH" },
      { status: 400 }
    );
  }

  // Check if take exists and is still OPEN
  const existing = await prisma.take.findUnique({ where: { id: takeId } });
  
  if (!existing) {
    return Response.json({ error: "Take not found" }, { status: 404 });
  }

  if (existing.result !== "OPEN") {
    return Response.json(
      { error: "Take has already been resolved" },
      { status: 400 }
    );
  }

  const take = await prisma.take.update({
    where: { id: takeId },
    data: { result }
  });

  return Response.json({ take });
}

