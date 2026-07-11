import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as orders from "../orders.js";
import type * as tickets from "../tickets.js";

declare const fullApi: ApiFromModules<{
  orders: typeof orders;
  tickets: typeof tickets;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
