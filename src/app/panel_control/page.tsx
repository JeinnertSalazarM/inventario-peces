"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [mostUsedFood, setMostUsedFood] = useState<string>("Cargando...");
  const [mostUsedFoodAmount, setMostUsedFoodAmount] = useState<number>(0);
  const [todayFeedings, setTodayFeedings] = useState(0);

  useEffect(() => {
    fetchInventory();
    fetchMostUsedFood();
    fetchTodayFeedings();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase.from("inventario").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setInventory(data);
    const total = data.reduce((acc, item) => acc + item.cantidad, 0);
    setTotalWeight(total);

    const low = data.filter((item) => item.cantidad < 50);
    setLowStock(low);
  };

  type Alimentacion = {
    alimento_id: number;
    cantidad: number;
    inventario: { nombre: string }[] | { nombre: string } | null;
  };

  const fetchMostUsedFood = async () => {
    const { data, error } = await supabase
      .from("alimentaciones")
      .select("alimento_id, cantidad, inventario (nombre)")
      .order("alimento_id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    const summary: Record<string, { nombre: string; total: number }> = {};

    (data as Alimentacion[]).forEach((item) => {
      const id = item.alimento_id;
      let nombre = "";
      if (Array.isArray(item.inventario)) {
        nombre = item.inventario[0]?.nombre ?? "";
      } else if (item.inventario && typeof item.inventario === "object") {
        nombre = item.inventario.nombre;
      }
      if (!summary[id]) {
        summary[id] = { nombre, total: 0 };
      }
      summary[id].total += item.cantidad;
    });

    const mostUsed = Object.values(summary).sort((a, b) => b.total - a.total)[0];

    if (mostUsed) {
      setMostUsedFood(mostUsed.nombre);
      setMostUsedFoodAmount(mostUsed.total);
    }
  };

  const fetchTodayFeedings = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("alimentaciones")
      .select("*")
      .eq("fecha", today);

    if (error) {
      console.error(error);
      return;
    }

    setTodayFeedings(data.length);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl min-h-full mx-auto">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalWeight} Kg</div>
            <div className="text-muted-foreground">Cantidad total disponible</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{lowStock.length}</div>
            <div className="text-muted-foreground">Productos necesitan reposición</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alimento Más Consumido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600 font-bold">{mostUsedFood}</div>
            <div className="text-muted-foreground">{mostUsedFoodAmount} Kg consumidos</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alimentaciones de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{todayFeedings}</div>
            <div className="text-muted-foreground">Sesiones registradas</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg p-4 shadow-md overflow-y-auto max-h-[450px]">
        <div className="sticky top-[-20px] bg-white z-10">
          <h2 className="text-xl font-bold mb-2">Inventario en tiempo real</h2>
          <p className="text-muted-foreground ">Cantidad actual en almacenamiento</p>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="sticky bg-gray-200  z-10 top-[40px]">
            <tr className="border-b">
              <th className="py-2">Nombre</th>
              <th className="py-2">Tamaño de pellet (mm)</th>
              <th className="py-2">Cantidad (Kg)</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.nombre}</td>
                <td>{item.tamaño}</td>
                <td className="font-bold">{item.cantidad}</td>
                <td>
                  {item.cantidad < 40 ? (
                    <Badge variant="destructive">Bajo Stock</Badge>
                  ) : (
                    <Badge variant="default">Disponible</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
