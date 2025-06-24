"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface InventoryItem {
  id: string;
  nombre: string;
  cantidad: number;
}

interface FeedingLog {
  id: string;
  fecha: string;
  lago: string;
  alimento_id: string;
  alimento_nombre: string;
  cantidad: number;
}

export default function FeedingLogsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [formData, setFormData] = useState({ lago: "", alimento_id: "", cantidad: "" });

  // ✅ Cargar datos
  const fetchInventory = async () => {
    const { data } = await supabase.from("inventario").select("id, nombre, cantidad");
    if (data) setInventory(data);
  };

  const fetchFeedingLogs = async () => {
    const { data, error } = await supabase
      .from("alimentaciones")
      .select("id, fecha, lago, cantidad, inventario:alimento_id (id, nombre)")
      .order("fecha", { ascending: false });

    if (error) console.error(error);

    if (data) {
      const formattedLogs = data.map((log: any) => ({
        id: log.id,
        fecha: log.fecha,
        lago: log.lago,
        alimento_id: log.inventario.id,
        alimento_nombre: log.inventario.nombre,
        cantidad: log.cantidad,
      }));
      setFeedingLogs(formattedLogs);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchFeedingLogs();
  }, []);

  // ✅ Registrar alimentación
  const handleRegisterFeeding = async () => {
    if (!formData.lago || !formData.alimento_id || !formData.cantidad) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    const cantidad = parseFloat(formData.cantidad);
    const selectedItem = inventory.find(item => item.id === formData.alimento_id);

    if (!selectedItem || selectedItem.cantidad < cantidad) {
      toast.error("No hay suficiente cantidad disponible.");
      return;
    }

    // Insertar alimentación
    const { error: insertError } = await supabase.from("alimentaciones").insert([
      {
        lago: formData.lago,
        alimento_id: formData.alimento_id,
        cantidad,
      },
    ]);

    if (insertError) {
      toast.error("Error al registrar la alimentación.");
      return;
    }

    toast.success("Alimentación registrada exitosamente.");

    // ✅ Resetear formulario y recargar datos
    setFormData({ lago: "", alimento_id: "", cantidad: "" });
    fetchInventory();
    fetchFeedingLogs();
  };

  return (
    <div className="flex h-screen w-full gap-8 p-8">
      {/* Formulario */}
      <Card className="w-1/3 h-fit">
        <CardHeader>
          <CardTitle>Registrar Alimentación</CardTitle>
          <span className="text-sm text-muted-foreground">Registra una sesión de alimentación nueva.</span>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Select Lago controlado */}
          <Select value={formData.lago} onValueChange={(value) => setFormData({ ...formData, lago: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione el lago" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i + 1} value={`Lago ${i + 1}`}>{`Lago ${i + 1}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select Alimento controlado */}
          <Select value={formData.alimento_id} onValueChange={(value) => setFormData({ ...formData, alimento_id: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione el alimento" />
            </SelectTrigger>
            <SelectContent>
              {inventory.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nombre} ({item.cantidad} kg disponibles)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Cantidad (kg)"
            name="cantidad"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
          />

          <Button className="w-full" onClick={handleRegisterFeeding}>
            Registrar Alimentación
          </Button>
        </CardContent>
      </Card>

      {/* Historial */}
      <Card className="flex-1 h-fit">
        <CardHeader>
          <CardTitle>Historial de Alimentación</CardTitle>
          <span className="text-sm text-muted-foreground">Actividad reciente de alimentación</span>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Lago</th>
                <th className="py-2 px-4">Tipo de Alimento</th>
                <th className="py-2 px-4">Cantidad (kg)</th>
              </tr>
            </thead>
            <tbody>
              {feedingLogs.map((log, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{log.fecha}</td>
                  <td className="py-2 px-4">{log.lago}</td>
                  <td className="py-2 px-4">{log.alimento_nombre}</td>
                  <td className="py-2 px-4 font-bold">{log.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
