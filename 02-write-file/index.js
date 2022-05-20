const process = require("process");
const fs = require("fs");
const path = require("path");
const pathFile = path.join(__dirname, "/text.txt");

const output = fs.createWriteStream(pathFile, "utf-8");
process.stdout.write("Write text for file 'text.txt', please\n");
process.stdin.on("data", (data) => {
  if (data.toString().slice(0, 4) === "exit") {
    process.exit();
  } else output.write(data);
});
process.on("SIGINT", () => {
  process.exit();
});
process.on("exit", () => {
  process.stdout.write("Thank you! See you later!");
});
