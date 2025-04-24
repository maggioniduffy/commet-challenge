import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Sale, File } from "@/models";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST")
      return NextResponse.json(
        { error: "Method not allowed", status: 405 },
        { status: 405 }
      );

    const body = await req.json();
    const { sales, files } = body;
    console.log("sales", sales);
    console.log("files", files);

    if (!sales || !files) {
      return NextResponse.json(
        { error: "Sales or files not provided", status: 400 },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const crm = await tx.cRM.create({ data: { created_at: new Date() } });

      await Promise.all(
        sales.map((sale: Sale) =>
          tx.sale.create({
            data: {
              id: sale.id,
              amount: sale.amount,
              salesperson: sale.salesperson,
              date: new Date(sale.date).toISOString(),
              comission: sale.comission,
              crmId: crm.id,
            },
          })
        )
      );

      await Promise.all(
        files.map((file: File) =>
          tx.upcomingCRM.update({
            where: { id: file.id },
            data: { crm_id: crm.id },
          })
        )
      );
    });

    return NextResponse.json({ succes: true, sales, files }, { status: 200 });
  } catch (error) {
    console.error("Server error saving sales:", error);
    return NextResponse.json(
      { error: "Failed to save sales" },
      { status: 500 }
    );
  }
}
