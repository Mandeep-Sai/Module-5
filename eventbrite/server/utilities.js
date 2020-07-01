const { readJSON, writeJSON } = require("fs-extra");

const readFile = async (path) => {
  try {
    const readFile = await readJSON(path);
    return readFile;
  } catch (error) {
    next(error);
  }
};

const writeFile = async (path, data) => {
  try {
    await writeJSON(path, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { readFile, writeFile };
