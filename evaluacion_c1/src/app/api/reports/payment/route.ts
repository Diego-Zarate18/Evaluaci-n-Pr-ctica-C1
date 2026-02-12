import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT payment_method, total_payments, total_amount, percentage_usage
      FROM vw_payment_mix
      ORDER BY total_amount DESC
    `;

    const rows = await query(sql);

    return NextResponse.json({ rows });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching payment data" }, { status: 500 });
  }
}
