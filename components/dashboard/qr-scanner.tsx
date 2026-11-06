
"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, CheckCircle2, XCircle, ScanLine } from "lucide-react";
import { scanMemberQr } from "@/app/dashboard/scan/actions";

type Session = {
  id: string;
  title: string;
  starts_at: string;
};

type ScanResult = {
  success: boolean;
  message: string;
};

export function QrScanner({ sessions }: { sessions: Session[] }) {
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState("");

  const scannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => void;
    pause: (pauseVideo?: boolean) => void;
    resume: () => void;
  } | null>(null);

  const processingRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const scanner = scannerRef.current;

      if (scanner) {
        scanner.stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, []);

  async function startScanner() {
    if (!sessionId || scannerRef.current) return;

    setCameraError("");
    setResult(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (!mountedRef.current) return;

      const scanner = new Html5Qrcode("nova-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (processingRef.current) return;

          processingRef.current = true;
          setIsProcessing(true);
          setResult(null);

          try {
            scanner.pause(true);

            const response = await scanMemberQr(sessionId, decodedText);

            if (mountedRef.current) {
              setResult({
                success: response.success,
                message: response.message,
              });
            }
          } catch {
            if (mountedRef.current) {
              setResult({
                success: false,
                message: "An unexpected error occurred. Please try again.",
              });
            }
          } finally {
            if (mountedRef.current) {
              setIsProcessing(false);

              window.setTimeout(() => {
                processingRef.current = false;

                try {
                  scanner.resume();
                } catch {
                  // Scanner may have been stopped.
                }
              }, 1800);
            }
          }
        },
        () => {
          // No QR detected in this frame. Keep scanning.
        }
      );

      if (mountedRef.current) {
        setIsScanning(true);
      }
    } catch (error) {
      scannerRef.current = null;

      if (mountedRef.current) {
        setIsScanning(false);
        setCameraError(
          error instanceof Error
            ? error.message
            : "Could not access the camera. Check browser permissions."
        );
      }
    }
  }

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner) return;

    scannerRef.current = null;
    processingRef.current = false;

    try {
      await scanner.stop();
      scanner.clear();
    } catch {
      // Camera may already be stopped.
    }

    setIsScanning(false);
    setIsProcessing(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">Camera Scanner</h2>
            <p className="mt-1 text-sm text-slate-500">
              Scan a member's NOVA card QR code.
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isScanning
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isScanning ? "Camera active" : "Camera stopped"}
          </span>
        </div>

        <div className="bg-slate-950 p-3 sm:p-5">
          <div
            id="nova-qr-reader"
            className="mx-auto min-h-[300px] w-full max-w-[520px] overflow-hidden rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          {!isScanning ? (
            <button
              type="button"
              onClick={startScanner}
              disabled={!sessionId || isProcessing}
              className="inline-flex items-center gap-2 rounded-xl bg-[#263F99] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20347f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              Start camera
            </button>
          ) : (
            <button
              type="button"
              onClick={stopScanner}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <CameraOff className="h-4 w-4" />
              Stop camera
            </button>
          )}
        </div>

        {cameraError && (
          <div className="mx-5 mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {cameraError}
          </div>
        )}
      </section>

      <aside className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Active session
          </label>

          <select
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            disabled={isScanning || isProcessing}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#263F99]"
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title}
              </option>
            ))}
          </select>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Only ongoing sessions are available for QR check-in.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Scan result</h3>

          <div className="mt-4">
            {isProcessing ? (
              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                Checking QR and recording attendance...
              </div>
            ) : result ? (
              <div
                className={`flex items-start gap-3 rounded-xl p-4 ${
                  result.success
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                )}
                <p className="text-sm font-medium">{result.message}</p>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-5 text-center">
                <ScanLine className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">
                  Waiting for a QR code...
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <strong>Note:</strong> Each member can check in only once per
          session. Duplicate scans will be rejected automatically.
        </div>
      </aside>
    </div>
  );
}
