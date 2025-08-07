import Remedy from "../models/remedy.model.js";
import { apiResponse } from "../helper.js";
import Ailment from "../models/ailment.model.js";
import Category from "../models/remedy_categories.model.js";
import Plan from "../models/plan.model.js";
import User from "../models/user.model.js";

export const getAllRemedies = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // Parse multi-value queries, split by comma and trim
    const nameQueries = (req.query.name || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const categoryQueries = (req.query.category || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const ailmentQueries = (req.query.ailment || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const searchQuery = {};

    // Remedy name search (start with / end with / contains)
    if (nameQueries.length > 0) {
      searchQuery.$or = nameQueries.flatMap((name) => [
        { name: { $regex: new RegExp("^" + name, "i") } },
        { name: { $regex: new RegExp(name + "$", "i") } },
        { name: { $regex: new RegExp(name, "i") } },
      ]);
    }

    if (categoryQueries.length > 0) {
      const matchingCategories = await Category.find(
        {
          name: { $in: categoryQueries.map((cat) => new RegExp(cat, "i")) },
          isActive: true,
        },
        { _id: 1 }
      ).lean();

      const categoryIds = matchingCategories.map((c) => c._id);
      if (categoryIds.length > 0) {
        searchQuery.category = { $in: categoryIds };
      } else {
        return res.status(200).json(
          apiResponse(
            200,
            {
              remedies: [],
              pagination: { total: 0, page, limit, pages: 0 },
            },
            "No remedies found for given categories."
          )
        );
      }
    }

    // Ailment search
    if (ailmentQueries.length > 0) {
      const matchingAilments = await Ailment.find(
        {
          slug: { $in: ailmentQueries },
          isActive: true,
        },
        { _id: 1 }
      ).lean();

      const ailmentIds = matchingAilments.map((a) => a._id);
      if (ailmentIds.length > 0) {
        searchQuery.ailments = { $in: ailmentIds };
      } else {
        return res.status(200).json(
          apiResponse(
            200,
            {
              remedies: [],
              pagination: { total: 0, page, limit, pages: 0 },
            },
            "No remedies found for given ailments."
          )
        );
      }
    }

    const [remedies, total] = await Promise.all([
      Remedy.find(searchQuery)
        .select("name slug media description reviews averageRating")
        .populate([
          {
            path: "createdBy",
            select: "name id",
          },
          {
            path: "category",
            select: "name slug",
          },
          {
            path: "ailments",
            select: "name slug",
          },
        ])

        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Remedy.countDocuments(searchQuery),
    ]);

    res.status(200).json(
      apiResponse(
        200,
        {
          remedies,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        "Successfully fetched remedies."
      )
    );
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json(apiResponse(500, null, error.message));
  }
};






export const getViewDetailsRemdy = async (req, res) => {
  try {
    const userId = req.user?.id || null; // user might not be logged in
    const remedySlug = req.params.slug;

    // Get remedy by slug (always)
    let remedy = await Remedy.findOne({ slug: remedySlug }).populate([
      { path: "category", select: "name" },
      { path: "ailments", select: "name slug" },
    ]);

    if (!remedy) {
      return res.status(404).json(apiResponse(404, null, "Remedy not found"));
    }

    // Default: no access
    let hasAccess = false;

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Check active plans
        const activeInvoices = (user.invoices || []).filter(
          (inv) => inv.isActive
        );
        const planSlugs = activeInvoices
          .map((inv) => inv.planName?.toLowerCase().replace(/\s+/g, "-"))
          .filter(Boolean);

        const plans = await Plan.find({ slug: { $in: planSlugs } }).lean();

        const isFullAccess = plans.some((plan) =>
          ["monthly", "annually"].includes(plan.slug)
        );

        let allowedRemedyIds = [];

        if (!isFullAccess) {
          for (const plan of plans) {
            const remedyIds = (plan.features || [])
              .filter((f) => Array.isArray(f.remedies))
              .flatMap((f) => f.remedies || []);
            allowedRemedyIds.push(...remedyIds);
          }
          allowedRemedyIds = [
            ...new Set(allowedRemedyIds.map((id) => id.toString())),
          ];
        }

        hasAccess =
          isFullAccess || allowedRemedyIds.includes(remedy._id.toString());
      }
    }

    // If user has access or is logged in with access
    if (hasAccess) {
      return res.status(200).json(
        apiResponse(
          200,
          {
            remedy,
            access: true,
          },
          "Full remedy access"
        )
      );
    } else {
      // Return limited info
      const limitedRemedy = {
        _id: remedy._id,
        name: remedy.name,
        slug: remedy.slug,
        description: remedy.description,
        media: remedy.media,
        category: remedy.category ? { name: remedy.category.name } : null,
        ailments: (remedy.ailments || []).map((a) => ({
          name: a.name,
          slug: a.slug,
        })),
        rating: remedy.rating,
        averageRating: remedy.averageRating,
      };

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            { remedy: limitedRemedy, access: false },
            "Limited remedy access"
          )
        );
    }
  } catch (error) {
    console.error("Error viewing remedy details:", error);
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


