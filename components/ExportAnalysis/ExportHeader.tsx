"use client";

interface ExportHeaderProps {
  station: string;
  data: { nama: string; nim: string; instansi: string };
}

export function ExportHeader({ station, data }: ExportHeaderProps) {
  const now = new Date();

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now).replace(":", ".");

  const tzParts = new Intl.DateTimeFormat("id-ID", { timeZoneName: "short" }).formatToParts(now);
  const timeZoneName = tzParts.find((part) => part.type === "timeZoneName")?.value || "";

  const thin = { border: 0, borderTop: "1px solid #000000", margin: "2px 0 0 0" } as const;
  const thick = { border: 0, borderTop: "2.5px solid #000000", margin: 0 } as const;

  return (
    <div style={{ padding: "20px 32px 6px 32px", marginBottom: 4, backgroundColor: "#ffffff" }}>
      {/* ── Kop Surat ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img
          src="/logo-unsoed.png"
          alt="Logo Universitas Jenderal Soedirman"
          style={{ width: 105, height: 105, flexShrink: 0, objectFit: "contain" }}
        />
        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: 1.2, color: "#111111", fontFamily: "sans-serif", fontWeight: 600 }}>
            KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
          </p>
          <h1 style={{ margin: "4px 0 0 0", fontSize: 22, fontWeight: 800, letterSpacing: 1.6, color: "#000000", fontFamily: "sans-serif" }}>
            UNIVERSITAS JENDERAL SOEDIRMAN
          </h1>
          <h2 style={{ margin: "3px 0 0 0", fontSize: 15, fontWeight: 700, letterSpacing: 0.8, color: "#111111", fontFamily: "sans-serif" }}>
            FAKULTAS PERIKANAN DAN ILMU KELAUTAN
          </h2>
          <p style={{ margin: "8px 0 0 0", fontSize: 10.5, color: "#333333", fontFamily: "sans-serif" }}>
            Jl. Dr Soeparno, Komplek GOR Soesilo Soedarman, Karangwangkal, Purwokerto 53122
          </p>
          <p style={{ margin: "2px 0 0 0", fontSize: 10.5, color: "#333333", fontFamily: "sans-serif" }}>
            Telp. (0281) 6596700 &nbsp;|&nbsp; Email: fpik@unsoed.ac.id &nbsp;|&nbsp; Website: fpik.unsoed.ac.id
          </p>
        </div>
      </div>

      {/* ── Garis ganda kop surat ── */}
      <div style={{ marginTop: 12 }}>
        <hr style={thick} />
        <hr style={thin} />
      </div>

      {/* ── Judul Laporan + Info ── */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#000000", fontFamily: "sans-serif" }}>
          LAPORAN DATA CUACA — AWS {station.toUpperCase()}
        </h2>
        <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "#333333", fontFamily: "sans-serif" }}>
          Diekspor pada {dateStr} pukul {timeStr} {timeZoneName}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 13, marginTop: 10, fontFamily: "sans-serif" }}>
          <span><span style={{ color: "#444444" }}>Nama:</span> <strong style={{ color: "#000000" }}>{data.nama}</strong></span>
          <span><span style={{ color: "#444444" }}>NIM:</span> <strong style={{ color: "#000000" }}>{data.nim}</strong></span>
          <span><span style={{ color: "#444444" }}>Instansi:</span> <strong style={{ color: "#000000" }}>{data.instansi}</strong></span>
        </div>
      </div>
    </div>
  );
}
