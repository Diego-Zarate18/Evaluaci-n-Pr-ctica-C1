import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const VALID_RISK_LEVELS = ["ALTO", "MEDIO", "BAJO"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const riskFilter = searchParams.get("risk") || "ALL";

    let sql = `
      SELECT product_id, product_name, category_name, stock, risk_level, stock_percentage_relative
      FROM vw_inventory_risk
    `;

    const params: string[] = [];

    if (riskFilter !== "ALL" && VALID_RISK_LEVELS.includes(riskFilter)) {
      sql += ` WHERE risk_level = $1`;
      params.push(riskFilter);
    }

    sql += ` ORDER BY stock ASC`;

    const rows = await query(sql, params);

    return NextResponse.json({ rows, risk: riskFilter });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching inventory data" }, { status: 500 });
  }
}
