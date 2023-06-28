async function saveBase64ImageToFile(base64String: string, filePath: string) {
  var binaryString = atob(base64String);
  var uint8Array = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  var fileHandleWrite = tizen.filesystem.openFile(filePath, "w");
  fileHandleWrite.writeData(uint8Array);
  fileHandleWrite.close();
  console.log("uint8Array content has been written to file");
}

async function checkFileExistence(filePath: string) {
  return new Promise((resolve, reject) => {
    tizen.filesystem.resolve(
      filePath,
      (file: any) => {
        // The file exists
        resolve({ exists: true, uri: file.toURI(), size: file.fileSize });
      },
      (error: any) => {
        // The file does not exist or there was an error
        if (error.name === "NotFoundError") {
          resolve({ exists: false });
        } else {
          reject(error);
        }
      }
    );
  });
}

async function readFileAsURI(filePath: string) {
  return new Promise((resolve, reject) => {
    tizen.filesystem.resolve(
      filePath,
      (file: any) => {
        // The file exists
        console.log("file-toURI");
        console.log(file.toURI());
        resolve({ exists: true, uri: file.toURI(), size: file.fileSize });
      },
      (error: any) => {
        // The file does not exist or there was an error
        if (error.name === "NotFoundError") {
          resolve({ exists: false });
        } else {
          reject(error);
        }
      }
    );
  });
}
export { readFileAsURI, checkFileExistence, saveBase64ImageToFile };
