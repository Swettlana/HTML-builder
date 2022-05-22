const fs = require("fs");
const path = require("path");
const pathStyles = path.join(__dirname, "styles");
const pathTo = path.join(__dirname, "project-dist", "bundle.css");

const handleError = (err) => {
  if (err) {
    console.log(err);
    throw new Error("error");
  }
};
const output = fs.createWriteStream(pathTo);

fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  handleError(err);

  files.forEach((file) => {
    const pathFrom = path.join(pathStyles, file.name);
    if (file.isFile() && path.extname(pathFrom) === ".css") {
      const input = fs.createReadStream(pathFrom);
      input.pipe(output);
    }
  });
});
