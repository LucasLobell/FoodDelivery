import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const session = await getAuthSession();

  if (session?.user.isAdmin) {
    try {
      await prisma.product.delete({
        where: {
          id: id,
        },
      });

      return new NextResponse(JSON.stringify("Product deleted!"), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "something went wrong!" }),
        { status: 500 }
      );
    }
  }
  return new NextResponse(
    JSON.stringify({ message: "You don't have permission!" }),
    { status: 403 }
  );
};
