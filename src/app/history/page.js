"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function History() {
  const [qrHistory, setQrHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await axios.get("./api/history");
      setQrHistory(response.data.history);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-white px-6 py-5">
        <Link
          href="/"
          className="
    flex justify-center items-center
    mt-3 mb-4 mx-auto
    w-fit
    px-6 py-3
    rounded-xl
    bg-gradient-to-r from-blue-600 to-cyan-500
    text-white font-semibold text-sm
    shadow-lg shadow-blue-500/20
    hover:scale-105
    hover:shadow-blue-500/50
    hover:from-cyan-500
    hover:to-blue-600
    transition-all duration-300
  "
        >
          Go Back to Generate QR
        </Link>

        {/* Heading */}
        <div className="max-w-6xl mx-auto mb-10">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            QR Code Generation History
          </h1>

          <p className="text-center text-gray-400 mt-3 text-sm">
            View all generated QR records with sensor details
          </p>
        </div>

        {/* Empty State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">
                Loading History...
              </span>
            </div>
          </div>
        ) : qrHistory.length === 0 ? (
          <div className="flex justify-center items-center">
            <div className="bg-[#0f172a] border border-blue-500/20 rounded-2xl px-10 py-8 shadow-2xl">
              <p className="text-gray-300 text-lg">No history available.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {qrHistory.map((entry) => (
              <div
                key={entry._id}
                className="bg-gradient-to-br from-[#0f172a] to-[#111827]
              border border-blue-500/20
              rounded-3xl
              p-6
              shadow-lg
              hover:shadow-blue-500/30
              hover:scale-[1.02]
              transition-all duration-300"
              >
                {/* Card Top */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold text-blue-400">
                    {entry.name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      entry.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Sensor ID</span>
                    <span className="text-white font-medium">
                      {entry.sensorId}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white font-medium">
                      {entry.sensorType}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">IP Address</span>
                    <span className="text-white font-medium break-all text-right">
                      {entry.ipAddress}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Battery</span>
                    <span className="text-blue-300 font-semibold">
                      {entry.battery}
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-400 mb-1">RTSP URL</p>

                    <div className="bg-black/40 border border-blue-500/10 rounded-xl p-3 text-xs text-blue-200 break-all">
                      {entry.rtspUrl}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-blue-500/10 mt-6 pt-4">
                  <p className="text-xs text-gray-500">Generated At</p>

                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
