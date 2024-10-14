const sharp = require("sharp");
const { v4: uuid4 } = require("uuid");
const UploadByMulter = require("./UploadByMulter");

class UploadImages extends UploadByMulter {
  /**
   * function to filter the files that are being uploaded. If they are of the image type, they are uploaded, otherwise an error is thrown.
   * @returns multer filter
   */
  _filterOnlyImage() {
    return (req, file, cb) => {
      if (file.mimetype.startsWith("image")) return cb(null, true);

      cb(new Errors("Only Images allowed", 400), false);
    };
  }

  /**
   *
   * Returns middleware that processes a single file for image only
   *
   * @param {String} filed Shared name of the multipart form fields to process.
   *
   * @returns multer middleware
   */
  uploadSingleImage(field) {
    return this.uploadSingle(field, this._filterOnlyImage(), "memory");
  }

  /**
   *
   * Returns middleware that processes a multi image for same field - array of images
   *
   * @param {String} filed Shared name of the multipart form fields to process.
   *
   * @returns multer middleware
   */
  uploadArrayOfImage(field, maxCount = 5) {
    return this.uploadArray(field, maxCount, this._filterOnlyImage(), "memory");
  }

  /**
   *
   * Returns middleware that processes a multi field for  image only
   *
   * @param {String} filed Shared name of the multipart form fields to process.
   *
   * @returns multer middleware
   */
  uploadSingleImage(fields) {
    return this.uploadFields(fields, this._filterOnlyImage(), "memory");
  }

  /**
   * Use the image stored in memory to resize it and store it in the desired path and return the path with the image name
   *
   * @param {Buffer File} file
   *
   * @param {Object} options
   *
   * @returns path of image in desk
   */
  resize(
    file,
    { name = "image", ext = "jpeg", size = [600, 600], folder = "global" }
  ) {
    const imageName = `images/${folder}/${name}-${uuid4()}-${Date.now()}.${ext}`;

    sharp(file)
      .resize(size[0], size[1])
      .toFormat(ext)
      .jpeg({ quality: 90 })
      .toFile(`storage/upload/${imageName}`);

    return imageName;
  }
}

module.exports = UploadImages;
