// src/components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { SeparatorVerticalIcon } from "lucide-react";

function getSectionTitle(pathname: string) {
  const sectionTitles: Record<string, string> = {
    "/": "Panel de Control",
    "/inventario": "Inventario",
    "/registro_alimentacion": "Registro de Alimentación",
    "/reporte_consumo": "Reporte de Consumo de Alimento",
  };
  return sectionTitles[pathname] || "Panel de Control";
}

export default function Header() {
  const pathname = usePathname();
  const activeSection = getSectionTitle(pathname);

  return (
  <header className="flex items-center justify-start mb-4">
    <SidebarTrigger className="w-12 h-12 p-2 border rounded-lg hover:bg-gray-100" />
    <SeparatorVerticalIcon className="mx-4 h-8" />
    <h1 className="text-3xl font-bold">{activeSection}</h1>
  </header>
);

}
