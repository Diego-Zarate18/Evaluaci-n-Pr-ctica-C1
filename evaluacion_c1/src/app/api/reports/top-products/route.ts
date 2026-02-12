import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 20);
    const offset = (page - 1) * limit;
    const searchTerm = searchParams.get("q") || "";

    const sql = `
      SELECT *
      FROM vw_top_products_ranked
      WHERE product_name ILIKE $1
      ORDER BY rank_revenue ASC
      LIMIT $2 OFFSET $3
    `;

    const rows = await query(sql, [`%${searchTerm}%`, limit, offset]);

    return NextResponse.json({ rows, page, limit, q: searchTerm });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching products data" }, { status: 500 });
  }
}
