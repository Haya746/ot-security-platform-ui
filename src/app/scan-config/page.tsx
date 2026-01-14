"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Zap,
  Search,
  Settings2,
  Cpu,
  Monitor,
  Router,
  Camera,
  Activity,
  Grid3X3,
  Clock,
  Info,
  Eye,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const scanModes = [
  {
    id: "quick",
    title: "Quick Scan",
    description: "Fast, surface-level check of critical assets.",
    icon: Zap,
    duration: "~5 min",
  },
  {
    id: "deep",
    title: "Deep Scan",
    description: "Comprehensive inventory and vulnerability check.",
    icon: Search,
    duration: "~30 min",
  },
  {
    id: "custom",
    title: "Customized Scan",
    description: "Select specific assets for targeted scans.",
    icon: Settings2,
    duration: "Variable",
  },
]

const deviceTypes = [
  { id: "plcs", label: "PLCs", icon: Cpu },
  { id: "hmis", label: "HMIs", icon: Monitor },
  { id: "gateways", label: "Gateways", icon: Router },
  { id: "scada", label: "SCADA", icon: Grid3X3 },
  { id: "sensors", label: "Sensors", icon: Activity },
  { id: "cameras", label: "Cameras", icon: Camera },
]

export default function ScanConfigPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState("quick")
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [ipRanges, setIpRanges] = useState("10.16.2.0/16, 10.20.5.1-10.20.5.50")
  const [vendors, setVendors] = useState("Rockwell, Siemens, Schneider")
  const [pullRealtime, setPullRealtime] = useState(true)

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((d) => d !== deviceId)
        : [...prev, deviceId]
    )
  }

  const handleStartScan = () => {
    router.push("/in-progress")
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">New Scan Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure and launch a new OT network scan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Last Saved
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleStartScan}>
            <Zap className="h-4 w-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scan Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scanModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all",
                  selectedMode === mode.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <mode.icon className={cn(
                    "h-5 w-5",
                    selectedMode === mode.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="font-medium text-sm">{mode.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
                <Badge variant="outline" className="mt-3 text-[10px]">
                  {mode.duration}
                </Badge>
              </button>
            ))}
          </div>

          {selectedMode === "custom" && (
            <>
              <div className="mt-6 p-4 rounded-lg border border-border border-dashed bg-muted/30">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Customized details appear below when &quot;Customized Scan&quot; is selected.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Customized Scan Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-3 block">Device Types</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {deviceTypes.map((device) => (
                          <button
                            key={device.id}
                            onClick={() => toggleDevice(device.id)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border transition-all",
                              selectedDevices.includes(device.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 bg-muted/30"
                            )}
                          >
                            <device.icon className={cn(
                              "h-4 w-4",
                              selectedDevices.includes(device.id) ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="text-sm">{device.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Specific IPs or Ranges</Label>
                      <Input
                        value={ipRanges}
                        onChange={(e) => setIpRanges(e.target.value)}
                        placeholder="e.g., 10.0.0.0/8, 10.0.0.1-10.0.0.20"
                        className="font-mono text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Example formats: CIDR (10.0.0.0/8), range (10.0.0.1-10.0.0.20)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Products / Vendors</Label>
                      <Input
                        value={vendors}
                        onChange={(e) => setVendors(e.target.value)}
                        placeholder="e.g., Rockwell, Siemens, Schneider"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Real-time Data Integration</Label>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                        <Checkbox
                          id="realtime"
                          checked={pullRealtime}
                          onCheckedChange={(checked) => setPullRealtime(checked as boolean)}
                        />
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <label htmlFor="realtime" className="text-sm cursor-pointer">
                            Pull real-time vulnerability advisories
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleStartScan}>
          <Zap className="h-4 w-4 mr-2" />
          Start Scan
        </Button>
      </div>
    </div>
  )
}
