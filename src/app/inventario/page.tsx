// src/app/inventario/page.tsx

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventarioItem {
  id: number;
  nombre: string;
  tamaño: number;
  cantidad: number;
  marca: string;
  vencimiento: string;
  lote: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventarioItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    tamaño: "",
    cantidad: "",
    marca: "",
    vencimiento: "",
    lote: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // 🔄 Cargar inventario
  const fetchInventory = async () => {
    const { data, error } = await supabase.from('inventario').select('*');
    if (error) {
      console.error("Error al cargar inventario", error);
      toast.error("Error al cargar inventario.");
    } else {
      setInventory(data as InventarioItem[]);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🎯 Insertar nuevo producto
  const handleAddItem = async () => {
    if (!formData.nombre || !formData.tamaño || !formData.cantidad) {
      toast.error("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const { error } = await supabase.from('inventario').insert([
      {
        nombre: formData.nombre,
        tamaño: parseFloat(formData.tamaño),
        cantidad: parseFloat(formData.cantidad),
        marca: formData.marca,
        vencimiento: formData.vencimiento,
        lote: formData.lote,
      }
    ]);

    if (error) {
      console.error("Error al agregar producto", error);
      toast.error("Error al agregar producto.");
    } else {
      toast.success("Producto agregado exitosamente.");
      setFormData({ nombre: "", tamaño: "", cantidad: "", marca: "", vencimiento: "", lote: "" });
      setIsDialogOpen(false);
      fetchInventory();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔍 Filtrado y ordenamiento
  const filteredInventory = inventory
    .filter((item) => item.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === "asc" ? a.cantidad - b.cantidad : b.cantidad - a.cantidad);

  return (
    <div className="space-y-6 w-full max-w-7xl min-h-full mx-auto">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          + Agregar Producto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ordenar por cantidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Menor a mayor</SelectItem>
            <SelectItem value="desc">Mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto overflow-y-auto max-h-[500px]">
        <table className="w-full text-left border-collapse ">
          <thead className="bg-gray-100 sticky top-[-20px] z-10">
            <tr className="border-b">
              <th className="py-2 px-4">Tipo de Alimento</th>
              <th className="py-2 px-4">Tamaño Pellet (mm)</th>
              <th className="py-2 px-4">Cantidad (kg)</th>
              <th className="py-2 px-4">Marca</th>
              <th className="py-2 px-4">Fecha de Vencimiento</th>
              <th className="py-2 px-4">Lote</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.nombre}</td>
                <td className="py-2 px-4">{item.tamaño}</td>
                <td className="py-2 px-4 font-bold">{item.cantidad}</td>
                <td className="py-2 px-4">{item.marca}</td>
                <td className="py-2 px-4">{item.vencimiento}</td>
                <td className="py-2 px-4">{item.lote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Producto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
            <DialogDescription>Ingrese la información del nuevo alimento.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            <Input placeholder="Tamaño Pellet (mm)" name="tamaño" value={formData.tamaño} onChange={handleInputChange} />
            <Input placeholder="Cantidad (kg)" name="cantidad" value={formData.cantidad} onChange={handleInputChange} />
            <Input placeholder="Marca" name="marca" value={formData.marca} onChange={handleInputChange} />
            <Input placeholder="Fecha de Vencimiento" name="vencimiento" value={formData.vencimiento} onChange={handleInputChange} />
            <Input placeholder="Lote" name="lote" value={formData.lote} onChange={handleInputChange} />
            <Button className="w-full" onClick={handleAddItem}>Agregar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
