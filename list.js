document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("fetchFilesButton").addEventListener("click", () => {
    const folderName = document.getElementById("folderName").value;
    const hideImage = document.getElementById("hideImage");
    if (hideImage.style.display == "none") {
      hideImage.style.display = "block";
    } else {
      hideImage.style.display = "none";
    }
    if (folderName) {
      fetchAudioFiles(folderName);
    } else {
      alert("Please enter a folder name.");
    }
  });

  function fetchAudioFiles(folder) {
    const storageRef = firebase.storage().ref(folder);
    storageRef
      .listAll()
      .then((result) => {
        const fileList = document.getElementById("fileList");
        fileList.innerHTML = "";
        result.items.forEach((fileRef, index) => {
          fileRef.getDownloadURL().then((url) => {
            const fileName = fileRef.name;

            const audioContainer = document.createElement("div");
            audioContainer.classList.add("audioContainer");
            fileList.appendChild(audioContainer);

            const fileNameElement = document.createElement("p");
            fileNameElement.textContent = fileName;
            fileNameElement.classList.add("fileName");
            audioContainer.appendChild(fileNameElement);

            const waveformContainer = document.createElement("div");
            waveformContainer.id = `waveform${index}`;
            waveformContainer.classList.add("waveformContainer");
            audioContainer.appendChild(waveformContainer);

            const playButton = document.createElement("button");
            playButton.textContent = "Play";
            playButton.classList.add("playButton");
            playButton.addEventListener("click", () => {
              waveSurfer.playPause();
              playButton.textContent = waveSurfer.isPlaying()
                ? "Pause"
                : "Play";
            });
            audioContainer.appendChild(playButton);

            const waveSurfer = WaveSurfer.create({
              container: `#waveform${index}`,
              waveColor: "gray",
              progressColor: "#6CA329",
              responsive: true,
              height: 36,
            });

            waveSurfer.load(url);
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }
});
