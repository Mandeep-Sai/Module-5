const request = require("request");
const fs = require("fs");
const csvParse = require("csv-parse");
const through = require("through2");
const url = "https://skimdb.npmjs.com/registry/_changes?include_docs=true";

request.get(url).pipe(process.stdout);

fs.createReadStream("")
  .on("data", (data) => console.log(data.toString()))
  .on("error", (err) => console.log(err));

const myWriteStream = fs.createWriteStream("");

fs.createReadStream("").pipe(myWriteStream);

//source --> parse --> destination

fs.createReadStream("")
  .pipe(csvParse())
  .on("data", (data) => console.log(data.toString()));

// source --> parse --> object --> dest

const transformStream = through.obj((chunk, enc, done) => {
  const niceObj = {
    name: chunk[0],
  };
  done(null, niceObj);
});
