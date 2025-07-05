
import StaffPermissions from "../models/staff_permission.model.js";

export const getAllStaffPermissions = async (req, res) => {
    try {
        const permissions = await StaffPermissions.find()
            .lean()
            .exec();


        return res.status(200).json({
            message: "Staff roles fetched successfully",
            success: true,
            data: permissions
        });
    } catch (error) {
        console.error("Error fetching staff roles:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getAllStaffPermissionId = async (req, res) => {
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


