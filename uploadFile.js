document.getElementById("uploadButton").addEventListener("click", function () {
  const files = document.getElementById("audioFile").files;
  const nameCollections = document.getElementById("nameCollections").value; // Lấy giá trị nhập vào từ trường input

  if (!nameCollections) {
    console.error("No collection name provided");
    return;
  }

  if (files.length > 0) {
    // Kiểm tra xem bộ sưu tập có tồn tại không
    db.collection(nameCollections)
      .get()
      .then(function (querySnapshot) {
        if (querySnapshot.empty) {
          console.log(
            `Collection ${nameCollections} does not exist. Creating new collection.`
          );
        } else {
          console.log(`Collection ${nameCollections} already exists.`);
        }

        // Tiến hành upload file sau khi kiểm tra bộ sưu tập
        let uploadCount = 0;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const storageRef = storage.ref();
          const audioRef = storageRef.child(`${nameCollections}/${file.name}`); // Sử dụng giá trị từ trường input

          const uploadTask = audioRef.put(file);

          uploadTask.on(
            "state_changed",
            function (snapshot) {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload of ${file.name} is ` + progress + "% done");
            },
            function (error) {
              console.error(`Upload of ${file.name} failed:`, error);
            },
            function () {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  console.log(`File ${file.name} available at`, downloadURL);

                  // Add audio file info to Firestore
                  db.collection(nameCollections) // Sử dụng giá trị từ trường input
                    .add({
                      name: file.name,
                      url: downloadURL,
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(function () {
                      console.log(
                        `File ${file.name} successfully uploaded and metadata added to Firestore`
                      );
                      uploadCount++;
                      if (uploadCount == files.length) {
                        alert("Upload " + files.length + " files done!");
                      }
                    })
                    .catch(function (error) {
                      console.error(
                        `Error adding metadata for ${file.name} to Firestore:`,
                        error
                      );
                    });
                });
            }
          );
        }
      })
      .catch(function (error) {
        console.error(`Error checking collection ${nameCollections}:`, error);
      });
  } else {
    console.error("No files selected");
  }
});
