document.addEventListener("DOMContentLoaded", async () => {
  const docRef = db.collection("mosstAudio").doc("2024-05-24");
  try {
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      const imgURLs = data.img.split("/n");
      const audioURLs = data.filePath.split("endof");
      const authorNames = data.author.split("/n");
      const fileNames = data.fileName.split("/n");
      const prices = data.price.split("/n");

      for (let j = 1; j <= imgURLs.length; j++) {
        const imgURL = imgURLs[j - 1];
        const audioURL = audioURLs[j - 1];
        const authorName = authorNames[j - 1];
        const fileName = fileNames[j - 1];
        const price = prices[j - 1];

        const nameAuthorElement = document.getElementById(`nameAuthor${j}`);
        nameAuthorElement.textContent = authorName;
        const fileNameElement = document.getElementById(`fileName${j}`);
        fileNameElement.textContent = fileName;

        const priceElement = document.getElementById(`priceContainer${j}`);
        priceElement.textContent = price;

        const imgElement = document.createElement("img");
        imgElement.src = imgURL;
        imgElement.alt = "Image from Firestore";
        imgElement.className = "max-w-full max-h-full object-cover";

        const imageContainer = document.getElementById(`imageContainer${j}`);
        imageContainer.appendChild(imgElement);

        const waveformContainer = document.getElementById(`waveform${j}`);
        const waveSurfer = WaveSurfer.create({
          container: waveformContainer,
          waveColor: "gray",
          progressColor: "#6CA329",
          responsive: true,
          width: 200,
          height: 50,
        });

        waveSurfer.load(audioURL);
        waveSurfer.on("ready", function () {
          const duration = waveSurfer.getDuration();
          const durationMinutes = Math.floor(duration / 60);
          const durationSeconds = Math.floor(duration % 60);
          const timeContainer = document.getElementById(`timeContainer${j}`);
          timeContainer.textContent = `${durationMinutes}:${
            durationSeconds < 10 ? "0" : ""
          }${durationSeconds}`;
        });
        let isPlaying = false;

        const playButton = document.getElementById(`playButton${j}`);
        playButton.addEventListener("click", () => {
          if (isPlaying) {
            waveSurfer.pause();
            playButton.src = "img/octicon_play-16.png";
            playButton.alt = "Play";
            isPlaying = false;
          } else {
            waveSurfer.play();
            playButton.src = "img/ic_sharp-pause-circle.png";
            playButton.alt = "Pause";
            isPlaying = true;
          }
        });

        const downloadButton = document.getElementById(`downloadButton${j}`);
        downloadButton.addEventListener("click", () => {
          fetch(audioURL)
            .then((response) => response.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = fileName; // You can set the filename for the download
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            })
            .catch((err) => console.error("Error downloading the file", err));
        });
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
});
