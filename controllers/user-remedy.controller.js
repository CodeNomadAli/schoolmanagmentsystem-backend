import Remedy from "../models/remedy.model.js";
import { apiResponse } from "../helper.js";
import User from "../models/user.model.js";
import Plan from "../models/plan.model.js";
import mongoose from "mongoose";


export const getAllRemedies = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json(apiResponse(401, null, "Unauthorized: No user ID"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(apiResponse(404, null, "User not found"));
    }

    // Get all active invoices
    const activeInvoices = (user.invoices || []).filter(inv => inv.isActive);

    if (!activeInvoices.length) {
      return res.status(200).json(apiResponse(200, {
        remedies: [],
        pagination: { total: 0, page: 1, limit: 10, pages: 0 }
      }, "No active plans found."));
    }

    const planSlugs = activeInvoices
      .map(inv => inv.planName?.toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean);

    const plans = await Plan.find({ slug: { $in: planSlugs } }).lean();

    const isFullAccess = plans.some(plan =>
      ["monthly", "annually"].includes(plan.slug)
    );

    let remedyIdArrays = [];

    if (!isFullAccess) {
      for (const plan of plans) {
        const remedyIds = (plan.features || [])
          .filter(f => Array.isArray(f.remedies))
          .flatMap(f => f.remedies || []);

        remedyIdArrays.push(...remedyIds);
      }

      // Remove duplicates
      remedyIdArrays = [...new Set(remedyIdArrays)];
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const queryLimit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * queryLimit;
    const search = req.query.search || "";

    const searchQuery = {};

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (!isFullAccess) {
      if (!remedyIdArrays.length) {
        return res.status(200).json(apiResponse(200, {
          remedies: [],
          pagination: { total: 0, page, limit: queryLimit, pages: 0 }
        }, "No remedies available for current plans."));
      }

      searchQuery._id = { $in: remedyIdArrays };
    }

    const [remedies, total] = await Promise.all([
      Remedy.find(searchQuery)
        .populate(["createdBy", "category", "ailments"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(queryLimit),
      Remedy.countDocuments(searchQuery),
    ]);

    res.status(200).json(apiResponse(200, {
      remedies,
      pagination: {
        total,
        page,
        limit: queryLimit,
        pages: Math.ceil(total / queryLimit),
      },
    }, "Successfully fetched remedies."));
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const getRemedyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    const remedy = await Remedy.findById(id).populate([
      {
        path: "createdBy",
      },
      {
        path: "category",
      },

      {
        path: "ailments",
      },
    ]);

    if (!remedy) {
      return res
        .status(404)
        .json({ message: "Remedy not found or deleted", success: false });
    }

    res
      .status(200)
      .json(apiResponse(200, remedy, "Successfully fetched remedy"));
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};


export const toggleBookmark = async (req, res) => {
  try {
    
    const {userId,id} = req.body

    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "User ID or Remedy ID is missing",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyBookmarked = user.bookMarkRemedies.includes(id);

    if (alreadyBookmarked) {
      
      user.bookMarkRemedies = user.bookMarkRemedies.filter(
        (remId) => remId !== id
      );
    } else {
      // Add remedyId to bookmarks
      user.bookMarkRemedies.push(id);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: alreadyBookmarked
        ? "Remedy removed from bookmarks"
        : "Remedy added to bookmarks",
      bookMarkRemedies: user.bookMarkRemedies,
    });
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while toggling bookmark",
    });
  }
};






export const getBookmarkedRemedies = async (req, res) => {
  try {
     
    const userId = req.body.user?.id || req.user?.id;

   const user = await User.findById(userId)

    if(!user){
    return res
      .status(404)
      .json(apiResponse(500, null, "User Not found"));   
    }
       const bookmarkedIds = user.bookMarkRemedies;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

  
    const remedies = await Remedy.find({ _id: { $in: bookmarkedIds } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

  
    const total = await Remedy.countDocuments({ bookMark: true });

    return res.status(200).json(
      apiResponse(200, {
        remedies,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }, "Bookmarked remedies fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching bookmarked remedies:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Failed to fetch bookmarked remedies"));
  }
};