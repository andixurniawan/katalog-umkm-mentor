"use client";

import { useEffect } from "react";
import { simpanDilihat } from "@/lib/terakhir-dilihat";

// Tidak menampilkan apa pun; mencatat produk yang sedang dibuka ke localStorage.
export default function CatatDilihat({ produk }) {
  useEffect(() => {
    simpanDilihat(produk);
  }, [produk]);

  return null;
}
