const fs = require("fs");
const path = require("path");

const pathTemplate = path.join(__dirname, "template.html");
const pathProject = path.join(__dirname, "project-dist");
const pathIndexInProject = path.join(__dirname, "project-dist", "index.html");
const pathStyles = path.join(__dirname, "styles");
const pathForAssets = path.join(__dirname, "assets");
const pathForAssetsCopy = path.join(__dirname, "project-dist", "assets");

const fileNameStyles = "style.css";
const regexp = /{{[a-z]+}}/g;

async function getTags() {
  const template = await fs.promises.readFile(pathTemplate, "utf-8");
  const tagsName = template.match(regexp).map((str) => {
    return str.substring(2, str.length - 2) + ".html";
  });
  return tagsName;
}

async function createFolderProjectWithTemplate() {
  await fs.promises.rm(pathProject, { recursive: true, force: true }, () => {});
  fs.mkdir(pathProject, { recursive: true }, () => {});
  fs.copyFile(pathTemplate, pathIndexInProject, () => {});
}

async function changeIndexHtml() {
  let tags = await getTags();
  for (let name of tags) {
    const tagContent = await fs.promises.readFile(
      path.join(__dirname, "components", `${name}`),
      "utf-8"
    );
    let indexHtml = await fs.promises.readFile(pathIndexInProject, "utf-8");
    let nameEl = `{{${name.substring(0, name.length - 5)}}}`;
    let changeIndex = indexHtml.replace(nameEl, tagContent);
    await fs.promises.writeFile(
      path.join(__dirname, "project-dist", "index.html"),
      changeIndex
    );
  }
}

function createStyles() {
  fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
    const streamWr = new fs.WriteStream(
      path.join(pathProject, fileNameStyles),
      "utf-8"
    );
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".css") {
        const stream = new fs.ReadStream(
          path.join(pathStyles, file.name),
          "utf-8"
        );
        stream.pipe(streamWr);
      }
    });
  });
}

async function copyAssets() {
  await fs.promises.rm(
    pathForAssetsCopy,
    { recursive: true, force: true },
    () => {}
  );
  fs.mkdir(pathForAssetsCopy, { recursive: true }, () => {});
  fs.readdir(pathForAssets, { withFileTypes: true }, (err, dir) => {
    dir.forEach((folder) => {
      fs.mkdir(
        path.join(__dirname, "project-dist", "assets", folder.name),
        { recursive: true },
        () => {
          fs.readdir(
            path.join(__dirname, "assets", folder.name),
            { withFileTypes: true },
            (err, files) => {
              files.forEach((file) => {
                fs.copyFile(
                  path.join(__dirname, "assets", folder.name, file.name),
                  path.join(
                    __dirname,
                    "project-dist",
                    "assets",
                    folder.name,
                    file.name
                  ),
                  () => {}
                );
              });
            }
          );
        }
      );
    });
  });
}

async function createSite() {
  await createFolderProjectWithTemplate();
  changeIndexHtml();
  createStyles();
  copyAssets();
}

createSite();
