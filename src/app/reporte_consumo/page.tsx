"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDownUp, CalendarIcon, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabase";

interface FeedingLog {
  id: string;
  fecha: string;
  lago: string;
  alimento: string;
  cantidad: number;
}

export default function ConsumptionReportPage() {
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<FeedingLog[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lakes, setLakes] = useState<string[]>([]);
  const [selectedLake, setSelectedLake] = useState<string>("");

  useEffect(() => {
    fetchFeedingLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [feedingLogs, dateRange, selectedLake]);

  const fetchFeedingLogs = async () => {
    const { data, error } = await supabase
      .from('alimentaciones')
      .select('id, fecha, lago, cantidad, inventario:alimento_id (nombre)');

    if (error) {
      console.error('Error cargando logs:', error.message, error.details);
      toast.error('Fallo cargando historial. Revisa la consola.');
      return;
    }

    const formattedData: FeedingLog[] = data.map((log: any) => ({
      id: log.id,
      fecha: log.fecha,
      lago: log.lago,
      alimento: log.inventario?.nombre || 'Alimento no encontrado',
      cantidad: log.cantidad,
    }));

    setFeedingLogs(formattedData);
    const uniqueLakes = Array.from(new Set(formattedData.map(log => log.lago)));
    setLakes(uniqueLakes);
  };

  const filterLogs = () => {
    let filtered = feedingLogs;

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.fecha);
        return logDate >= dateRange.from! && logDate <= dateRange.to!;
      });
    }

    if (selectedLake) {
      filtered = filtered.filter((log) => log.lago === selectedLake);
    }

    setFilteredLogs(filtered);
  };

  const aggregatedData = Object.values(
    filteredLogs.reduce((acc, log) => {
      const key = `${log.lago}-${log.alimento}`;
      if (!acc[key]) {
        acc[key] = { lago: log.lago, alimento: log.alimento, total: 0, sesiones: 0 };
      }
      acc[key].total += log.cantidad;
      acc[key].sesiones += 1;
      return acc;
    }, {} as Record<string, { lago: string; alimento: string; total: number; sesiones: number }>))
    .sort((a, b) => (sortOrder === 'asc' ? a.total - b.total : b.total - a.total));

  const handleExportExcel = () => {
    const exportData = aggregatedData.map((log) => ({
      Lago: log.lago,
      Alimento: log.alimento,
      'Total Consumido (Kg)': log.total,
      Sesiones: log.sesiones,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "reporte_consumo.xlsx");
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reporte de Consumo</h1>
        <Button onClick={handleExportExcel} className="w-fit flex gap-2">
          <FileDown className="w-4 h-4" />
          Exportar a Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="w-4 h-4" />
                {dateRange?.from ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${dateRange?.to ? format(dateRange.to, 'dd/MM/yyyy') : '...'}` : 'Seleccionar Rango'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>

          <Select onValueChange={(value) => setSelectedLake(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por Lago" />
            </SelectTrigger>
            <SelectContent>
              {lakes.map((lake, index) => (
                <SelectItem key={index} value={lake}>
                  {lake}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            Ordenar {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'} <ArrowDownUp className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumo por Lago</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="py-2 px-4">Lago</th>
                <th className="py-2 px-4">Alimento</th>
                <th className="py-2 px-4">Total Consumido (Kg)</th>
                <th className="py-2 px-4">Sesiones</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.lago}</td>
                  <td className="py-2 px-4">{item.alimento}</td>
                  <td className="py-2 px-4 font-bold">{item.total}</td>
                  <td className="py-2 px-4">{item.sesiones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
