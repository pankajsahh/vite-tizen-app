function FirstCreationOfDB(dbname: string, object: any) {
    // Open a connection to the IndexedDB database
    const request = indexedDB.open(dbname, 1);
  
   
  
    // Handle database success
    request.onsuccess = function (event: any) {
      const db = event.target.result as IDBDatabase;
  
      // Start a new transaction
      const transaction = db.transaction(["ObjectStore"], "readwrite");
  
      // Get the object store
      const objectStore = transaction.objectStore("ObjectStore");
  
      // Add the object to the object store
      const addRequest = objectStore.add({ data: object, id: 1 });
  
      // Handle successful object addition
      addRequest.onsuccess = function () {
        console.log("Object stored in IndexedDB successfully.");
      };
  
      // Handle object addition errors
      addRequest.onerror = function () {
        console.error("Error storing object in IndexedDB.");
      };
  
      // Close the transaction
      transaction.oncomplete = function () {
        db.close();
      };
    };
  
    // Handle database errors
    request.onerror = function () {
      console.error("Error opening IndexedDB.");
    };
  }
  
  function updateDataInIndexedDB(dbname: string, updatedObject: any) {
    // Open a connection to the IndexedDB database
    const request = indexedDB.open(dbname, 1);
  
    // Handle database upgrade
    request.onupgradeneeded = function (event: any) {
      const db = event.target.result as IDBDatabase;
  
      // Create an object store if it doesn't exist
      if (!db.objectStoreNames.contains("ObjectStore")) {
        db.createObjectStore("ObjectStore", { keyPath: "id" });
      }
    };
  
    // Handle database success
    request.onsuccess = function (event: any) {
      const db = event.target.result as IDBDatabase;
  
      // Start a new transaction
      const transaction = db.transaction(["ObjectStore"], "readwrite");
  
      // Get the object store
      const objectStore = transaction.objectStore("ObjectStore");
  
      // Retrieve the object by its key
      const getRequest = objectStore.get(1);
  
      // Handle successful object retrieval
      getRequest.onsuccess = function () {
        const result = getRequest.result;
  
        if (result) {
          // Update the data in the retrieved object
          result.data = updatedObject;
  
          // Put the updated object back into the object store
          const updateRequest = objectStore.put(result);
  
          // Handle successful object update
          updateRequest.onsuccess = function () {
            console.log("Object updated in IndexedDB successfully.");
          };
  
          // Handle object update errors
          updateRequest.onerror = function () {
            console.error("Error updating object in IndexedDB.");
          };
        } else {
          console.log("Object not found in IndexedDB.");
          FirstCreationOfDB(dbname, updatedObject);
        }
      };
  
      // Handle object retrieval errors
      getRequest.onerror = function () {
        console.error("Error retrieving object from IndexedDB.");
      };
  
      // Close the transaction
      transaction.oncomplete = function () {
        db.close();
      };
    };
  
    // Handle database errors
    request.onerror = function () {
      console.error("Error opening IndexedDB.");
    };
  }
  
  function retrieveDataFromIndexedDB(dbname: string): Promise<any> {
    return new Promise((resolve) => {
      // Open a connection to the IndexedDB database
      const request = indexedDB.open(dbname, 1);
  
      // Handle database upgrade
      request.onupgradeneeded = function (event: any) {
        const db = event.target.result as IDBDatabase;
  
        // Create an object store if it doesn't exist
        if (!db.objectStoreNames.contains("ObjectStore")) {
          db.createObjectStore("ObjectStore", { keyPath: "id" });
        }
      };
  
      // Handle database success
      request.onsuccess = function (event: any) {
        const db = event.target.result as IDBDatabase;
  
        // Start a new transaction
        const transaction = db.transaction(["ObjectStore"], "readonly");
  
        // Get the object store
        const objectStore = transaction.objectStore("ObjectStore");
  
        // Retrieve the object by its key
        const getRequest = objectStore.get(1);
  
        // Handle successful object retrieval
        getRequest.onsuccess = function () {
          const result = getRequest.result;
          if (result) {
            resolve(result.data);
          } else {
            resolve([]);
          }
        };
  
        // Handle object retrieval errors
        getRequest.onerror = function () {
          console.error("Error retrieving object from IndexedDB.");
        };
  
        // Close the transaction
        transaction.oncomplete = function () {
          db.close();
        };
      };
  
      // Handle database errors
      request.onerror = function () {
        console.error("Error opening IndexedDB.");
        resolve([]);
      };
    });
  }

  export {retrieveDataFromIndexedDB,updateDataInIndexedDB,FirstCreationOfDB}