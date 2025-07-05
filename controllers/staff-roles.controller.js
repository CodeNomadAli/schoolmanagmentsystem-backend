
import StaffRole from "../models/staff_role.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { getClientInfo } from "../utils/clientInfo.js";
import Session from "../models/session.model.js";

export const getAllStaffRoles = async (req, res) => {
    try {
        const roles = await StaffRole.find()
            .populate("permissions", "name description")
            .lean()
            .exec();

        // Count users for each role
        const Staff = (await import("../models/staff.model.js")).default;
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


