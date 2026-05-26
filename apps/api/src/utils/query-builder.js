const buildQuery = (query, searchFields = [], filterFields = [], defaultSort = "-createdAt") => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const rawSort = query.sort || defaultSort;
  const search = query.q ? String(query.q).trim() : "";

  // Parse sort for Prisma. e.g. "-createdAt" -> { createdAt: "desc" }
  let orderBy = {};
  if (rawSort.startsWith("-")) {
    orderBy[rawSort.substring(1)] = "desc";
  } else {
    orderBy[rawSort] = "asc";
  }

  const where = {};

  if (search && searchFields.length) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search }
    }));
  }

  filterFields.forEach((field) => {
    const value = query[field];

    if (value === undefined || value === "" || value === "all") {
      return;
    }

    if (typeof value === "string" && value.includes(",")) {
      where[field] = { in: value.split(",").map((item) => item.trim()) };
      return;
    }

    // boolean casting for prisma
    if (value === "true") where[field] = true;
    else if (value === "false") where[field] = false;
    else where[field] = value;
  });

  return {
    where,
    page,
    limit,
    skip: (page - 1) * limit,
    orderBy,
  };
};

module.exports = buildQuery;
