"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Radar,
  Pause,
  Play,
  X,
  AlertTriangle,
  Save,
  Info,
  Clock,
  Server,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const initialLogs = [
  { time: "10:24:02", message: "Enumerating devices on 10.10.12.0/24", type: "info" },
  { time: "10:24:05", message: "Identified PLC: Siemens S7-1200 (2 ports open)", type: "success" },
  { time: "10:24:09", message: "Checking CVE advisories (real-time)", type: "info" },
  { time: "10:24:15", message: "Running Modbus/TCP handshake", type: "info" },
  { time: "10:24:18", message: "Found default credentials on HMI", type: "warning" },
  { time: "10:24:22", message: "Capturing packets for anomaly baseline", type: "info" },
]

const vulnerabilityHighlights = [
  {
    severity: "critical",
    title: "Unauthenticated access on PLCs",
    details: "Affects 14 assets • CVE group: 2024-xxxx",
  },
  {
    severity: "high",
    title: "Outdated HMI firmware",
    details: "Affects 8 assets • Vendor: Acme HMI 3.x",
  },
  {
    severity: "high",
    title: "Weak encryption on Modbus traffic",
    details: "Detected on 3 subnets • Protocol: Modbus/TCP",
  },
]

export default function InProgressPage() {
  const [progress, setProgress] = useState(48)
  const [isPaused, setIsPaused] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [elapsedTime, setElapsedTime] = useState({ minutes: 12, seconds: 34 })
  const [assetsEnumerated, setAssetsEnumerated] = useState(712)
  const [findingsLogged, setFindingsLogged] = useState(19)
  const [logs, setLogs] = useState(initialLogs)

  useEffect(() => {
    if (!isPaused && progress < 100) {
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100
          return prev + Math.random() * 0.5
        })
      }, 1000)

      const timeTimer = setInterval(() => {
        setElapsedTime((prev) => {
          const totalSeconds = prev.minutes * 60 + prev.seconds + 1
          return {
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60,
          }
        })
      }, 1000)

      const assetsTimer = setInterval(() => {
        setAssetsEnumerated((prev) => prev + Math.floor(Math.random() * 5))
        if (Math.random() > 0.7) {
          setFindingsLogged((prev) => prev + 1)
        }
      }, 2000)

      const logTimer = setInterval(() => {
        const newLogs = [
          "Scanning subnet 10.10.13.0/24",
          "Identified HMI: Schneider Magelis",
          "Querying SCADA historian",
          "Profinet device discovery",
          "Checking firmware versions",
          "Protocol analysis complete",
          "OPC-UA server detected",
          "Verifying network topology",
        ]
        const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)]
        const now = new Date()
        const time = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
        setLogs((prev) => [
          ...prev.slice(-20),
          {
            time,
            message: randomLog,
            type: Math.random() > 0.8 ? "warning" : "info",
          },
        ])
      }, 3000)

      return () => {
        clearInterval(progressTimer)
        clearInterval(timeTimer)
        clearInterval(assetsTimer)
        clearInterval(logTimer)
      }
    }
  }, [isPaused, progress])

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Scan In Progress</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep scan running on Plant A network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              isPaused ? "text-yellow-500 border-yellow-500/30" : "text-green-500 border-green-500/30"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full mr-2", isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse")} />
            {isPaused ? "Paused" : "Running"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall completion</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 [&>div]:bg-primary" />
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setCancelModalOpen(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">
                  {elapsedTime.minutes}m {elapsedTime.seconds.toString().padStart(2, "0")}s
                </p>
                <p className="text-xs text-muted-foreground">Elapsed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Server className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assetsEnumerated}</p>
                <p className="text-xs text-muted-foreground">Assets Enumerated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Shield className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{findingsLogged}</p>
                <p className="text-xs text-muted-foreground">Findings Logged</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Live Actions Log</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2 font-mono text-xs">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-2 rounded",
                      log.type === "warning" && "bg-yellow-500/10",
                      log.type === "success" && "bg-green-500/10",
                      log.type === "info" && "bg-muted/50"
                    )}
                  >
                    <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                    <span
                      className={cn(
                        log.type === "warning" && "text-yellow-500",
                        log.type === "success" && "text-green-500"
                      )}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Vulnerability Highlights</CardTitle>
            <CardDescription>Real-time findings from the scan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {vulnerabilityHighlights.map((vuln, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  vuln.severity === "critical" && "border-red-500/30 bg-red-500/5",
                  vuln.severity === "high" && "border-orange-500/30 bg-orange-500/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    className={cn(
                      "shrink-0 text-[10px] text-white",
                      vuln.severity === "critical" && "bg-red-500",
                      vuln.severity === "high" && "bg-orange-500"
                    )}
                  >
                    {vuln.severity}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{vuln.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{vuln.details}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link href="/vulnerabilities">
                <Button variant="outline" size="sm" className="w-full">
                  View All Findings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>Cancel current scan?</DialogTitle>
            </div>
            <DialogDescription>
              Stopping the scan will discard progress since the last checkpoint. You can save
              partial results or exit without saving.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="text-xs text-muted-foreground">Elapsed</p>
                <p className="text-lg font-bold font-mono">
                  {elapsedTime.minutes}m {elapsedTime.seconds.toString().padStart(2, "0")}s
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completion</p>
                <p className="text-lg font-bold">{Math.round(progress)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assets Enumerated</p>
                <p className="text-lg font-bold">{assetsEnumerated}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Findings Logged</p>
                <p className="text-lg font-bold">{findingsLogged}</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg border border-border border-dashed">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  You can resume later if you save a checkpoint of partial results.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Back
            </Button>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Partial & Cancel
            </Button>
            <Link href="/">
              <Button variant="destructive">
                <X className="h-4 w-4 mr-2" />
                Cancel Without Saving
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
