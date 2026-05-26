"use client";
import { useEffect, useState } from "react";

const DURATION_HOURS = 48;
const COOKIE_NAME = "kagan_sale_end";

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function getEndTime(): number {
  if (typeof window === "undefined") return Date.now() + DURATION_HOURS * 3600 * 1000;
  
  const stored = getCookie(COOKIE_NAME);
  if (stored) {
    const t = parseInt(stored, 10);
    if (t > Date.now()) return t;
  }
  
  const end = Date.now() + DURATION_HOURS * 3600 * 1000;
  setCookie(COOKIE_NAME, String(end), DURATION_HOURS / 24);
  return end;
}

export default function CountdownTimer({ style }: { style?: React.CSSProperties }) {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const endTime = getEndTime();
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
    </span>
  );
}
