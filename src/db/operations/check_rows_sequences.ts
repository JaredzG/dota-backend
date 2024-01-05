import { sql } from "drizzle-orm";
import { createPool, connectDB } from "../db";

const pool = await createPool();
const db = await connectDB(pool);

// Check that each table id sequence last value matches the count of rows in the corresponding table.
const rowCountsResult = await db.execute(
  sql`SELECT relname AS table_name, n_live_tup AS row_count FROM pg_stat_user_tables`
);
const lastSequenceValuesResult = await db.execute(
  sql`SELECT sequencename, last_value FROM pg_sequences`
);
const tables = rowCountsResult.rows.filter(
  (row) => String(row.table_name) !== "__drizzle_migrations"
);
const sequences = lastSequenceValuesResult.rows.filter(
  (row) => String(row.sequencename) !== "__drizzle_migrations"
);
for (const table of tables) {
  const { table_name: tableName, row_count: rowCount } = table;
  const { sequencename: sequenceName, last_value: lastValue } =
    sequences.filter(
      (sequence) => String(sequence.sequencename).slice(0, -7) === tableName
    )[0];
  if (rowCount === lastValue || (rowCount === "0" && lastValue === null)) {
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Success: Equal values -- ${tableName} (${rowCount}) | ${sequenceName} (${lastValue})`
    );
  } else {
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Error: Unequal values -- ${tableName} (${rowCount}) | ${sequenceName} (${lastValue})`
    );
  }
}

await pool.end();
