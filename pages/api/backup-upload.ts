import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable-serverless";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm();
  form.uploadDir = "./backups";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    const databaseName = files.file.name.split(".")[0];
    const filePath = files.file.path;
    // createDatabase();
    res.statusCode = 200;
    res.json({ databaseName });
  });
};
