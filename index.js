let fs = require('fs');
let path = require('path');

function bytesConvertor(bytes) {
    var sizes = ['bytes', 'kb', 'mb', 'gb', 'TB'];
    if (bytes == 0) return '0 Byte';
    var n = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, n), 2)  + sizes[n];
 }

let walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {


      file = path.resolve(dir, file);
      console.log(file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push({path:path.relative( process.cwd(),file), size: stat.size});
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


walk(process.argv[2], function(err, results) {
  if (err) throw err;
    
    let resultToSave=results.sort((i1,i2)=>{
        return i2.size -i1.size;
    }).map(item =>{
            return `${item.path.split(path.sep).join("/")}------------${bytesConvertor(item.size)}`;
    }).join('\n');

    fs.writeFile("sorted_files.txt",resultToSave, err=>{
        if (err) throw err;
    });
    console.log(results);
    
    console.log(resultToSave);


  });