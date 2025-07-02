import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Permission name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Permission name cannot exceed 50 characters'],
        minlength: [3, 'Permission name must be at least 3 characters'],
    }
}, {
    timestamps: true,
    versionKey: false
});

permissionSchema.pre('save', function(next) {s
    this.name = this.name.toLowerCase();
    next();
});

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;