let fs = require('fs');
let path = require('path');


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
            return `${item.path.split(path.sep).join("/")}------------${item.size}`;
    }).join('\n');

    console.log(results);
    
    console.log(resultToSave);


  });