import StaffRole from "../../models/staff_role.model.js";
import { apiResponse } from "../../helper.js";

// Helper function for input validation
const validateRoleInput = (name, permissions) => {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "Role name is required and must be a non-empty string";
  }
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return "Permissions are required and must be a non-empty array";
  }
  return null;
};

export const getAllStaffRoles = async (req, res) => {
  try {
    const roles = await StaffRole.find()
      .populate("permissions", "name description")
      .lean()
      .exec();

    const Staff = (await import("../../models/staff.model.js")).default;
    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const userCount = await Staff.countDocuments({ staffRoleId: role._id });
        return { ...role, userCount };
      })
    );

    return res
      .status(200)
      .json(
        apiResponse(
          200,
          { roles: rolesWithUserCount },
          "Staff roles fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching staff roles:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const fetchRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Role ID is required"));
    }

    const role = await StaffRole.findById(id)
      .populate({ path: "permissions", select: "name description" })

      .lean()
      .exec();

    if (!role) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Staff role not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, role, "Staff role fetched successfully"));
  } catch (error) {
    console.error("Error fetching staff role:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const createStaffRole = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Request body cannot be empty"));
    }

    const { name, permissions } = req.body;

    console.log(
      "Creating staff role with name:",
      name,
      "and permissions:",
      permissions
    );

    const validationError = validateRoleInput(name, permissions);
    if (validationError) {
      return res.status(400).json(apiResponse(400, null, validationError));
    }

    const existingRole = await StaffRole.findOne({ name: name.trim() })
      .lean()
      .exec();
    if (existingRole) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Role with this name already exists"));
    }

    const createRole = await StaffRole.create({
      name: name.trim(),
      permissions,
    });

    const populatedRole = await StaffRole.findById(createRole._id)
      .populate("permissions", "name description slug")
      .lean()
      .exec();

    return res
      .status(201)
      .json(apiResponse(201, populatedRole, "Staff role created successfully"));
  } catch (error) {
    console.error("Error creating staff role:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const updateStaffRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Role ID is required"));
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Request body cannot be empty"));
    }

    const { name, permissions } = req.body;

    const validationError = validateRoleInput(name, permissions);
    if (validationError) {
      return res.status(400).json(apiResponse(400, null, validationError));
    }

    const existingRole = await StaffRole.findOne({
      name: name.trim(),
      _id: { $ne: id },
    })
      .lean()
      .exec();

    if (existingRole) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Role with this name already exists"));
    }

    const updatedRole = await StaffRole.findByIdAndUpdate(
      id,
      { name: name.trim(), permissions },
      { new: true }
    )
      .populate("permissions", "name description")
      .lean()
      .exec();

    if (!updatedRole) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Staff role not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, updatedRole, "Staff role updated successfully"));
  } catch (error) {
    console.error("Error updating staff role:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const deleteStaffRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Role ID is required"));
    }

    const Staff = (await import("../../models/staff.model.js")).default;
    const staffCount = await Staff.countDocuments({ staffRoleId: id });

    if (staffCount > 0) {
      return res
        .status(400)
        .json(
          apiResponse(
            400,
            null,
            "Cannot delete role associated with staff members"
          )
        );
    }

    const deletedRole = await StaffRole.findByIdAndDelete(id).lean().exec();

    if (!deletedRole) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Staff role not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, null, "Staff role deleted successfully"));
  } catch (error) {
    console.error("Error deleting staff role:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};
