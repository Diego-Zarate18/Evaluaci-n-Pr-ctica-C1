import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 50);
    const offset = (page - 1) * limit;

    const sql = `
      SELECT customer_id, customer_name, total_orders, total_spent, avg_ticket
      FROM vw_customer_value
      ORDER BY total_spent DESC
      LIMIT $1 OFFSET $2
    `;

    const rows = await query(sql, [limit, offset]);

    return NextResponse.json({ rows, page, limit });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching customer data" }, { status: 500 });
  }
}
