import { NextResponse } from "next/server";
import QRCode from "qrcode";
import QRHistory from "@/models/qrhistory.js";
import connectDB from "@/config/database";
import { encryptData } from "@/utils/crypto";

export async function POST(req) {
  try {
    await connectDB();

    // Generate next serial number
    const lastRecord = await QRHistory
      .findOne()
      .sort({ serialNumber: -1 });

    const serialNumber = lastRecord
      ? lastRecord.serialNumber + 1
      : 1;

    const body = await req.json();

    const {
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
      activeShuruMode,
    } = body;

    const qrData = encryptData({
      serialNumber,
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
      activeShuruMode,
    });

    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "L",
      width: 1200,
      margin: 2,
    });

    const qrHistoryEntry = new QRHistory({
      serialNumber,
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
      activeShuruMode,
    });

    await qrHistoryEntry.save();

    return NextResponse.json({
      success: true,
      serialNumber,
      qrImage,
    });

  } catch (error) {
    console.error("Error generating QR code:", error);

    return NextResponse.json({
      success: false,
      message: "QR generation failed",
    });
  }
}