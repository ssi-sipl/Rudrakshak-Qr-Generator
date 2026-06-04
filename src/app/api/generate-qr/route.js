import { NextResponse } from "next/server";
import QRCode from "qrcode";
import QRHistory from "@/models/qrhistory.js";
import connectDB from "@/config/database";
import { encryptData } from "@/utils/crypto";
export async function POST(req) {
  try {
    await connectDB();
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
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
      activeShuruMode,
    });
    console.log(qrData + "qr data in route.js");
    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "L",
       width: 1200,
        margin: 2,
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
    console.log(qrHistoryEntry);

    const objectId = qrHistoryEntry._id;
    const shortId = objectId.toString().slice(-6);

    await qrHistoryEntry.save();

    console.log(`Object ID: ${objectId}`);
    console.log(`Short ID: ${shortId}`);

    return NextResponse.json({
      success: true,
      objectId: shortId,
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
