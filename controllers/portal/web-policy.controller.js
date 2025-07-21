import Webpolices from "../../models/web_Policy.model.js";
import { apiResponse } from "../../helper.js";
import mongoose from "mongoose";
   
const createPrivacyPolicy = async  (req,res) =>{
    try {
        const { title, description } = req.body;
        const createdBy = req.user?._id; 
    
        const existing = await Webpolices.findOne({ title: title.trim() });
        if (existing) {
        return res
            .status(409)
            .json(apiResponse(409, null, "Privacy policy with this title already exists"));
        }
    
        const privacyPolicy = await Webpolices.create({
        title,
        description,
        createdBy,
        });
    
        return res.status(201).json(apiResponse(201, privacyPolicy, "Privacy policy created"));
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json(apiResponse(500, null, "Internal server error"));
    }
}

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
      const policies = await Webpolices.find(searchQuery).sort({ createdAt: -1 });
      return res.status(200).json(apiResponse(200, { policies }, "Fetched all privacy policies"));
    }

    
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [webPolicies, total] = await Promise.all([
      webPolicies.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      webPolicies.countDocuments(searchQuery),
    ]);

    const data = {
      webPolicies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };

    return res.status(200).json(apiResponse(200, data, "Fetched paginated privacy policies"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
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
            return res.status(404).json(apiResponse(404, null, "Privacy policy not found"));
        }

        return res.status(200).json(apiResponse(200, policy, "Privacy policy details"));
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json(apiResponse(500, null, "Internal server error"));
    }
}

 const updatePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json(apiResponse(400, null, "Invalid policy ID"));
        }

        const policy = await Webpolices.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!policy) {
            return res.status(404).json(apiResponse(404, null, "Privacy policy not found"));
        }

        return res.status(200).json(apiResponse(200, policy, "Privacy policy updated"));
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json(apiResponse(500, null, "Internal server error"));
    }
}

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
            return res.status(404).json(apiResponse(404, null, "Privacy policy not found"));
        }

        return res.status(200).json(apiResponse(200, policy, "Privacy policy deleted"));
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json(apiResponse(500, null, "Internal server error"));
    }
}

export {
    createPrivacyPolicy,
    getAllPrivacyPolicies,
    getPrivacyPolicyById,
    updatePrivacyPolicy,
    deletePrivacyPolicy
}