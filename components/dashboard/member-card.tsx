
"use client";

import Image from "next/image";
import { Download, Printer } from "lucide-react";

type Props = {
  fullName: string;
  studentId: string;
  academicLevel: string;
  role: string;
  qrDataUrl: string;
};

export function MemberCard({
  fullName,
  studentId,
  academicLevel,
  role,
  qrDataUrl,
}: Props) {
  function printCard() {
    window.print();
  }

  return (
    <div className="space-y-5">
      <div className="mx-auto w-full max-w-4xl">
        <div
          id="nova-member-card"
          className="relative aspect-[4/3] w-full overflow-hidden shadow-2xl"
        >
          <Image
            src="/images/nova-member-card.png"
            alt="NOVA member card background"
            fill
            priority
            className="object-fill"
            sizes="(max-width: 768px) 100vw, 896px"
          />

          {/* QR Code */}
          <div
            className="absolute left-1/2 top-[40%] w-[25%] -translate-x-1/2 rounded-[12%] bg-white p-[1.5%] shadow-lg"
          >
            <Image
              src={qrDataUrl}
              alt="Personal attendance QR code"
              width={600}
              height={600}
              unoptimized
              className="h-auto w-full"
            />
          </div>

          {/* Member name */}
          <div className="absolute left-[5%] top-[78%] w-[90%] text-center">
            <p className="truncate text-[clamp(15px,3.5vw,36px)] font-semibold text-white">
              {fullName}
            </p>
          </div>

          {/* Role */}
          <div className="absolute left-[5%] top-[86%] w-[90%] text-center">
            <p className="truncate text-[clamp(13px,2.8vw,30px)] font-medium text-[#EF3030]">
              {role}
            </p>
          </div>

          {/* Student information */}
          <div className="absolute bottom-[1.5%] left-[4%] right-[4%] flex justify-between gap-2 text-[clamp(8px,1.2vw,13px)] font-medium text-white/90">
            <span className="truncate">
              {studentId ? `ID: ${studentId}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={printCard}
          className="inline-flex items-center gap-2 rounded-xl bg-[#263F99] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20347f]"
        >
          <Printer className="h-4 w-4" />
          Print Card
        </button>
      </div>

      <p className="text-center text-sm text-slate-500">
        Keep your QR code safe. It is used to record your attendance.
      </p>

      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }

          body * {
            visibility: hidden !important;
          }

          #nova-member-card,
          #nova-member-card * {
            visibility: visible !important;
          }

          #nova-member-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 75vw !important;
            max-width: none !important;
            box-shadow: none !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
