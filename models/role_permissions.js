import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'Role is required'],
        autopopulate: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: [true, 'Permissions are required'],
        autopopulate: true
    }],
}, {
    timestamps: true,
});

rolePermissionSchema.plugin(require('mongoose-autopopulate'));



export default mongoose.model('RolePermission', rolePermissionSchema);
