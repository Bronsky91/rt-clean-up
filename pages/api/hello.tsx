// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { createDatabase } from "./utlis/create-database";

type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.statusCode = 200;
  res.json({ name: "John Doe" });
  const db = await createDatabase();
  const tables = await db.query("SHOW tables");
  console.log(tables);
};