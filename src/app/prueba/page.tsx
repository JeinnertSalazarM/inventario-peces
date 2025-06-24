// src/app/prueba/page.tsx

"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PruebaConexion() {
  useEffect(() => {
    const fetchInventario = async () => {
      const { data, error } = await supabase.from("inventario").select("*");
      if (error) {
        console.error("Error de conexión:", error.message);
      } else {
        console.log("Conexión exitosa ✅", data);
      }
    };

    fetchInventario();
  }, []);

  return <div className="text-xl p-8">Revisa la consola 🔍</div>;
}
