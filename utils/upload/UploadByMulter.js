const multer = require("multer");

class UploadByMulter {
  /**
   *  Returns a StorageEngine implementation configured to store files in memory as Buffer objects.
   *
   * @param {Function} filters function to control which files are uploaded. This is called for every file that is processed
   *
   * @returns multer memoryStorage
   */
  _uploadByMemoryStorage(filters) {
    return multer({ storage: multer.memoryStorage(), fileFilter: filters });
  }

  /**
   *  Returns middleware that processes a single file associated with the given form field.
   *
   * @param {String} fieldName Shared name of the multipart form fields to process.
   *
   * @param {Function} filters function to control which files are uploaded. This is called for every file that is processed
   *
   * @param {String} storageType type of storage ["memory","disck"]
   *
   * @returns middleware
   */
  uploadSingle(fieldName, filters, storageType = "memory") {
    let upload;
    if (storageType === "memory") upload = this._uploadByMemoryStorage(filters);

    return upload.single(fieldName);
  }

  /**
   * Returns middleware that processes multiple files associated with the given form fields.
   *
   * @param {Array} fieldsName Array of Field objects describing multipart form fields to process. [{name:"",maxCount:1},...]
   *
   * @param {Function} filters function to control which files are uploaded. This is called for every file that is processed
   *
   * @param {String} storageType type of storage ["memory","disck"]
   *
   * @returns middleware
   */
  uploadFields(fieldsName, filters, storageType = "memory") {
    let upload;
    if (storageType === "memory") upload = this._uploadByMemoryStorage(filters);

    return upload.fields(fieldsName);
  }

  /**
   *
   * Returns middleware that processes multiple files sharing the same field name.
   *
   * @param {String} fieldName Shared name of the multipart form fields to process.
   *
   * @param {Number} maxCount  Optional. Maximum number of files to process. (default: 5)
   *
   * @param {Function} filters function to control which files are uploaded. This is called for every file that is processed
   *
   * @param {String} storageType type of storage ["memory","disck"]
   *
   * @returns middleware
   */
  uploadArray(fieldName, maxCount = 5, filters, storageType = "memory") {
    let upload;
    if (storageType === "memory") upload = this._uploadByMemoryStorage(filters);

    return upload.array(fieldName, maxCount);
  }
}

module.exports = UploadByMulter;
