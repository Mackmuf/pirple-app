/*
*
* Library to store and edit data
*
*/

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module (to be exported)
var lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  //open the file
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err){
              callback(false);
            } else {
              callback(`Error: Could not close the file => ${err}`);
            }
          });
        } else {
          callback(`Error: Could not write data to file => ${err}`);
        }
      });

    } else {
      callback(`Error: Could not create new file, it may already exist => ${err}`)
    }
  });
}

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if(!err){
      const stringData = JSON.stringify(data);

      //truncate the file
      fs.truncate(fileDescriptor, (err) => {
        if(!err){
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if(!err){
              fs.close(fileDescriptor, (err) => {
                if(!err){
                  callback(false);
                } else {
                  callback(`Error: Could not close the file => ${err}`);
                }
              });
            } else {
              callback(`Error: Could not update the file: ${err}`);
            }
          });
        } else {
          callback(`Error: Could not truncate => ${err}`);
        }
      });

    } else {
      callback(`error: Could not open the file for update, it may not exist yet => ${err}`);
    }
  });
};

//Delete a file
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err)=> {
    if(!err){
      callback(false);
    } else {
      callback(`Error: Could not delete the file => ${err}`);
    }
  });
}

// Export the module
module.exports = lib;