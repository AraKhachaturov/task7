let paths = __dirname;
let fs = require("fs");
let util = require("util");
let imputedDirectory = process.argv[2];
//console.log(util);

fs.readdir(imputedDirectory, function (err, file) {
  file.forEach(function (item, index) {
    let fullPath = imputedDirectory + "/" + item;
    console.log(item);
    fs.stat(fullPath, (err, fileStat) => {
      console.log(fileStat.size);
    });
  });
});

console.log("well done");
console.log(process.argv[2]);
console.log(paths);
console.log(process.cwd());
