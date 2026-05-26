const asyncHandler = require("./async-handler");
const AppError = require("./app-error");
const buildQuery = require("./query-builder");

const createCrudController = (prismaModel, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    include = undefined,
    defaultSort = "-createdAt",
    beforeCreate,
    beforeUpdate,
  } = options;

  return {
    list: asyncHandler(async (req, res) => {
      const { where, page, limit, skip, orderBy } = buildQuery(
        req.query,
        searchFields,
        filterFields,
        defaultSort
      );

      const [totalItems, items] = await Promise.all([
        prismaModel.count({ where }),
        prismaModel.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include,
        })
      ]);

      res.json({
        items,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit) || 1,
        },
      });
    }),

    create: asyncHandler(async (req, res) => {
      const payload = beforeCreate
        ? await beforeCreate(req, { ...req.body })
        : req.body;

      const createdItem = await prismaModel.create({
        data: payload,
        include,
      });

      res.status(201).json(createdItem);
    }),

    getById: asyncHandler(async (req, res) => {
      const item = await prismaModel.findUnique({
        where: { id: req.params.id },
        include,
      });

      if (!item) {
        throw new AppError("Resource not found.", 404);
      }

      res.json(item);
    }),

    update: asyncHandler(async (req, res) => {
      const payload = beforeUpdate
        ? await beforeUpdate(req, { ...req.body })
        : req.body;

      try {
        const item = await prismaModel.update({
          where: { id: req.params.id },
          data: payload,
          include,
        });
        res.json(item);
      } catch (error) {
        if (error.code === 'P2025') {
          throw new AppError("Resource not found.", 404);
        }
        throw error;
      }
    }),

    remove: asyncHandler(async (req, res) => {
      try {
        await prismaModel.delete({
          where: { id: req.params.id }
        });
        res.json({ message: "Resource deleted successfully." });
      } catch (error) {
        if (error.code === 'P2025') {
          throw new AppError("Resource not found.", 404);
        }
        throw error;
      }
    }),
  };
};

module.exports = createCrudController;
