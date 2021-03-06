const knex = require("knex");
const _ = require("lodash");

const DEFAULT_OPTIONS = {
  limit: 100,
  select: "*"
};

const SET_TRANSACTION_LEVEL = "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;";

module.exports = class Adapter {
  constructor(config, options) {
    this.knex = knex({
      client: "pg",
      connection: config
    });
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.schemas = {};
  }

  async init() {
    await this.knex.raw("select now();");
  }

  async transaction() {
    return new Promise((resolve, reject) => {
      this.knex
        .transaction((trx) => {
          trx.raw(SET_TRANSACTION_LEVEL).then(() => resolve(trx));
        })
        .catch(reject);
    });
  }

  async transactionCommit(trx) {
    await trx.commit();
  }

  async transactionRollback(trx) {
    await trx.rollback();
  }

  _sanitize(schemaKey, data) {
    const schema = this.schemas[schemaKey];
    if (!schema) { throw new Error(`schema ${schemaKey} not found`); }
    if (!data) { throw new Error("data is required"); }
    if (typeof data !== "object") { throw new Error("data expected to be an object"); }
    if (Array.isArray(data)) { throw new Error("data should not be an array"); }

    return _.mapValues(data, (value, key) => {
      const attribute = schema.properties[key];
      switch (attribute && attribute.type) {
        case "object":
          return typeof value === "string"
            ? value
            : JSON.stringify(value);
        case "number":
        case "integer":
          return typeof value === "string"
            ? Number(value)
            : value;
      }
      return value;
    });
  }

  registerSchema(schemaKey, schema) {
    this.schemas[schemaKey] = schema;
  }

  async insert(schemaKey, data, trx) {
    const dataToInsert = data.id
      ? data
      : _.omit(data, "id");

    const fixedData = this._sanitize(schemaKey, dataToInsert);

    const insert = this.knex(schemaKey).insert(fixedData).returning("*");
    const result = trx ? await insert.transacting(trx) : await insert;
    return result[0];
  }

  async update(schemaKey, id, data, trx) {
    if (!id) { throw new Error("id is required"); }
    const fixedData = this._sanitize(schemaKey, data);

    const update = this.knex(schemaKey).where({ id }).update(fixedData).returning("*");
    const result = trx ? await update.transacting(trx) : await update;

    if (!result.length) {
      throw new Error(`Update failed – record with id ${id} not found`);
    }

    return result[0];
  }

  async findOne(schemaKey, filter, options, trx) {
    return (await this.find(schemaKey, filter, Object.assign({ limit: 1 }, options), trx))[0];
  }

  async find(schemaKey, filter, options, trx) {
    let query = this.knex(schemaKey).where(filter);
    _.each(Object.assign({}, this.options, options), (value, key) => {
      switch (key) {
        case "limit":
        case "skip":
        case "select":
          query = query[key](value);
          break;
        case "sort":
          _.each(value, (v, k) => {
            query = query.orderBy(k, Number(v) === -1 ? "desc" : "asc");
          });
          break;
      }
    });

    return trx ? query.transacting(trx) : query;
  }

  async shutdown() {
    await this.knex.destroy();
  }
};
