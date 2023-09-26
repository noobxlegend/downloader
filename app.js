const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/download", async (req, res) => {
  try {
    const videoUrl = req.body.videoUrl;
    const selectedQuality = req.body.videoQuality || "highest";

    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).send("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = info.videoDetails.title;

    // Specify video quality based on user selection
    const options = {
      quality: selectedQuality,
    };

    const stream = ytdl(videoUrl, options);

    res.setHeader("Content-Disposition", `attachment; filename="${videoTitle}.mp4"`);
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading video");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
