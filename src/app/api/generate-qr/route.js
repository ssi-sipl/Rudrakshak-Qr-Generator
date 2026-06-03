import { NextResponse } from "next/server";
import QRCode from "qrcode";
import QRHistory from "@/models/qrhistory.js";
import connectDB from "@/config/database";
import { createCanvas, loadImage } from "canvas";
import { encryptData } from "@/utils/crypto";
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { sensorId, name, sensorType, ipAddress, rtspUrl, battery, status , activeShuruMode } =
      body;

    const qrData = encryptData({
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
      activeShuruMode
    });
    console.log(qrData + "qr data in route.js");
    const qrImage = await QRCode.toDataURL(qrData);

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

const canvas = createCanvas(500, 600);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const qrImg = await loadImage(qrImage);
ctx.drawImage(qrImg, 30, 30, 440, 440);

ctx.fillStyle = "black";
ctx.font = "12px Arial";

console.log(`Object ID: ${objectId}`);
console.log(`Short ID: ${shortId}`);

ctx.fillText(`ID: ${shortId}`, 120, 490);

const finalQrImage = canvas.toDataURL();
    return NextResponse.json({
      success: true,
      objectId: shortId,
      finalQrImage,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);

    return NextResponse.json({
      success: false,
      message: "QR generation failed",
    });
  }
}
