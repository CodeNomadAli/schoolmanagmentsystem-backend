import Webpolices from "../../models/web_Policy.model.js";
import { apiResponse } from "../../helper.js";
import mongoose from "mongoose";
import slugify from "../../utils/slugify.js";

const createPrivacyPolicy = async (req, res) => {
  try {
    const { title, description, slug } = req.body;
    const createdBy = req.user?._id;

    if (!title || !slug) {
      return res
        .status(400)
        .json(
          apiResponse(400, null, "Title, description, and slug are required")
        );
    }

    if (
      await Webpolices.findOne({
        $or: [
          { title: title.trim() },
          { slug: slug ? slug.trim() : undefined }, 
        ],
      })
    ) {
      return res
        .status(400)
        .json(
          apiResponse(
            400,
            null,
            "Privacy policy with this title or slug already exists"
          )
        );
    }

    const sluggener = slugify(slug);

    const privacyPolicy = await Webpolices.create({
      title: title.trim(),
      slug: sluggener,
      description: description.trim(),
      createdBy,
    });

    return res
      .status(201)
      .json(apiResponse(201, privacyPolicy, "Privacy policy created"));
  } catch (error) {
    console.error("Error creating privacy policy:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

const getAllPrivacyPolicies = async (req, res) => {
  try {
    const v = req.query.v;
    const search = req.query.search || "";

    const searchQuery = { isActive: true };

    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (v === "all") {
      const policies = await Webpolices.find(searchQuery).sort({
        createdAt: -1,
      });
      return res
        .status(200)
        .json(apiResponse(200, { policies }, "Fetched all privacy policies"));
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [policies, total] = await Promise.all([
      Webpolices.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Webpolices.countDocuments(searchQuery),
    ]);

    const data = {
      policies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };

    return res
      .status(200)
      .json(apiResponse(200, data, "Fetched paginated privacy policies"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

const getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(apiResponse(400, null, "Invalid policy ID"));
    }

    const policy = await Webpolices.findById(id);

    if (!policy) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Privacy policy not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, policy, "Privacy policy details"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

const updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, slug } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(apiResponse(400, null, "Invalid policy ID"));
    }

    if (title) title = title.trim();
    if (description) description = description.trim();
    if (slug) slug = slug.trim();

    if (title && !slug) {
      slug = slugify(title, { lower: true, strict: true });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (slug) updateData.slug = slug;

    const updatedPolicy = await Webpolices.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPolicy) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Privacy policy not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, updatedPolicy, "Privacy policy updated"));
  } catch (error) {
    console.error("Error updating privacy policy:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

const deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(apiResponse(400, null, "Invalid policy ID"));
    }

    const policy = await Webpolices.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!policy) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Privacy policy not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, policy, "Privacy policy deleted"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export {
  createPrivacyPolicy,
  getAllPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
