import mongoose from "mongoose";

const qrHistorySchema = new mongoose.Schema({
    serialNumber : {type: Number, required: true},
    sensorId: { type: String, required: true },
    name: { type: String, required: true },
    sensorType: { type: String, required: true },
    ipAddress: { type: String, required: false },
    rtspUrl: { type: String, required: false },
    battery: { type: String, required: false },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const QRHistory = mongoose.model("QRHistory", qrHistorySchema);
export default QRHistory;