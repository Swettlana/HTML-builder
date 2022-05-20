const fs = require("fs");
const path = require("path");
const pathFile = path.join(__dirname, "secret-folder");
fs.readdir(pathFile, { withFileTypes: true }, (err, arrayFiles) => {
  if (err) throw Error("error");
  else {
    const files = arrayFiles.filter((file) => file.isFile());
    files.forEach((el) => {
      const pathEl = path.join(pathFile, el.name);
      fs.stat(pathEl, (err, stats) => {
        if (err) {
          throw Error();
        }
        console.log(
          `${path.parse(pathEl).name} - ${path.parse(pathEl).ext.slice(1)} - ${(
            stats.size / 1024
          ).toFixed(3)} kb`
        );
      });
    });
  }
});
