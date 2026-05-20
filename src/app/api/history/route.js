import { NextResponse } from "next/server";
import QRHistory from "@/models/qrhistory.js";
import connectDB from "@/config/database.js";
export async function GET() {
  try {
    await connectDB();
    const history = await QRHistory.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.log("Error fetching history:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch history",
    });
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const { sensorId, name, sensorType, ipAddress, rtspUrl, battery, status } =
      req.body;
    console.log("Saving history entry:", {
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
    });
    const qrHistoryEntry = new QRHistory({
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
    });
    await qrHistoryEntry.save();
    return NextResponse.json({
      success: true,
      message: "History entry saved",
    });
  } catch (error) {
    console.log("Error saving history entry:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to save history entry",
    });
  }
}
