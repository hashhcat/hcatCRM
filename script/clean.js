var fs = require('fs');
var path = require('path');

function deleteJSFilesRecursive(dirPath) {
  if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
    fs.readdirSync(dirPath).forEach(function(file, index){
      var curPath = path.join(dirPath, file);
      
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteJSFilesRecursive(curPath);
      } else if (path.extname(file) === '.js') { // delete .js file
        console.log(`Deleting file "${curPath}"...`);
        fs.unlinkSync(curPath);
      }
    });
  }
}

console.log("Cleaning working tree...");

deleteJSFilesRecursive(path.join(__dirname, '../src'));

console.log("Successfully cleaned working tree!");
