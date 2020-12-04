declare function $wrapper(fn: any, decoder: any): (req: any, res: any, next: any) => Promise<void>;
declare function $required(name: any, value: any): any;
declare const sql: postgres.Sql<{}>;
import postgres from "postgres";
export { $wrapper as $, $required as a, sql as s };
