import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    school_id: { type: String, required: true }, // which school this chat belongs to
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }], // optional
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;