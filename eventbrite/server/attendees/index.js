const express = require("express");
const { join } = require("path");
const pump = require("pump");
const uniqid = require("uniqid");
const router = express.Router();
const { readFile, writeFile } = require("../utilities");
const { Transform } = require("json2csv");
const { createReadStream } = require("fs");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");
const postModel = require("./schema");
//
const nodemailer = require("nodemailer");
const nodeMailGun = require("nodemailer-mailgun-transport");
//
const pdfPrinter = require("pdfmake");
const { getMaxListeners } = require("process");

const attendeesPath = join(__dirname, "attendees.json");

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
}

router.get("/", async (req, res) => {
  const post = await postModel.find();
  res.send(post);
});

router.get("/:id", async (req, res) => {
  const post = await postModel.findById(req.params.id);
  res.send(post);
});

router.get("/csv", (req, res) => {
  const data = createReadStream(attendeesPath);
  const json2csv = new Transform({ fields: ["name", "age", "email"] });
  res.setHeader("Content-Disposition", "attachment; filename=attendees.csv");
  pump(data, json2csv, res);
});

router.post("/", async (req, res) => {
  const newAttendee = { ...req.body, ticket: uniqid(), date: "15.08.2020" };
  const data = await readFile(attendeesPath);
  data.push(newAttendee);
  await writeFile(attendeesPath, data);
  // generate pdf
  var fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
    },
  };
  var printer = new pdfPrinter(fonts);
  const docDefinition = {
    content: [
      (id = "Ticket:" + newAttendee.ticket),
      (name = newAttendee.name),
      (email = newAttendee.email),
      (eventdate = "On:" + newAttendee.date),
    ],
  };
  console.log(docDefinition);
  //var pdfDoc = printer.createPdfKitDocument(docDefinition);
  //pdfDoc.pipe(fs.createWriteStream(`server/tickets/ticket.pdf`));
  //pdfDoc.end();
  //
  pathToAttachment = `${__dirname}/../tickets/ticket.pdf`;
  attachment = fs.readFileSync(pathToAttachment).toString("base64");

  sgMail.setApiKey(
    "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"
  );
  console.log(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "bandimandeeppaypal@gmail.com",
    from: "bandimandeep7@gmail.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    attachments: [
      {
        content: attachment.toString("base64"),
        filename: "ticket.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });

  res.send("done");
});

router.post("/nodemailer", async (req, res) => {
  const newAttendee = { ...req.body, ticket: uniqid(), date: "15.08.2020" };
  var fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
    },
  };
  var printer = new pdfPrinter(fonts);
  const docDefinition = {
    content: [
      (id = "Ticket:" + newAttendee.ticket),
      (name = newAttendee.name),
      (email = newAttendee.email),
      (eventdate = "On:" + newAttendee.date),
    ],
  };
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(`server/tickets/${newAttendee.ticket}.pdf`));
  pdfDoc.end();

  //attachemnt
  pathToAttachment = `${__dirname}/../tickets/${newAttendee.ticket}.pdf`;
  attachment = fs.readFileSync(pathToAttachment).toString("base64");

  // send email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });
  let mailOptions = {
    from: "bandimandeep7pay@gmail.com",
    to: newAttendee.email,
    subject: "Welcome ",
    text: "Hello world",
    html: "<b>Yo</b>",
    attachments: [
      {
        filename: `${newAttendee.ticket}.pdf`,
        path: pathToAttachment,
      },
    ],
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send("Email Sent Succesfully");
    }
  });
});

// using mailgun
/*
router.post("/mailgun", async (req, res) => {
  const newAttendee = { ...req.body, ticket: uniqid(), date: "15.08.2020" };
  var fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
    },
  };
  var printer = new pdfPrinter(fonts);
  const docDefinition = {
    content: [
      (id = "Ticket:" + newAttendee.ticket),
      (name = newAttendee.name),
      (email = newAttendee.email),
      (eventdate = "On:" + newAttendee.date),
    ],
  };
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(`server/tickets/${newAttendee.ticket}.pdf`));
  pdfDoc.end();

  //attachemnt
  pathToAttachment = `${__dirname}/../tickets/${newAttendee.ticket}.pdf`;
  attachment = fs.readFileSync(pathToAttachment).toString("base64");
  // send mail
  const auth = {
    auth: {
      api_key: "",
      domain: "",
    },
  };
  //
  let transporter = nodemailer.createTransport(nodeMailGun(auth));
  //
  let mailOptions = {
    from: "bandimandeep7pay@gmail.com",
    to: newAttendee.email,
    subject: "Welcome ",
    text: "Hello world",
    html: "<b>Yo</b>",
    attachments: [
      {
        filename: `${newAttendee.ticket}.pdf`,
        path: pathToAttachment,
      },
    ],
  };
  //
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("message sent");
    }
  });
});
*/
router.post("/sgmail", async (req, res) => {
  const newAttendee = { ...req.body, ticket: uniqid(), date: "15.08.2020" };
  const data = await readFile(attendeesPath);
  data.push(newAttendee);
  await writeFile(attendeesPath, data);
  // generate pdf
  var fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
    },
  };
  var printer = new pdfPrinter(fonts);
  const docDefinition = {
    content: [
      (id = "Ticket:" + newAttendee.ticket),
      (name = newAttendee.name),
      (email = newAttendee.email),
      (eventdate = "On:" + newAttendee.date),
    ],
  };
  console.log(docDefinition);
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(`server/tickets/${newAttendee.ticket}.pdf`));
  pdfDoc.end();
  //
  const pathToAttachment = `${__dirname}/../tickets/${newAttendee.ticket}.pdf`;
  //const attachment = fs.readFileSync(pathToAttachment).toString("base64");
  console.log(pathToAttachment);
  fs.readFile(pathToAttachment, async function (err, data) {
    if (data) {
      sgMail.setApiKey(process.env.sgApiKey);
      const data_64 = base64_encode(pathToAttachment);
      const msg = {
        to: "nathaliemekahal@gmail.com",
        from: "bandimandeep7pay@gmail.com",
        subject: "Subject",
        text: "Text",
        //html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        attachments: [
          {
            content: data_64,
            filename: newAttendee.ticket,
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
  // const sgMail = require("@sendgrid/mail");

  //res.send("test");
});

module.exports = router;
