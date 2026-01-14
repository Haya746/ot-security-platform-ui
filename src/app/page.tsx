"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Server,
  Shield,
  AlertTriangle,
  TrendingDown,
  Activity,
  Zap,
  ChevronRight,
  Sparkles,
  Target,
  Clock,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  assets,
  vulnerabilities,
  trendData,
  assetDistribution,
  complianceFrameworks,
  scans,
} from "@/lib/data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { cn } from "@/lib/utils"

const severityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/10 text-green-500 border-green-500/20",
}

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  warning: "bg-yellow-500",
  offline: "bg-gray-400",
}

export default function DashboardPage() {
  const totalAssets = 347
  const criticalVulns = vulnerabilities.filter((v) => v.severity === "critical").length
  const highVulns = vulnerabilities.filter((v) => v.severity === "high").length
  const openVulns = vulnerabilities.filter((v) => v.status === "open").length
  const criticalAssets = assets.filter((a) => a.criticality === "critical")

  const metrics = [
    {
      title: "Total Assets",
      value: totalAssets,
      change: "+12",
      trend: "up",
      icon: Server,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Critical Vulnerabilities",
      value: criticalVulns,
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Open Issues",
      value: openVulns,
      change: "-5",
      trend: "down",
      icon: Shield,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Risk Score",
      value: "72",
      change: "+8",
      trend: "up",
      icon: Target,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ]

  const aiInsights = [
    {
      type: "critical",
      title: "Immediate Action Required",
      description: "3 PLCs with default credentials detected in Plant A. High risk of unauthorized access.",
      action: "Review Devices",
      link: "/vulnerabilities",
    },
    {
      type: "warning",
      title: "Firmware Update Available",
      description: "Siemens released security patches for S7-1500 series addressing CVE-2024-1001.",
      action: "View Advisory",
      link: "/vulnerabilities",
    },
    {
      type: "info",
      title: "Network Segmentation Recommendation",
      description: "Consider isolating Modbus TCP devices from corporate network to reduce attack surface.",
      action: "Learn More",
      link: "/remediation",
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time OT security monitoring and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Last scan: 2 hours ago
          </Button>
          <Link href="/scan-config">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Zap className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    metric.trend === "down" ? "text-green-500 border-green-500/30" : "text-muted-foreground"
                  )}
                >
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Vulnerability Trends</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="vulnGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "currentColor" }} />
                  <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vulnerabilities"
                    stroke="#22c55e"
                    fill="url(#vulnGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    stroke="#ef4444"
                    fill="url(#criticalGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset Distribution</CardTitle>
            <CardDescription>By device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetDistribution} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    className="text-[10px]"
                    tick={{ fill: "currentColor" }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {assetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {assetDistribution.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">AI Insights & Recommendations</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  insight.type === "critical" && "bg-red-500/5 border-red-500/20",
                  insight.type === "warning" && "bg-yellow-500/5 border-yellow-500/20",
                  insight.type === "info" && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-1.5 rounded-md shrink-0",
                      insight.type === "critical" && "bg-red-500/10",
                      insight.type === "warning" && "bg-yellow-500/10",
                      insight.type === "info" && "bg-primary/10"
                    )}
                  >
                    {insight.type === "critical" && <XCircle className="h-4 w-4 text-red-500" />}
                    {insight.type === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {insight.type === "info" && <Sparkles className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  <Link href={insight.link}>
                    <Button variant="ghost" size="sm" className="shrink-0 text-xs">
                      {insight.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Vulnerabilities</CardTitle>
              <Link href="/vulnerabilities">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {vulnerabilities.slice(0, 4).map((vuln) => (
              <div
                key={vuln.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Badge className={cn("shrink-0 text-[10px]", severityColors[vuln.severity])}>
                  {vuln.severity.toUpperCase()}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{vuln.title}</p>
                  <p className="text-xs text-muted-foreground">{vuln.cve}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{vuln.cvss}</p>
                  <p className="text-[10px] text-muted-foreground">CVSS</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Critical Assets</CardTitle>
              <Link href="/assets">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAssets.slice(0, 4).map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Server className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                      statusColors[asset.status]
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.ip}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="outline" className="text-[10px]">
                    {asset.type}
                  </Badge>
                  {asset.vulnerabilities > 0 && (
                    <p className="text-xs text-destructive mt-1">
                      {asset.vulnerabilities} vulns
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Compliance Status</CardTitle>
              <Link href="/reports">
                <Button variant="ghost" size="sm" className="text-xs">
                  View Reports
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceFrameworks.map((framework) => (
              <div key={framework.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{framework.name}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        framework.status === "good" && "text-green-500 border-green-500/30",
                        framework.status === "partial" && "text-yellow-500 border-yellow-500/30"
                      )}
                    >
                      {framework.passedControls}/{framework.totalControls} controls
                    </Badge>
                  </div>
                  <span className="text-sm font-bold">{framework.score}%</span>
                </div>
                <Progress
                  value={framework.score}
                  className={cn(
                    "h-2",
                    framework.status === "good" ? "[&>div]:bg-green-500" : "[&>div]:bg-yellow-500"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
