let fs = require('fs');
let path = require('path');

function bytesConvertor(bytes) {

    var sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];

    if (bytes == 0) return '0 Byte';

    var n = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, n), 2)  + sizes[n];
 }

let sreachFiles = function(direction, callBack) {

  let filesDescription = new Array;


  fs.readdir(direction, function(err, content) {


    if (err) return callBack(err);


    let numberOfContent = content.length;


    if (!numberOfContent) return callBack(null, results);

    content.forEach(function(fileAbsolutePath) {


    fileAbsolutePath = path.resolve(direction, fileAbsolutePath);
  


      fs.stat(fileAbsolutePath, function(err, stat) {
      
        if (stat && stat.isDirectory()) {

            sreachFiles(fileAbsolutePath, function(err, res1) {
                filesDescription = filesDescription.concat(res1);
            if (!--numberOfContent) callBack(null, filesDescription);

          });
        } else {

            filesDescription.push({path:path.relative( process.cwd(),fileAbsolutePath), size: stat.size});
          if (!--numberOfContent) callBack(null, filesDescription);

        }
      });
    });


  });


};


sreachFiles(process.argv[2], function(err, results) {
  if (err) throw err;
    
    let resultToSave=results.sort((i1,i2)=>{
        return i2.size -i1.size;
    }).map(item =>{
            return `${item.path.split(path.sep).join("/")}------------${bytesConvertor(item.size)}`;
    }).join('\n');

    fs.writeFile("sorted_files.txt",resultToSave, err=>{
        if (err) throw err;
    });


  });