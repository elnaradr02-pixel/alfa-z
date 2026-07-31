import { ImageResponse } from "next/og";

export const alt = "Alfa Z — Школа программирования для подростков 12–17 лет";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F0F1A",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Логотип */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#FF6B47",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "38px",
              fontWeight: 800,
            }}
          >
            aZ
          </div>
          <div style={{ display: "flex", fontSize: "40px", fontWeight: 800, color: "#FFFBF5" }}>
            <span>alfa&nbsp;</span>
            <span style={{ color: "#FF6B47" }}>Z</span>
          </div>
        </div>

        {/* Заголовок */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "68px", fontWeight: 800, color: "#FFFBF5", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Школа программирования
          </div>
          <div style={{ fontSize: "68px", fontWeight: 800, color: "#FF6B47", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            для подростков 12–17 лет
          </div>
        </div>

        {/* Подвал с направлениями */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {["CS50", "Flutter", "Unity", "React", "Python"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: "26px",
                color: "#FFB088",
                background: "rgba(255,107,71,0.12)",
                border: "1px solid rgba(255,107,71,0.35)",
                borderRadius: "999px",
                padding: "8px 22px",
                display: "flex",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
