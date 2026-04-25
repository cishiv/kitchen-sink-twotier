/**
 * db:doc — print a mermaid ER skeleton from the current Drizzle schema.
 *
 * Phase 0 stub: introspects table names and columns by importing the
 * schema module and printing a minimal mermaid block. Hand-edit
 * DATABASEMODEL.md to add prose; run this when the schema changes
 * to refresh the diagram skeleton.
 */
import { getTableColumns, getTableName, isTable } from "drizzle-orm";
import * as schema from "@/db/schema";

const tables = Object.entries(schema).filter(([, value]) => isTable(value));

const lines: Array<string> = [];
lines.push("```mermaid");
lines.push("erDiagram");

for (const [, table] of tables) {
  const name = getTableName(table as never);
  const columns = getTableColumns(table as never);
  lines.push(`  ${name} {`);
  for (const [colName, col] of Object.entries(columns)) {
    const sqlType = (col as { dataType?: string }).dataType ?? "unknown";
    const notNull = (col as { notNull?: boolean }).notNull ? " NOT_NULL" : "";
    lines.push(`    ${sqlType} ${colName}${notNull}`);
  }
  lines.push("  }");
}

lines.push("```");

console.log(lines.join("\n"));
