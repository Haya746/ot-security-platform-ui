"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  Download,
  Printer,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  FileText,
  LayoutDashboard,
  ClipboardList,
  Activity,
  Search,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { reports, assets, vulnerabilities, complianceFrameworks } from "@/lib/data"
import { cn } from "@/lib/utils"

const severityColors: Record<string, string> = {
  critical: "text-red-500 bg-red-500/10 border-red-500/20",
  high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  low: "text-green-500 bg-green-500/10 border-green-500/20",
}

const statusColors: Record<string, string> = {
  active: "text-green-500 bg-green-500/10",
  warning: "text-yellow-500 bg-yellow-500/10",
  offline: "text-muted-foreground bg-muted",
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const report = reports.find((r) => r.id === id) || reports[0]
  const [activeSection, setActiveSection] = useState("summary")

  const vulnDistribution = [
    { name: "Critical", value: 4, color: "#ef4444" },
    { name: "High", value: 12, color: "#f97316" },
    { name: "Medium", value: 10, color: "#eab308" },
    { name: "Low", value: 5, color: "#22c55e" },
  ]

  const assetCriticalityData = [
    { name: "Critical Assets", value: 15, color: "#ef4444" },
    { name: "High Assets", value: 25, color: "#f97316" },
    { name: "Med/Low Assets", value: 42, color: "#22c55e" },
  ]

  if (!report) return <div>Report not found</div>

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <Link
            href="/reports"
            className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back to Reports
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{report.name.replace(".pdf", "")}</h1>
            <Badge variant="outline" className="h-6 px-3">
              Scan {report.scanId}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date(report.generated).toLocaleString()} • Scope: {report.tags.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>

      {/* Guided Navigation */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
        {[
          { id: "summary", label: "Executive Summary", icon: LayoutDashboard },
          { id: "vulnerabilities", label: "Vulnerability Analysis", icon: ShieldAlert },
          { id: "assets", label: "Asset Inventory", icon: Activity },
          { id: "compliance", label: "Compliance Status", icon: ClipboardList },
          { id: "remediation", label: "Remediation Plan", icon: Zap },
        ].map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "px-4 transition-all",
              activeSection === section.id && "bg-background shadow-sm"
            )}
          >
            <section.icon className="h-3.5 w-3.5 mr-2" />
            {section.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {activeSection === "summary" && (
            <div className="space-y-8 animate-fade-up">
              {/* Risk Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldAlert className="h-32 w-32" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Overall Risk Posture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative h-40 w-40">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="8"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-orange-500 stroke-current transition-all duration-1000 ease-out"
                          strokeWidth="8"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * 72) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">72</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          High Risk
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Critical Vulnerabilities</span>
                          <span className="font-bold">4</span>
                        </div>
                        <Progress value={80} className="h-1 [&>div]:bg-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Patch Coverage</span>
                          <span className="font-bold">64%</span>
                        </div>
                        <Progress value={64} className="h-1 [&>div]:bg-orange-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Compliance Score</span>
                          <span className="font-bold">85%</span>
                        </div>
                        <Progress value={85} className="h-1 [&>div]:bg-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between p-6 bg-primary text-primary-foreground">
                  <div>
                    <h3 className="text-sm font-medium opacity-80">AI Analysis Summary</h3>
                    <p className="mt-4 text-sm leading-relaxed">
                      "Significant exposure detected in <strong>Plant A</strong>. Outdated firmware on
                      Siemens PLCs represents the highest risk vector for production downtime."
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full mt-4 group">
                    View Mitigation Steps
                    <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              </div>

              {/* Key Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Vulnerability Severity Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vulnDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {vulnDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Asset Criticality Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetCriticalityData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {assetCriticalityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                      {assetCriticalityData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {entry.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "vulnerabilities" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Priority Vulnerabilities</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    4 Critical
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <ShieldAlert className="h-3 w-3 text-orange-500" />
                    12 High
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {vulnerabilities
                  .filter((v) => v.severity === "critical" || v.severity === "high")
                  .map((vuln) => (
                    <Card key={vuln.id} className="overflow-hidden">
                      <div className="flex">
                        <div
                          className={cn(
                            "w-1.5",
                            vuln.severity === "critical" ? "bg-red-500" : "bg-orange-500"
                          )}
                        />
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn("uppercase text-[10px]", severityColors[vuln.severity])}
                                >
                                  {vuln.severity}
                                </Badge>
                                <span className="text-xs font-mono font-medium text-muted-foreground">
                                  {vuln.cve}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold">{vuln.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {vuln.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">CVSS:</span>
                                <span className="font-bold text-lg">{vuln.cvss}</span>
                              </div>
                              <div className="flex gap-1">
                                {vuln.exploitAvailable && (
                                  <Badge variant="outline" className="text-[10px] text-red-500 border-red-500/20">
                                    Exploit Available
                                  </Badge>
                                )}
                                {vuln.patchAvailable && (
                                  <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">
                                    Patch Ready
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                {vuln.affectedAssets.slice(0, 3).map((assetId, i) => (
                                  <div
                                    key={assetId}
                                    className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium"
                                  >
                                    {assetId.slice(-2)}
                                  </div>
                                ))}
                                {vuln.affectedAssets.length > 3 && (
                                  <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium">
                                    +{vuln.affectedAssets.length - 3}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {vuln.affectedAssets.length} affected assets
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">
                              Remediation Steps
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {activeSection === "assets" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Asset Exposure Map</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    View Network Graph
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Vulns</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.slice(0, 8).map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{asset.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {asset.ip}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {asset.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                asset.criticality === "critical"
                                  ? "bg-red-500"
                                  : asset.criticality === "high"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              )}
                            />
                            <span className="text-xs capitalize">{asset.criticality}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              asset.vulnerabilities > 3 ? "text-red-500" : "text-muted-foreground"
                            )}
                          >
                            {asset.vulnerabilities}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px] border-none", statusColors[asset.status])}>
                            {asset.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeSection === "compliance" && (
            <div className="space-y-6 animate-fade-up">
              <h2 className="text-xl font-bold">Framework Alignment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceFrameworks.map((framework) => (
                  <Card key={framework.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="font-bold">{framework.name}</h3>
                        <p className="text-xs text-muted-foreground">{framework.description}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          framework.status === "good" ? "text-green-500" : "text-yellow-500"
                        )}
                      >
                        {framework.status === "good" ? "Compliant" : "Needs Review"}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Readiness Score</span>
                        <span>{framework.score}%</span>
                      </div>
                      <Progress value={framework.score} className="h-2" />
                      <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {framework.passedControls} of {framework.totalControls} Controls Passed
                        </span>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] p-0">
                          View Gaps <ChevronLeft className="h-3 w-3 ml-1 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "remediation" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Actionable Remediation Plan</h2>
                <Button className="h-8 text-xs bg-primary hover:bg-primary/90">
                  Generate Work Order
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-1" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-primary">Priority 1: Immediate Action</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The following tasks are estimated to reduce the overall risk score by{" "}
                        <strong>42%</strong> if completed within the next 48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "TASK-1",
                      title: "Apply Siemens S7-1500 Security Update",
                      impact: "Reduces risk score by 18 points",
                      difficulty: "Medium",
                      time: "2h",
                      assets: 3,
                    },
                    {
                      id: "TASK-2",
                      title: "Rotate HMI Admin Credentials",
                      impact: "Removes unauthenticated access vector",
                      difficulty: "Easy",
                      time: "30m",
                      assets: 8,
                    },
                    {
                      id: "TASK-3",
                      title: "Enable Network Segmentation - Zone B",
                      impact: "Prevents lateral movement",
                      difficulty: "Hard",
                      time: "6h",
                      assets: 12,
                    },
                  ].map((task) => (
                    <Card key={task.id} className="p-4 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="text-[10px] bg-primary/10 text-primary border-none">
                              {task.id}
                            </Badge>
                            <span className="text-xs font-medium text-muted-foreground">
                              {task.time} Est. Time
                            </span>
                          </div>
                          <h3 className="font-bold">{task.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              {task.impact}
                            </span>
                            <span>•</span>
                            <span>{task.assets} Assets affected</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View Guide
                          </Button>
                          <Button size="sm" className="h-8 text-xs">
                            Assign
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Scan Method
                </span>
                <p className="text-sm font-medium">Passive Analysis + Active Enumeration</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Network Coverage
                </span>
                <p className="text-sm font-medium">VLAN 10, 20, 50 (Production)</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Engine Version
                </span>
                <p className="text-sm font-medium">v4.2.1-stable</p>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Auditor Notes</h4>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "This scan identifies a significant regression in patch management compared to the
                  Q4 report. Immediate focus should be on the legacy SCADA terminals."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Expert Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold">Implement ZTNA for Plant B</h5>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Moving towards Zero Trust Network Access will reduce lateral risk by 90% in
                    critical zones.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Request Security Briefing
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-between text-xs h-9">
                Compare with previous scan
                <ArrowUpRight className="h-3 w-3" />
              </Button>
              <Button variant="ghost" className="w-full justify-between text-xs h-9">
                Export asset CSV
                <Download className="h-3 w-3" />
              </Button>
              <Button variant="ghost" className="w-full justify-between text-xs h-9">
                View raw scan logs
                <FileText className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
