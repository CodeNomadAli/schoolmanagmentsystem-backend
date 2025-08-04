import mongoose from "mongoose";
import StaffPermissions from "../../models/staff_permission.model.js";
import StaffRole from "../../models/staff_role.model.js";


export const getAllStaffPermissions = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const permissions = await StaffPermissions.find().lean().session(session).exec();

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Staff roles fetched successfully",
            success: true,
            data: permissions
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error fetching staff roles:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// GET staff permission by role ID
export const getAllStaffPermissionId = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const role = await StaffRole.findById(id)
            .populate({ path: "permissions", select: "name description", options: { session } })
            .lean()
            .session(session)
            .exec();

        if (!role) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "Staff role not found",
                success: false
            });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Staff role fetched successfully",
            success: true,
            data: role
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error fetching staff role:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
