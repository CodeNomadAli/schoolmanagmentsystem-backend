
import Remedy from "../models/remedy.model.js";
import { apiResponse } from "../helper.js";
import Ailment from "../models/ailment.model.js";
import Category from "../models/remedy_categories.model.js";

export const getAllRemedies = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // Parse multi-value queries, split by comma and trim
    const nameQueries = (req.query.name || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const categoryQueries = (req.query.category || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const ailmentQueries = (req.query.ailment || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const searchQuery = {};

    // Remedy name search (any name starting with one of the values)
    if (nameQueries.length > 0) {
      // build regex for each name and use $or to match any
      searchQuery.$or = nameQueries.map(name => ({
        name: { $regex: new RegExp("^" + name, "i") },
      }));
    }

    // Category search
    if (categoryQueries.length > 0) {
      const matchingCategories = await Category.find({
        name: { $in: categoryQueries.map(cat => new RegExp(cat, "i")) },
        isActive: true,
      }, { _id: 1 }).lean();

      const categoryIds = matchingCategories.map(c => c._id);
      if (categoryIds.length > 0) {
        searchQuery.category = { $in: categoryIds };
      } else {
        return res.status(200).json(apiResponse(200, {
          remedies: [],
          pagination: { total: 0, page, limit, pages: 0 }
        }, "No remedies found for given categories."));
      }
    }

    // Ailment search
    if (ailmentQueries.length > 0) {
      const matchingAilments = await Ailment.find({
        slug: { $in: ailmentQueries },
        isActive: true,
      }, { _id: 1 }).lean();

      const ailmentIds = matchingAilments.map(a => a._id);
      if (ailmentIds.length > 0) {
        searchQuery.ailments = { $in: ailmentIds };
      } else {
        return res.status(200).json(apiResponse(200, {
          remedies: [],
          pagination: { total: 0, page, limit, pages: 0 }
        }, "No remedies found for given ailments."));
      }
    }

    const [remedies, total] = await Promise.all([
      Remedy.find(searchQuery)
        .populate(["createdBy", "category", "ailments"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Remedy.countDocuments(searchQuery),
    ]);

    res.status(200).json(apiResponse(200, {
      remedies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }, "Successfully fetched remedies."));
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json(apiResponse(500, null, error.message));
  }
};




export const getAllCategoryAilments = async (req, res) => {
  try {

    const [categories, ailments] = await Promise.all([
      Category.find({}, { _id: 1, name: 1 }).sort({ name: 1 }),
      Ailment.find({}, { _id: 1, name: 1,slug:1 }).sort({ name: 1 }),
    ]);
     
    res.status(200).json(
      apiResponse(200, { categories, ailments }, "Successfully fetched remedy categories and ailments")
    );
  } catch (error) {
    console.error("Error fetching categories and ailments:", error);
    res
      .status(500)
      .json(apiResponse(500, null, "Failed to fetch remedy categories and ailments"));
  }
};

