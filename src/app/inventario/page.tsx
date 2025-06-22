"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([
    { nombre: "Pellets Premium", tamaño: 3.2, cantidad: 157, marca: "AquaFeed Pro", vencimiento: "2024-08-15", lote: "PF2024001" },
    { nombre: "Fórmula de Crecimiento", tamaño: 4.5, cantidad: 88, marca: "FishGrow", vencimiento: "2024-09-22", lote: "GF2024002" },
    { nombre: "Realzador de Color", tamaño: 2.8, cantidad: 42, marca: "VitaFish", vencimiento: "2024-07-30", lote: "CE2024003" },
    { nombre: "Alto en Proteína", tamaño: 5, cantidad: 115, marca: "NutriAqua", vencimiento: "2024-10-05", lote: "PR2024004" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    tamaño: "",
    cantidad: "",
    marca: "",
    vencimiento: "",
    lote: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = () => {
    // Validación simple
    if (!formData.nombre || !formData.tamaño || !formData.cantidad) {
      toast.error("Por favor, complete todos los campos obligatorios.");
      return;
    }

    setInventory([...inventory, { ...formData, tamaño: parseFloat(formData.tamaño), cantidad: parseFloat(formData.cantidad) }]);
    setFormData({ nombre: "", tamaño: "", cantidad: "", marca: "", vencimiento: "", lote: "" });
    setIsDialogOpen(false);
    toast.success("Producto agregado exitosamente.");
  };

  return (
    <div className="space-y-6 w-full max-w-7xl min-h-full mx-auto">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          + Agregar Producto
        </Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
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
            {inventory.map((item, index) => (
              <tr key={index} className="border-b">
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
