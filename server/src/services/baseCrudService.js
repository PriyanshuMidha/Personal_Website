import ApiError from "../utils/ApiError.js";

export const createCrudService = (Model, options = {}) => {
  const defaultSort = options.defaultSort || { displayOrder: 1, createdAt: -1 };
  const searchFields = options.searchFields || [];
  const onCreate = options.onCreate;
  const onUpdate = options.onUpdate;
  const onRemove = options.onRemove;

  const buildSearchFilter = (search) => {
    if (!search || !searchFields.length) {
      return {};
    }

    return {
      $or: searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  };

  return {
    async listAdmin(query = {}) {
      const { page = 1, limit = 20, search } = query;
      const filter = buildSearchFilter(search);

      if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured;
      }

      if (query.isPublished !== undefined) {
        filter.isPublished = query.isPublished;
      }

      const [items, total] = await Promise.all([
        Model.find(filter)
          .sort(defaultSort)
          .skip((page - 1) * limit)
          .limit(limit),
        Model.countDocuments(filter),
      ]);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },

    async listPublic(filter = {}) {
      return Model.find({ isPublished: true, ...filter }).sort(defaultSort);
    },

    async getById(id) {
      const item = await Model.findById(id);
      if (!item) {
        throw new ApiError(404, `${Model.modelName} not found`);
      }
      return item;
    },

    async create(payload) {
      const item = await Model.create(payload);
      if (onCreate) {
        await onCreate(item, payload);
      }
      return item;
    },

    async update(id, payload) {
      const item = await Model.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        throw new ApiError(404, `${Model.modelName} not found`);
      }

      if (onUpdate) {
        await onUpdate(item, payload);
      }

      return item;
    },

    async remove(id) {
      const item = await Model.findByIdAndDelete(id);
      if (!item) {
        throw new ApiError(404, `${Model.modelName} not found`);
      }
      if (onRemove) {
        await onRemove(item);
      }
      return item;
    },
  };
};
