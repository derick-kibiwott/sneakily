// @/db/functions/rls.ts
import "server-only";
import { sql } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@/db/schema";

/**
 * A second client used only for queries that need RLS. The main neon-http `db`
 * can't run interactive transactions, but a WebSocket Pool can.
 *
 * DATABASE_URL must point at the restricted `app_user` role (see rls-setup.sql),
 * otherwise RLS isn't enforced.
 *
 * On Node < 22 you also need a WebSocket implementation:
 *   import ws from "ws"; neonConfig.webSocketConstructor = ws;
 */

const pool = new Pool({
  connectionString: process.env.NEON_POOLED_CONNECTION_URL,
});

const rlsDb = drizzle({ client: pool, schema });

export type TX = Parameters<Parameters<typeof rlsDb.transaction>[0]>[0];

/**
 * Runs `fn` in a transaction with `app.user_id` set, which is what the
 * recovery_phrase RLS policy checks. The `true` argument makes the setting
 * transaction-local, so it can't leak to another request on a pooled connection.
 *
 * Needs a driver with interactive transactions (drizzle neon-serverless or
 * node-postgres). The neon-http driver does not support db.transaction.
 */

export function withUser<T>(
  userId: string,
  fn: (tx: TX) => Promise<T>,
): Promise<T> {
  return rlsDb.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
    return fn(tx);
  });
}
