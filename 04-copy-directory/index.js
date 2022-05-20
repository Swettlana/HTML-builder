const fs = require("fs");
const path = require("path");
const pathFrom = path.join(__dirname, "files");
const pathTo = path.join(__dirname, "files-copy");

const handleError = (err) => {
  if (err) {
    console.log(err);
    throw new Error("error");
  }
};

const createFolder = () => {
  fs.mkdir(pathTo, (err) => {
    handleError(err);
  });
};

const copyFiles = () => {
  fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
    handleError(err);
    files.forEach((file) => {
      fs.copyFile(
        path.join(pathFrom, file.name),
        path.join(pathTo, file.name),
        (err) => {
          if (err) {
            throw new Error("error");
          }
        }
      );
    });
  });
};

fs.rm(pathTo, { recursive: true, force: true }, () => {
  createFolder();
  copyFiles();
});
