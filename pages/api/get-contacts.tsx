import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./utlis/connect-to-database";
import { RedtailContact } from "../../interfaces/redtail.interface";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase("rtbackup");
  const contacts: RedtailContact[] = await db.query(`SELECT * FROM contacts`);
  db.close();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(contacts));
};
