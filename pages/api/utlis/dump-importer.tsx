const Importer = require("mysql-import");

export const dumpImporter = (
  host: string,
  user: string,
  password: string,
  database: string
) => {
  const importer = new Importer({ host, user, password, database });

  return importer
    .import("/Users/bronsky/Desktop/rt-to-csv/f50c4fa6-7dfc-4da4-84bb-440d617889582.sql")
    .then(() => {
      var files_imported = importer.getImported();
      console.log(`${files_imported.length} SQL file(s) imported.`);
    })
    .catch((err: any) => {
      console.error(err);
    });
};