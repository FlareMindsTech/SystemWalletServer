import mongoose from "mongoose";

const user = new mongoose.Schema({
    userName: {
        type: String,
        // required: true
    },
    ReferenceID: {
  type: String,
  unique: true,
  required: true
},

    email: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    PanCardno: {
        type: String,
        required: true
    },
    AadharCardNo: {
        type: String,
        required: true
    },
    panCardFrontImage: { type: String, required: true },
    panCardBackImage: { type: String, required: true },
    aadharCardFrontImage: { type: String, required: true },
    aadharCardBackImage: { type: String, required: true },
    Role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}
)
const User = mongoose.model('User', user)
export default User;