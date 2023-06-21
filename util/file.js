const fs = require("fs");

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath, (err) => {
      if (err) throw new Error("can not delete file");
    });
  } catch (error) {
    throw new Error("can not delete file");
  }
};

exports.deleteFile = deleteFile;
