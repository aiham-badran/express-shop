const slugify = require("slugify");

class HelperModel {
  /**
   * when save data in db add full url for image in image field in document
   *
   * @param {String} byField
   * @returns mongooes middleware
   */
  static addImageUrlToDoc(byField) {
    return function (doc) {
      if (doc[byField]) {
        const imageUrl = `${process.env.BASE_URL}/${doc[byField]}`;
        doc[byField] = imageUrl;
      }
    };
  }

  /**
   * when create new doc create slug using slugify lib using field for document
   * and set in data in field in doc by default named  slug
   * @param {String} byField the field to use in slugify
   * @param {String} slugField the name of slug in document => default("slug")
   * @returns mongooes middleware
   */
  static makeSlugFieldWhenSave(byField, slugField = "slug") {
    return function (next) {
      this[slugField] = slugify(this[byField]);
      next();
    };
  }

  /**
   * when update doc create slug using slugify lib using field for document
   * and set in data in field in doc by default named  slug
   * @param {String} byField the field to use in slugify
   * @param {String} slugField the name of slug in document => default("slug")
   * @returns mongooes middleware
   */
  static makeSlugFieldWhenUpdate(byField, slugField = "slug") {
    return function (next) {
      const update = this.getUpdate();

      if (update[byField]) update[slugField] = slugify(update[byField]);

      next();
    };
  }
}

module.exports = HelperModel;
