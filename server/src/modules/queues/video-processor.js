/** execute function will take a filePath and run  ffmpeg command to convert it to mp4 */

const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const execute = async (filePath, outputFolder) => {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  const fileNameWithoutExt = path.basename(filePath, fileExt);

  const outputFileName = `${outputFolder}/${fileNameWithoutExt}.mp4`;

  const command = ffmpeg(filePath)
    .output(outputFileName)
    .on("start", function (commandLine) {
      console.log("Spawned Ffmpeg with command: " + commandLine);
    })
    .on("progress", function (progress) {
      console.log("Processing: " + progress.percent + "% done");
    })
    .on("end", function () {
      console.log("Finished processing");
    })
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .run();

  return { fileName, outputFileName };
};

module.exports = { execute };
