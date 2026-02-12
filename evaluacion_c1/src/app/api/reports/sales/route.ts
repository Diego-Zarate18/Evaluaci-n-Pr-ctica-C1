import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const defaultTo = new Date().toISOString().split("T")[0];
    const defaultFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const dateFrom = searchParams.get("from") || defaultFrom;
    const dateTo = searchParams.get("to") || defaultTo;

    const sql = `
      SELECT sale_date, total_revenue, ticket_count, avg_ticket
      FROM vw_sales_daily
      WHERE sale_date BETWEEN $1 AND $2
      ORDER BY sale_date DESC
    `;

    const rows = await query(sql, [dateFrom, dateTo]);

    return NextResponse.json({ rows, dateFrom, dateTo });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching sales data" }, { status: 500 });
  }
}
