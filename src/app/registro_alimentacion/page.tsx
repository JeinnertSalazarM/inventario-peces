"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";

export default function FeedingLogsPage() {
  const [feedingLogs, setFeedingLogs] = useState([
    { fecha: "2025-06-19", lago: "Lago 1", alimento: "Pellets Premium", cantidad: 12 },
    { fecha: "2024-06-19", lago: "Lago 2", alimento: "Pellets Premium", cantidad: 25 },
    { fecha: "2024-06-19", lago: "Lago 1", alimento: "Fórmula de Crecimiento", cantidad: 15 },
    { fecha: "2024-06-18", lago: "Lago 2", alimento: "Realzador de Color", cantidad: 10 },
    { fecha: "2024-06-18", lago: "Lago 3", alimento: "Alto en Proteína", cantidad: 30 },
  ]);

  const [formData, setFormData] = useState({
    lago: "",
    alimento: "",
    cantidad: "",
  });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const alimentos = [
    "Pellets Premium",
    "Fórmula de Crecimiento",
    "Realzador de Color",
    "Alto en Proteína",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterFeeding = () => {
    if (!formData.lago || !formData.alimento || !formData.cantidad) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    const newLog = {
      fecha: new Date().toISOString().split("T")[0],
      lago: formData.lago,
      alimento: formData.alimento,
      cantidad: parseFloat(formData.cantidad),
    };

    setFeedingLogs([newLog, ...feedingLogs]);
    setFormData({ lago: "", alimento: "", cantidad: "" });
    toast.success("Alimentación registrada exitosamente.");
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedLogs = [...feedingLogs];
      updatedLogs.splice(deleteIndex, 1);
      setFeedingLogs(updatedLogs);
      setDeleteIndex(null);
      toast.success("Registro eliminado.");
    }
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
          <Select onValueChange={(value) => setFormData({ ...formData, lago: value })}>
            <SelectTrigger className="w-full">
              <SelectValue  placeholder="Seleccione el lago" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i + 1} value={`Lago ${i + 1}`}>{`Lago ${i + 1}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setFormData({ ...formData, alimento: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione el alimento" />
            </SelectTrigger>
            <SelectContent>
              {alimentos.map((alimento, index) => (
                <SelectItem key={index} value={alimento}>{alimento}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Cantidad (kg)"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
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
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {feedingLogs.map((log, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{log.fecha}</td>
                  <td className="py-2 px-4">{log.lago}</td>
                  <td className="py-2 px-4">{log.alimento}</td>
                  <td className="py-2 px-4 font-bold">{log.cantidad}</td>
                  <td className="py-2 px-4">
                    <Button variant="ghost" size="icon" onClick={() => setDeleteIndex(index)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Dialog de Confirmación */}
      <Dialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>¿Está seguro de eliminar este registro?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
