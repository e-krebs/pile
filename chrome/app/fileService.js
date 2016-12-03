app.factory('fileService', ['$q', fileService]);

function fileService($q) {
    let fs = null; // filesystem support
    return {
        writeJson: writeJson,
        readJson: readJson,
        writeFile: writeAnyFile,
        readFile: readAnyFile
    };
    
    function writeJson(jsonData, name) {
        return getFilesystem().then(function() {
            return writeJsonFile(jsonData, name);
        });
    }
    
    function readJson(name) {
        return getFilesystem().then(function() {
            return readJsonFile(name);
        });
    }
    
    function writeAnyFile(blob) {
        return getFilesystem().then(function() {
            return writeFile(blob);
        });
    }
    
    function readAnyFile(name) {
        return getFilesystem().then(function() {
            return readFile(name);
        });
    }

    function writeJsonFile(jsonData, name) {
        const response = $q.defer();
        const stringJsonData = JSON.stringify(jsonData);
        const blob = new Blob([stringJsonData], {type: 'application/json'});
        blob.name = name;
        writeFile(blob);
        response.resolve(response);
        return response.promise;
    }

    function readJsonFile(name) {
        const response = $q.defer();
        const filePath = fs.root.toURL() + 'storage/' + name;
        window.webkitResolveLocalFileSystemURL(filePath, function (json_file) {
            json_file.file(function(file) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const json_data = JSON.parse(this.result);
                    response.resolve(json_data);
                };
                reader.readAsText(file);
            });
        }, function(x) {
            console.log('Error readJsonFile', filePath, x);
            response.resolve(null);
        });
        return response.promise;
    }

    function getFilesystem() {
        const resp = $q.defer();
        if (fs !== null) {
            resp.resolve(fs);
        } else {
            window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function (localFs) {
                fs = localFs;
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
        const resp = $q.defer();
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
                        // Create a FileWriter object for our FileEntry, and write out blob.
                        file.createWriter(function (writer) {
                            //fileWriter.onerror = onError;
                            writer.onwriteend = function () {
                                const localPath = fs.root.toURL() + 'storage/' + blob.name;
                                resp.resolve(localPath);
                            };
                            writer.write(blob);
                        });
                    }
                });
            });
        }
        return resp.promise;
    }
    
    function deleteBlob(blob) {
        // delete existing blob
        const resp = $q.defer();
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
        const response = $q.defer();
        const filePath = fs.root.toURL() + 'storage/' + name;
        window.webkitResolveLocalFileSystemURL(filePath, function () {
            response.resolve(filePath);
        }, function(e) {
            console.log('Error readJsonFile', filePath, e);
            response.resolve(null);
        });
        return response.promise;
    }
}