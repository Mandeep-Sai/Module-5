const invalidIdHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(err.httpStatusCode).send("Invalid ID");
  }
  next(err);
};
const invalidNameHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(err.httpStatusCode).send("Inavlid name");
  }
};
const catchAllHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    console.log(err);
    err.message = "Internal Error";
    // check if another error handler already sent the response
    res.status(err.httpStatusCode || 500).send(err.message);
  }
};

module.exports = { invalidIdHandler, invalidNameHandler, catchAllHandler };
