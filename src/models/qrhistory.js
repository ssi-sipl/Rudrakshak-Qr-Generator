import mongoose from "mongoose";

const qrHistorySchema = new mongoose.Schema({
    sensorId: { type: String, required: true },
    name: { type: String, required: true },
    sensorType: { type: String, required: true },
    ipAddress: { type: String, required: true },
    rtspUrl: { type: String, required: true },
    battery: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const QRHistory = mongoose.model("QRHistory", qrHistorySchema);
export default QRHistory;