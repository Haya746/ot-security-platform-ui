"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Shield,
  Search,
  Filter,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Bug,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Info,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { vulnerabilities, assets } from "@/lib/data"
import { cn } from "@/lib/utils"

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-500", text: "text-red-500", border: "border-red-500/30" },
  high: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500/30" },
  medium: { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500/30" },
  low: { bg: "bg-green-500", text: "text-green-500", border: "border-green-500/30" },
}

const statusIcons: Record<string, React.ReactNode> = {
  open: <AlertTriangle className="h-4 w-4 text-red-500" />,
  in_progress: <Clock className="h-4 w-4 text-yellow-500" />,
  resolved: <CheckCircle2 className="h-4 w-4 text-green-500" />,
}

export default function VulnerabilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [vendorFilter, setVendorFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredVulns = vulnerabilities.filter((vuln) => {
    const matchesSearch =
      vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.cve.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter
    const matchesVendor = vendorFilter === "all" || vuln.vendor === vendorFilter
    const matchesStatus = statusFilter === "all" || vuln.status === statusFilter
    return matchesSearch && matchesSeverity && matchesVendor && matchesStatus
  })

  const uniqueVendors = [...new Set(vulnerabilities.map((v) => v.vendor))]

  const stats = {
    total: vulnerabilities.length,
    critical: vulnerabilities.filter((v) => v.severity === "critical").length,
    high: vulnerabilities.filter((v) => v.severity === "high").length,
    open: vulnerabilities.filter((v) => v.status === "open").length,
  }

  const getAssetName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    return asset?.name || assetId
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vulnerabilities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage security vulnerabilities across your OT environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Knowledge Base
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
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
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Bug className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.high}</p>
                <p className="text-xs text-muted-foreground">High</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Open</p>
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
                placeholder="Search by CVE, title, or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-3">
            {filteredVulns.map((vuln) => (
              <AccordionItem
                key={vuln.id}
                value={vuln.id}
                className={cn(
                  "border rounded-lg px-4 transition-colors",
                  severityColors[vuln.severity].border,
                  "hover:bg-muted/30"
                )}
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 w-full">
                    <Badge
                      className={cn(
                        "shrink-0 text-[10px] font-semibold uppercase",
                        severityColors[vuln.severity].bg,
                        "text-white"
                      )}
                    >
                      {vuln.severity}
                    </Badge>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm truncate">{vuln.title}</p>
                      <p className="text-xs text-muted-foreground">{vuln.cve}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold">{vuln.cvss}</p>
                        <p className="text-[10px] text-muted-foreground">CVSS</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcons[vuln.status]}
                        <span className="text-xs capitalize">
                          {vuln.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">
                          Description
                        </h4>
                        <p className="text-sm">{vuln.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">
                            Vendor
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {vuln.vendor}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">
                            Source
                          </h4>
                          <span className="text-xs">{vuln.advisorySource}</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">
                            Published
                          </h4>
                          <span className="text-xs">
                            {new Date(vuln.published).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {vuln.exploitAvailable && (
                          <Badge variant="destructive" className="text-xs">
                            Exploit Available
                          </Badge>
                        )}
                        {vuln.patchAvailable && (
                          <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/30">
                            Patch Available
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-primary mb-1">
                              AI Recommendation
                            </p>
                            <p className="text-sm">{vuln.remediation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">
                          Affected Assets ({vuln.affectedAssets.length})
                        </h4>
                        <div className="space-y-2">
                          {vuln.affectedAssets.map((assetId) => (
                            <Link
                              key={assetId}
                              href="/assets"
                              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <Server className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate">
                                {getAssetName(assetId)}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href="/remediation">
                          <Button size="sm" className="w-full">
                            Create Remediation Task
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Advisory
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filteredVulns.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vulnerabilities found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Vendor Security Feeds</CardTitle>
          </div>
          <CardDescription>
            Integrated with major OT vendor security advisories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Siemens ProductCERT", count: 12, status: "live" },
              { name: "Rockwell Security", count: 8, status: "live" },
              { name: "Schneider Security", count: 6, status: "live" },
              { name: "CISA ICS-CERT", count: 15, status: "live" },
            ].map((feed) => (
              <div
                key={feed.name}
                className="p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">{feed.name}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-green-500">Live</span>
                  </span>
                </div>
                <p className="text-lg font-bold">{feed.count}</p>
                <p className="text-[10px] text-muted-foreground">Active advisories</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
