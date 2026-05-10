const { Product } = require("../../models/shop.models");

// ── Get All Products ─────────────────────────
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      search,
      sort,
      productType,
    } = req.query;

    // 🔥 STEP 1: Base conditions
    let conditions = [{ isAvailable: true }];

    // ── CATEGORY ─────────────────────────
    if (category) {
      const cats = Array.isArray(category) ? category : [category];
      conditions.push({ category: { $in: cats } });
    }

    // ── NEW PRODUCTS ─────────────────────────
    if (req.query.new === "true") {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      conditions.push({ createdAt: { $gte: last7Days } });
    }

    // ── SUBCATEGORY (MEN/WOMEN/BOTH FIX) ─────────────────────────
    if (subCategory) {
      const subCategories = Array.isArray(subCategory)
        ? subCategory
        : [subCategory];

      let finalSub = [...subCategories];

      if (subCategories.includes("men") || subCategories.includes("women")) {
        finalSub.push("both");
      }

      conditions.push({ subCategory: { $in: finalSub } });
    }

    // ── PRODUCT TYPE ─────────────────────────
    if (productType) {
      const types = Array.isArray(productType) ? productType : [productType];

      conditions.push({ productType: { $in: types } });
    }

    // ── PRICE FILTER ─────────────────────────
    if (minPrice || maxPrice) {
      conditions.push({
        $expr: {
          $and: [
            ...(minPrice
              ? [
                  {
                    $gte: [
                      { $ifNull: ["$discountPrice", "$price"] },
                      Number(minPrice),
                    ],
                  },
                ]
              : []),
            ...(maxPrice
              ? [
                  {
                    $lte: [
                      { $ifNull: ["$discountPrice", "$price"] },
                      Number(maxPrice),
                    ],
                  },
                ]
              : []),
          ],
        },
      });
    }

    // ── SEARCH (FULL FIX) ─────────────────────────
    if (search) {
      const regex = new RegExp(search.trim(), "i");

      conditions.push({
        $or: [
          { name: regex },
          { description: regex },
          { brand: regex },

          { category: regex },
          { productType: regex },

          { "variants.color": regex },
          { "variants.style": regex },
          { "variants.size": regex },

          { tags: regex },
          ...(search.toLowerCase() === "men"
            ? [{ subCategory: { $in: ["men", "both"] } }]
            : []),

          ...(search.toLowerCase() === "women"
            ? [{ subCategory: { $in: ["women", "both"] } }]
            : []),
        ],
      });
    }
    // ── FINAL FILTER ─────────────────────────
    const filter = { $and: conditions };

    // ── SORT ─────────────────────────
    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { discountPrice: 1, price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { discountPrice: -1, price: -1 };
    }

    if (sort === "rating") {
      sortOption = { "ratings.average": -1 };
    }

    // ── PAGINATION ─────────────────────────
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // ── QUERY EXECUTION ─────────────────────────
    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // ── RESPONSE ─────────────────────────
    res.status(200).json({
      message: "Products fetched successfully",
      total: totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ── Get Single Product ───────────────────────
exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /shop/products/recommended/:productId
exports.getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    const recommended = await Product.find({
      category: product.category,
      _id: { $ne: productId },
    }).limit(8);

    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
