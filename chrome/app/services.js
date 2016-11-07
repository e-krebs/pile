app.factory('fileService', ['$q', fileService]);

function fileService($q) {
    return {
        writeJson: writeJson,
        readJson: readJson,
        writeFile: writeAnyFile,
        readFile: readAnyFile
    };
    
    var fs = null; // filesystem support
    
    function writeJson(jsonData, name) {
        return getFilesystem()
            .then(function() {
                return writeJsonFile(jsonData, name);
            });
    }
    
    function readJson(name) {
        return getFilesystem()
            .then(function() {
                return readJsonFile(name);
            });
    }
    
    function writeAnyFile(blob) {
        return getFilesystem()
            .then(function() {
                return writeFile(blob);
            });
    }
    
    function readAnyFile(name) {
        return getFilesystem()
            .then(function() {
                return readFile(name);
            });
    }

    function writeJsonFile(jsonData, name) {
        var response = $q.defer();
        var stringJsonData = JSON.stringify(jsonData);
        //console.log('writing', name, stringJsonData, jsonData);
        var blob = new Blob([stringJsonData], {type: 'application/json'});
        //var blob = new Blob([], {type: 'application/json'});
        blob.name = name;
        writeFile(blob);
        response.resolve(response);
        //console.log('writeJsonFile', name);
        return response.promise;
    }

    function readJsonFile(name) {
        var response = $q.defer();
        var filePath = fs.root.toURL() + 'storage/' + name;
        // console.log('readJsonFile filePath', filePath);
        window.webkitResolveLocalFileSystemURL(filePath, function (json_file) {
            json_file.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    // console.log('json_file', file, 'read !', this.result);
                    var json_data = JSON.parse(this.result);
                    //console.log('json_file', file, 'read:', json_data);
                    response.resolve(json_data);
                };
                reader.readAsText(file);
                // console.log('reading json_file...', file);
            });
        }, function(x) {
            console.log('Error readJsonFile', filePath, x);
            response.resolve(null);
        });
        return response.promise;
    }

    function getFilesystem() {
        var resp = $q.defer();
        if (fs != null) {
            //console.info('filesystem already OK');
            resp.resolve(fs);
        } else {
            window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function (localFs) {
                fs = localFs;
                //console.info('filesystem initialized');
                resp.resolve(fs);
            });
        }
        return resp.promise;
    }
    
    // write to local filesystem
    function writeFile(blob) {
        return deleteBlob(blob).then(writeBlob);
    }

    function writeBlob(blob) {
        // write new blob
        var resp = $q.defer();
        //console.log('fs', fs);
        if (!fs.root) {
            console.error('fileSystem not available, blob not written : ' + blob.name);
            resp.resolve(null);
        } else {
            fs.root.getDirectory('storage', { create: true }, function (directory) {
                directory.getFile(blob.name, { create: true, exclusive: false }, function (file) {
                    if (blob.size <= 0) {
                        console.log('file (size 0) not written', blob, file);
                        resp.resolve(null);
                    } else {
                        //if (blob.name.indexOf('angular') >= 0) console.log('writing', blob, file);
                        // Create a FileWriter object for our FileEntry, and write out blob.
                        file.createWriter(function (writer) {
                            //fileWriter.onerror = onError;
                            writer.onwriteend = function () {
                                var localPath = fs.root.toURL() + 'storage/' + blob.name;
                                //console.info('write completed:', blob.name, localPath);
                                resp.resolve(localPath);
                            };
                            writer.write(blob);
                        }); //, onError);
                    }
                }); //, onError);
            }); //, onError);
        }
        return resp.promise;
    }
    
    function deleteBlob(blob) {
        // delete existing blob
        var resp = $q.defer();
        fs.root.getFile('storage/' + blob.name, {create: false}, function(fileEntry) {
            fileEntry.remove(function() {
                console.log(`file ${blob.name} removed`);
                resp.resolve(blob);
            }, function() {
                resp.resolve(blob);
            });
            
        }, function() {
            resp.resolve(blob);
        });
        return resp.promise;
    }
    
    function readFile(name) {
        var response = $q.defer();
        var filePath = fs.root.toURL() + 'storage/' + name;
        //console.log('readJsonFile', filePath);
        window.webkitResolveLocalFileSystemURL(filePath, function () {
            response.resolve(filePath);
        }, function(x) {
            console.log('Error readJsonFile', filePath, x);
            response.resolve(null);
        });
        return response.promise;
    }
}