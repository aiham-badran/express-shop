/**
 * APIFeatures class
 *
 * This class is responsible for filtering, sorting, limiting, searching, and paginating MongoDB queries.
 *
 * @class APIFeatures
 */
class APIFeatures {
  /**
   * Constructor
   *
   * Initializes a new instance of the APIFeatures class with the mongoose query and query string.
   *
   * @param {Object} mongooseQuery - The mongoose query object.
   * @param {Object} queryString - The query string object.
   */
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  /**
   * Filter the query string
   *
   * Removes fields from the query string that are not required for the query.
   * then Replaces MongoDB query operators in the query string with the `$` symbol.
   *
   * @returns {APIFeatures} The instance of the APIFeatures class.
   */
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(get|gt|let|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Sort the query
   *
   * Sorts the query based on the sort field specified in the query string.
   *
   * @returns {APIFeatures} The instance of the APIFeatures class.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  /**
   * Limit the query fields
   *
   * Selects only the fields specified in the query string.
   *
   * @returns {APIFeatures} The instance of the APIFeatures class.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  /**
   * Search the query
   *
   * Searches for documents that match the search string specified in the query string.
   *
   * @returns {APIFeatures} The instance of the APIFeatures class.
   */
  search() {
    if (this.queryString.search) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.search, $options: "i" } },
        { description: { $regex: this.queryString.search, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  /**
   * Paginate the query
   *
   * Paginates the query based on the page, limit, and count documents.
   *
   * @param {Number} countDocuments - The total number of documents.
   * @returns {APIFeatures} The instance of the APIFeatures class.
   */
  paginate(countDocuments) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Paginate Result
    this.pagination = {
      currentPage: page,
      limit,
      pages: parseInt(countDocuments / limit),
    };

    if (endIndex < countDocuments) this.pagination.next = page + 1;
    if (skip > 0) this.pagination.prev = page - 1;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
