"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function QRcodegeneration() {
  const [qrImage, setQrImage] = useState("");
  const [generated, setGenerated] = useState(false);
  const [qrHistory, setQrHistory] = useState([]);
  const [qrId, setQrId] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    sensorId: "",
    name: "",
    sensorType: "",
    ipAddress: "",
    rtspUrl: "",
    battery: "",
    status: "",
    activeShuruMode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateQR();
  };

 const composeQrWithLabel = async (qrSrc, label) => {
  const canvas = document.createElement("canvas");

  canvas.width = 1500;
  canvas.height = 1700; // Increased height

  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = qrSrc;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  // White background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // QR code (centered)
  const qrSize = 1400;
  const qrX = (canvas.width - qrSize) / 2;

  ctx.drawImage(image, qrX, 0, qrSize, qrSize);

  // ID below QR
  ctx.fillStyle = "#000";
  ctx.font = "bold 70px Arial";
  ctx.textAlign = "center";

  // Position text below QR with spacing
  ctx.fillText(`ID: ${label}`, canvas.width / 2, 1550);

  return canvas.toDataURL("image/png");
};

  const generateQR = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/generate-qr", {
        sensorId: formData.sensorId,
        name: formData.name,
        sensorType: formData.sensorType,
        ipAddress: formData.ipAddress,
        rtspUrl: formData.rtspUrl,
        battery: formData.battery,
        status: formData.status,
        activeShuruMode: formData.activeShuruMode,
      });

      const id = formData.sensorId
      const image = await composeQrWithLabel(response.data.qrImage, id);

      setQrImage(image);
      setQrId(id);

      const link = document.createElement("a");
      link.href = image;
      link.download = `QR-${id}.png`;
      link.click();

      setGenerated(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/api/history");
      setQrHistory(response.data.history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      await fetchHistory();
    };

    loadHistory();
  }, []);

  const updateHistory = async (data) => {
    try {
      await axios.post("/api/history", data);
      await fetchHistory();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 text-blue-400">
              Create QR Code
            </h1>

            <p className="text-slate-300">
              Enter the sensor details and generate the QR code.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">
                Sensor ID
              </span>

              <input
                type="text"
                name="sensorId"
                placeholder="SEN-2048"
                value={formData.sensorId}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">
                Sensor Name
              </span>

              <input
                type="text"
                name="name"
                placeholder="Main Entrance Camera"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">
                Sensor Type
              </span>

              <input
                type="text"
                name="sensorType"
                placeholder="Camera / Motion / Thermal"
                value={formData.sensorType}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">
                IP Address (optional)
              </span>

              <input
                type="text"
                name="ipAddress"
                placeholder="192.168.1.20"
                value={formData.ipAddress}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-300">
                RTSP URL (optional)
              </span>

              <input
                type="text"
                name="rtspUrl"
                placeholder="rtsp://username:password@camera/live"
                value={formData.rtspUrl}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">
                Battery Status (optional)
              </span>

              <input
                type="text"
                name="battery"
                placeholder="86"
                value={formData.battery}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">Status</span>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select Status</option>

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">
                Active Shuru Mode
              </span>
              <select
                name="activeShuruMode"
                value={formData.activeShuruMode}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select Status</option>

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`md:col-span-2 rounded-xl py-4 font-semibold text-lg shadow-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Generating QR..." : "Generate QR Code"}
            </button>
          </form>
        </div>

        {generated && (
          <div className="mt-10 bg-slate-900/70 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-bold text-blue-400 mb-6">
              Generated QR Code
            </h3>

            <div className="bg-white inline-block p-6 rounded-2xl">
              <img
                src={qrImage}
                alt="Generated QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>

            <h1>QR Code ID: {qrId}</h1>
          </div>
        )}

        <div className="text-center mt-8">
          <div className="text-center mt-8">
            <Link
              href="/history"
              className="
      group relative overflow-hidden
      inline-flex items-center justify-center
      px-8 py-4
      rounded-2xl
      bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400
      text-white font-semibold tracking-wide
      shadow-lg shadow-blue-500/30
      transition-all duration-300
      hover:scale-110
      hover:rotate-1
      hover:shadow-blue-500/60
      active:scale-95
    "
            >
              {/* Animated Glow */}
              <span
                className="
        absolute inset-0
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_60%)]
        opacity-0
        group-hover:opacity-100
        transition duration-500
      "
              ></span>

              {/* Shine Animation */}
              <span
                className="
        absolute top-0 left-[-100%]
        w-full h-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        group-hover:left-[100%]
        transition-all duration-1000
      "
              ></span>

              {/* Pulsing Border */}
              <span
                className="
        absolute inset-0 rounded-2xl
        border border-cyan-300/40
        group-hover:animate-pulse
      "
              ></span>

              {/* Text */}
              <span className="relative z-10 flex items-center gap-2">
                🚀 View QR Code Generation History
              </span>
            </Link>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-700">
            <div className="h-16 w-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              Generating QR Code...
            </h2>

            <p className="mt-2 text-slate-400">
              Please wait while we process your request.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
