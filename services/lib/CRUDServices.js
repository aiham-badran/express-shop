const Services = require("./Services");
const Errors = require("../../utils/errors/Errors");
const APIFeatures = require("./APIFeatures");

/**
 * CRUD Services class
 *
 * This class extends the Services class and provides methods for basic CRUD (Create, Read, Update, Delete) operations.
 *
 * @class CRUDServices
 * @extends Services
 */
class CRUDServices extends Services {
  /**
   * Constructor
   *
   * Initializes a new instance of the CRUDServices class.
   *
   * @param {Object} model - The model instance that this service collection belongs to.
   */

  constructor(model) {
    super(model);
  }

  /**
   * Get a document by ID
   *
   * Retrieves a document from the database by its ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @returns {Promise<Object>} The retrieved document.
   */
  async _getByIdBody(req) {
    const { id } = req.params;
    const data = await this._model.findById(id);
    if (!data) throw new Errors(`Document with ID ${id} not found`, 404);

    return data;
  }

  /**
   * Get a document by ID (HTTP endpoint)
   *
   * Handles HTTP requests to retrieve a document by its ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async getById(req, res, next) {
    try {
      const data = await this._getByIdBody(req);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all documents with pagination
   *
   * Retrieves all documents from the database with
   * pagination,sort,filter and limit with fields, search
   * or all together
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<Object>} The retrieved documents.
   */
  async _getAllBody(req) {
    let filters = {};
    if (req.filterObj) filters = req.filterObj;

    //Count the number of documents matching the filters.
    //If no documents are found, return an error message.
    const countDocuments = await this._model.countDocuments(filters);
    if (!countDocuments) return { message: "No Documents Inserted yet" };

    const features = new APIFeatures(this._model.find(filters), req.query);

    const { mongooseQuery, pagination } = features
      .paginate(countDocuments)
      .search()
      .filter()
      .sort()
      .limitFields();
    const data = await mongooseQuery;

    return {
      pagination,
      countDocuments,
      count: data.length,
      data,
    };
  }

  /**
   * Get all documents
   *
   * Retrieves all documents from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<Object>} The retrieved documents.
   */
  async getAll(req, res, next) {
    try {
      const data = await this._getAllBody(req);
      res.json({ ...data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a new document body
   *
   * Creates a new document in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @returns {Promise<Object>} The created document.
   */
  async _createBody(req) {
    return await this._model.create(req.body);
  }

  /**
   * Create a new document
   *
   * Creates a new document in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async create(req, res, next) {
    try {
      const newData = await this._createBody(req);
      res.status(201).json({ data: newData });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update a document by ID body
   *
   * Updates a document in the database by its ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @returns {Promise<Object>} The updated document.
   */
  async _updateByIdBody(req) {
    const { id } = req.params;
    const data = await this._model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!data) throw new Errors(`Document with ID ${id} not found`, 404);

    return data;
  }

  /**
   * Update a document by ID
   *
   * Updates a document in the database by its ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async updateById(req, res, next) {
    try {
      const data = await this._updateByIdBody(req);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a document by ID body
   *
   * Deletes a document from the database by its ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @returns {Promise<Object>} The deleted document.
   */
  async _deleteByIdBody(req) {
    const { id } = req.params;
    const data = await this._model.findByIdAndDelete(id);

    if (!data) throw new Errors(`Document with ID ${id} not found`, 404);

    return data;
  }

  /**
   * Delete a document by ID
   *
   * Deletes a document from the database by its ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async deleteById(req, res, next) {
    try {
      await this._deleteByIdBody(req);

      res.status(204).json({ message: "Data was deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CRUDServices;
