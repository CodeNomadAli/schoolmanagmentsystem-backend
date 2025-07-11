
import StaffRole from "../../models/staff_role.model.js";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";
import { getClientInfo } from "../../utils/clientInfo.js";
import Session from "../../models/session.model.js";

export const getAllStaffRoles = async (req, res) => {
    try {
        const roles = await StaffRole.find()
            .populate("permissions", "name description")
            .lean()
            .exec();

        // Count users for each role
        const Staff = (await import("../../models/staff.model.js")).default;
        const rolesWithUserCount = await Promise.all(
            roles.map(async (role) => {
                const userCount = await Staff.countDocuments({ staffRoleId: role._id });
                return { ...role, userCount };
            })
        );

        return res.status(200).json({
            message: "Staff roles fetched successfully",
            success: true,
            data: rolesWithUserCount
        });
    } catch (error) {
        console.error("Error fetching staff roles:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const fetchRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await StaffRole.findById(id)
            .populate("permissions", "name description")
            .lean()
            .exec();

        if (!role) {
            return res.status(404).json({
                message: "Staff role not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Staff role fetched successfully",
            success: true,
            data: role
        });
    } catch (error) {
        console.error("Error fetching staff role:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateStaffRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        const updatedRole = await StaffRole.findByIdAndUpdate(
            id,
            { name, permissions },
            { new: true }
        ).populate("permissions", "name description").lean().exec();

        if (!updatedRole) {
            return res.status(404).json({
                message: "Staff role not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Staff role updated successfully",
            success: true,
            data: updatedRole
        });
    } catch (error) {
        console.error("Error updating staff role:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const createStaffRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions || permissions.length === 0) {
            return res.status(400).json({
                message: "Name and permissions are required",
                success: false
            });
        }
        const createRole = await StaffRole.create({ name, permissions });

        return res.status(200).json({
            message: "Staff role created successfully",
            success: true,
            data: createRole
        });
    } catch (error) {
        console.error("Error updating staff role:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const deleteStaffRole = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Role ID is required",
                success: false
            });
        }

        // Check if the role is associated with any staff members
        const Staff = (await import("../../models/staff.model.js")).default;
        const staffCount = await Staff.countDocuments({ staffRoleId: id });        

        if (staffCount > 0) {
            return res.status(400).json({
                message: "Cannot delete role associated with staff members",
                success: false
            });
        }

        const deletedRole = await StaffRole.findByIdAndDelete(id).lean().exec();

        if (!deletedRole) {
            return res.status(404).json({
                message: "Staff role not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Staff role deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting staff role:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


