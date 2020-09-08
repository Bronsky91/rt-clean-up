// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.statusCode = 200;
  // TODO: Update new database (for spreadsheet purposes)
  // TODO: Update Contact within Redtail
  console.log(req.body);
  res.end();
};
