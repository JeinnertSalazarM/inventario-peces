// app/panel/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  return (
    <div className="space-y-6 w-full max-w-7xl min-h-full mx-auto  ">
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle >Total Inventory
                
            </CardTitle>
            
            
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">400</div>
            <div className="text-muted-foreground">kg available</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1</div>
            <div className="text-muted-foreground">items need restocking</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Used Food</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600 font-bold">Protein Rich</div>
            <div className="text-muted-foreground">30kg used</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Feedings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
            <div className="text-muted-foreground">feeding sessions</div>
          </CardContent>
        </Card>
      </div>

        {/* Table */}
        <div className="bg-white rounded-lg p-4 shadow-md overflow-y-auto  max-h-[450px]">

          <div className="sticky top-0 bg-white z-10  ">
            <h2 className="text-xl font-bold mb-2">Inventario en tiempo real</h2>
            <p className="text-muted-foreground mb-5">Cantidad en almacenamiento</p>
            </div>
            <table className="w-full text-left border-collapse">
            <thead className="sticky  bg-white z-10  top-[55px]">
                <tr className="border-b">
                <th className="py-2">Nombre</th>
                <th className="py-2">Tamaño de pellet (mm)</th>
                <th className="py-2">Cantidad (kg)</th>
                <th className="py-2">Estado</th>
                
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                <td className="py-2">Premium Pellets</td>
                <td>3.2</td>
                <td className="font-bold">158</td>
                <td><Badge variant="default">In Stock</Badge></td>
                </tr>
                <tr className="border-b">
                <td className="py-2">Growth Formula</td>
                <td>4.5</td>
                <td className="font-bold">88</td>
                <td><Badge variant="default">In Stock</Badge></td>
                </tr>
                <tr className="border-b">
                <td className="py-2">Color Enhancer</td>
                <td>2.8</td>
                <td className="font-bold">43</td>
                <td><Badge variant="destructive">Low Stock</Badge></td>
                </tr>
                
            </tbody>
            </table>
        </div>
        </div>
  )
}
