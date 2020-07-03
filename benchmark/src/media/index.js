const express = require("express");
const { join } = require("path");
const fse = require("fs-extra");
const fs = require("fs");
const multer = require("multer");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const { createWriteStream } = require("fs-extra");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

const upload = multer({});
const reviewsPath = join(__dirname, "../reviews/reviews.json");
const mediaPath = join(__dirname, "media.json");
const imagesPath = join(__dirname, "../../public/images");

//
function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
}

//GET method from jsonfile or from OMDB with title or year query
router.get("/", async (req, res) => {
  if (!req.query.title) {
    let file = await fse.readJSON(join(__dirname, "media.json"));
    res.send(file);
  } else if (req.query.year && req.query.title && req.query.type) {
    axios
      .get(
        `http://www.omdbapi.com/?apikey=c0b9281d&t=${req.query.title}&y=${req.query.year}&plot=${req.query.type}`
      )
      .then((response) => res.send(response.data));
  } else if (req.query.year && req.query.title) {
    axios
      .get(
        `http://www.omdbapi.com/?apikey=c0b9281d&t=${req.query.title}&y=${req.query.year}`
      )
      .then((response) => res.send(response.data));
  } else if (req.query.title) {
    axios
      .get(`http://www.omdbapi.com/?apikey=c0b9281d&t=${req.query.title}`)
      .then((response) => res.send(response.data));
  }
});

//GET movie and print a pdf
router.get("/catalogue", async (req, res) => {
  const response = await axios.get(
    `http://www.omdbapi.com/?apikey=c0b9281d&t=${req.query.title}`
  );
  const results = response.data;

  const doc = new PDFDocument();
  doc.pipe(createWriteStream("public/pdfs/results.pdf"));
  doc
    .font("public/fonts/PalatinoBold.ttf")
    .fontSize(20)
    .text(
      "Movie Name: " + JSON.stringify(results.Title).replace(/"/g, ""),
      100,
      100
    );
  doc
    .font("public/fonts/PalatinoBold.ttf")
    .fontSize(20)
    .text(
      "Released in: " + JSON.stringify(results.Year).replace(/"/g, ""),
      100,
      140
    );
  doc.image(join(__dirname, "../../public/images/tt0120736.jpg"), 100, 160, {
    fit: [250, 250],
  });

  doc.end();
  res.send(results);
});

//GET a specific media from OMDB
router.get("/:id", async (req, res) => {
  axios
    .get(`http://www.omdbapi.com/?apikey=c0b9281d&i=${req.params.id}`)
    .then((response) => res.send(response.data));
});

//GET all reviews for specific media
router.get("/:id/reviews", async (req, res) => {
  let reviewsFile = await fse.readJSON(reviewsPath);
  let reviews = reviewsFile.filter(
    (review) => review.elementId === req.params.id
  );
  res.send(reviews);
});

// POST method
router.post("/", async (req, res) => {
  let newMedia = { ...req.body };
  let mediaFile = await fse.readJSON(join(__dirname, "media.json"));
  mediaFile.push(newMedia);
  //fse.writeFileSync(join(__dirname, "media.json"), JSON.stringify(mediaFile));
  await fse.writeJSON(join(__dirname, "media.json"), mediaFile);
  res.send("Posted Sucessfully");
});

//send pdf as email
router.post("/sendCatalogue", async (req, res) => {
  const response = await axios.get(
    `http://www.omdbapi.com/?apikey=c0b9281d&t=${req.body.title}`
  );
  const results = response.data;

  const doc = new PDFDocument();
  doc.pipe(createWriteStream(`public/pdfs/${req.body.title}.pdf`));
  doc
    .font("public/fonts/PalatinoBold.ttf")
    .fontSize(20)
    .text(
      "Movie Name: " + JSON.stringify(results.Title).replace(/"/g, ""),
      100,
      100
    );
  doc
    .font("public/fonts/PalatinoBold.ttf")
    .fontSize(20)
    .text(
      "Released in: " + JSON.stringify(results.Year).replace(/"/g, ""),
      100,
      140
    );
  doc.image(join(__dirname, "../../public/images/tt0120736.jpg"), 100, 160, {
    fit: [250, 250],
  });

  doc.end();
  const attachmentPath = join(
    __dirname,
    `../../public/pdfs/${req.body.title}.pdf`
  );
  //send email
  fs.readFile(attachmentPath, async function (err, data) {
    if (data) {
      sgMail.setApiKey(process.env.sgApiKey);
      const data_64 = base64_encode(attachmentPath);
      const msg = {
        to: req.body.email,
        from: "bandimandeep7pay@gmail.com",
        subject: results.Title,
        text: "Movie Catalogue",
        //html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        attachments: [
          {
            content: data_64,
            filename: results.Title,
            type: "application/pdf",
            // disposition: "attachment",
          },
        ],
      };
      sgMail
        .send(msg)
        .then((response) => {
          res.send("Success");
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
});

//POST image
router.post("/:id/upload", upload.single("mediaPhoto"), async (req, res) => {
  console.log(imagesPath);
  try {
    fse.writeFile(
      join(
        imagesPath,
        `${req.params.id}.${req.file.originalname.split(".").pop()}`
      ),
      req.file.buffer
    );
    let mediaFile = await fse.readJSON(mediaPath);

    mediaFile.forEach((media) => {
      if (media.imdbID === req.params.id) {
        media["Poster"] = join(
          __dirname,
          `../../public/images/${req.params.id}.${req.file.originalname
            .split(".")
            .pop()}`
        );
      }
    });
    fse.writeFileSync(mediaPath, JSON.stringify(mediaFile));
    res.send("uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

//PUT method
router.put("/:id", async (req, res) => {
  let replacement = { ...req.body, imdbID: req.params.id };
  let mediaFile = await fse.readJSON(join(__dirname, "media.json"));
  const filteredMediaFile = mediaFile.filter(
    (media) => media.imdbID !== req.params.id
  );
  filteredMediaFile.push(replacement);
  await fse.writeJSON(join(__dirname, "media.json"), filteredMediaFile);
  res.send("Successfully edited");
});

//DELETE method
router.delete("/:id", async (req, res) => {
  let mediaFile = await fse.readJSON(join(__dirname, "media.json"));
  const filteredMediaFile = mediaFile.filter(
    (media) => media.imdbID !== req.params.id
  );
  fse.writeFileSync(
    join(__dirname, "media.json"),
    JSON.stringify(filteredMediaFile)
  );
  res.send(filteredMediaFile);
});

module.exports = router;
