import { createConnection, Connection } from "mysql";
import { promisify } from "util";
import { dumpImporter } from "./dump-importer";

export const connectToDatabase = async (database: string) => {
  // Creates a DB based on a Redtail CRM Backup
  const host = "127.0.0.1";
  const user = "root";
  const password = "friend91";

  const makeDb = () => {
    const connection: Connection = createConnection({
      host,
      user,
      password,
      database,
    });
    return {
      query(sql: any, args?: any) {
        return promisify(connection.query).call(connection, sql, args);
      },
      close() {
        return promisify(connection.end).call(connection);
      },
    };
  };

  const db = makeDb();

  return db;
};
