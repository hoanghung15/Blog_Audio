document.addEventListener("DOMContentLoaded", async () => {
  const docRef = db.collection("mosstAudio").doc("nhacTre");
  try {
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      const imgURLs = data.img.split("/n");
      const audioURLs = data.filePath.split("endof");
      const authorNames = data.author.split("/n");
      const fileNames = data.fileName.split("/n");
      const prices = data.price.split("/n");
      console.log(prices.length);

      for (let j = 1; j <= imgURLs.length; j++) {
        const imgURL = imgURLs[j - 1];
        const audioURL = audioURLs[j - 1];
        const authorName = authorNames[j - 1];
        const fileName = fileNames[j - 1];
        const price = prices[j - 1];

        const nameAuthorElement = document.getElementById(`ntnameAuthor${j}`);
        nameAuthorElement.textContent = authorName;
        const fileNameElement = document.getElementById(`ntfileName${j}`);
        fileNameElement.textContent = fileName;

        const priceElement = document.getElementById(`ntpriceContainer${j}`);
        priceElement.textContent = price;

        const imgElement = document.createElement("img");
        imgElement.src = imgURL;
        imgElement.alt = "Image from Firestore";
        imgElement.className = "max-w-full max-h-full object-cover";

        const imageContainer = document.getElementById(`ntimageContainer${j}`);
        imageContainer.appendChild(imgElement);

        const waveformContainer = document.getElementById(`ntwaveform${j}`);
        const waveSurfer = WaveSurfer.create({
          container: waveformContainer,
          waveColor: "gray",
          progressColor: "#6CA329",
          responsive: true,
          height: 36,
        });

        waveSurfer.load(audioURL);
        waveSurfer.on("ready", function () {
          const duration = waveSurfer.getDuration();
          const durationMinutes = Math.floor(duration / 60);
          const durationSeconds = Math.floor(duration % 60);
          const timeContainer = document.getElementById(`nttimeContainer${j}`);
          timeContainer.textContent = `${durationMinutes}:${
            durationSeconds < 10 ? "0" : ""
          }${durationSeconds}`;
        });
        let isPlaying = false;

        const playButton = document.getElementById(`ntplayButton${j}`);
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

        const downloadButton = document.getElementById(`ntdownloadButton${j}`);
        downloadButton.addEventListener("click", () => {
          fetch(audioURL)
            .then((response) => response.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = fileName;
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
