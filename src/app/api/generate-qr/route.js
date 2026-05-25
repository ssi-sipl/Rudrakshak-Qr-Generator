import { NextResponse } from "next/server";
import QRCode from "qrcode";
import QRHistory from "@/models/qrhistory.js";
import connectDB from "@/config/database";
import { createCanvas, loadImage ,registerFont } from "canvas";
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { sensorId, name, sensorType, ipAddress, rtspUrl, battery, status } =
      body;

    const qrData = JSON.stringify({
      sensorId,
      name,
      sensorType,
      ipAddress,
      rtspUrl,
      battery,
      status,
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
    await qrHistoryEntry.save();

    registerFont("./fonts/NotoSans-Regular.ttf", {
  family: "Noto Sans",
    }); 

    const canvas = createCanvas(500, 600);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const qrImg = await loadImage(qrImage);
    ctx.drawImage(qrImg, 30, 30, 440, 440);
    ctx.fillStyle = "black";
    ctx.font = "20px 'Noto Sans'";
    console.log(objectId);
    ctx.fillText(`ID: ${objectId}`, 100, 500);
    const finalQrImage = canvas.toDataURL();

    return NextResponse.json({
      success: true,
      objectId,
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
