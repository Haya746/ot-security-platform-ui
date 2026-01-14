"use client"

import { useState } from "react"
import {
  Server,
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  AlertTriangle,
  Wifi,
  WifiOff,
  MapPin,
  Cpu,
  Network,
  Activity,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { assets } from "@/lib/data"
import { cn } from "@/lib/utils"

const criticalityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/10 text-green-500 border-green-500/20",
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-green-500", text: "text-green-500", label: "Active" },
  warning: { bg: "bg-yellow-500", text: "text-yellow-500", label: "Warning" },
  offline: { bg: "bg-gray-400", text: "text-gray-400", label: "Offline" },
}

const typeIcons: Record<string, React.ReactNode> = {
  PLC: <Cpu className="h-4 w-4" />,
  HMI: <Server className="h-4 w-4" />,
  SCADA: <Network className="h-4 w-4" />,
  Network: <Wifi className="h-4 w-4" />,
  Drive: <Activity className="h-4 w-4" />,
  Sensor: <Activity className="h-4 w-4" />,
}

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [vendorFilter, setVendorFilter] = useState<string>("all")
  const [criticalityFilter, setCriticalityFilter] = useState<string>("all")

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.ip.includes(searchQuery) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || asset.type === typeFilter
    const matchesVendor = vendorFilter === "all" || asset.vendor === vendorFilter
    const matchesCriticality = criticalityFilter === "all" || asset.criticality === criticalityFilter
    return matchesSearch && matchesType && matchesVendor && matchesCriticality
  })

  const uniqueTypes = [...new Set(assets.map((a) => a.type))]
  const uniqueVendors = [...new Set(assets.map((a) => a.vendor))]

  const stats = {
    total: assets.length,
    critical: assets.filter((a) => a.criticality === "critical").length,
    active: assets.filter((a) => a.status === "active").length,
    offline: assets.filter((a) => a.status === "offline").length,
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Asset Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive view of all OT assets on the network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Server className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">Critical Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Wifi className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-500/10">
                <WifiOff className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.offline}</p>
                <p className="text-xs text-muted-foreground">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, IP, or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {uniqueVendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Criticality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-lg p-1 bg-muted/50">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Firmware</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vulns</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {typeIcons[asset.type] || <Server className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">{asset.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{asset.vendor}</TableCell>
                      <TableCell className="font-mono text-sm">{asset.ip}</TableCell>
                      <TableCell className="text-sm">{asset.firmware}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", criticalityColors[asset.criticality])}>
                          {asset.criticality}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full", statusColors[asset.status].bg)} />
                          <span className={cn("text-xs", statusColors[asset.status].text)}>
                            {statusColors[asset.status].label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {asset.vulnerabilities > 0 ? (
                          <Badge variant="destructive" className="text-xs">
                            {asset.vulnerabilities}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            {typeIcons[asset.type] || <Server className="h-5 w-5 text-primary" />}
                          </div>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                              statusColors[asset.status].bg
                            )}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.id}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{asset.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Wifi className="h-3 w-3" />
                        <span className="font-mono">{asset.ip}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {asset.type}
                        </Badge>
                        <Badge className={cn("text-[10px]", criticalityColors[asset.criticality])}>
                          {asset.criticality}
                        </Badge>
                      </div>
                      {asset.vulnerabilities > 0 && (
                        <Badge variant="destructive" className="text-[10px]">
                          {asset.vulnerabilities} vulns
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assets found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
