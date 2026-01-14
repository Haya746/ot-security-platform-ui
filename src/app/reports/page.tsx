"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileText,
  Search,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Clock,
  ChevronRight,
  FileCheck,
  BarChart3,
  Share2,
  Printer,
  Eye,
  X,
  Check,
  Info,
  Save,
  FolderOpen,
  Lock,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { reports, complianceFrameworks } from "@/lib/data"
import { cn } from "@/lib/utils"

const severityColors: Record<string, string> = {
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
  critical: "bg-red-500",
}

export default function ReportsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>("7days")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [formatFilter, setFormatFilter] = useState<string>("all")
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportPreset, setExportPreset] = useState("executive")
  const [selectedSections, setSelectedSections] = useState(["vulnerabilities"])
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [anonymizeAssets, setAnonymizeAssets] = useState(false)
  const [passwordProtect, setPasswordProtect] = useState(false)

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.scanId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === "all" || report.severity === severityFilter
    const matchesFormat = formatFilter === "all" || report.type.toLowerCase() === formatFilter
    return matchesSearch && matchesSeverity && matchesFormat
  })

  const toggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const startExport = () => {
    setIsExporting(true)
    setExportProgress(0)
  }

  useEffect(() => {
    if (isExporting && exportProgress < 100) {
      const timer = setTimeout(() => {
        setExportProgress((prev) => Math.min(prev + Math.random() * 15, 100))
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isExporting, exportProgress])

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate and manage security reports for your OT environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background border-border">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Export Report to PDF</DialogTitle>
                  <span className="text-sm text-muted-foreground">
                    Interactive Report • Scan #A7D2
                  </span>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-3">Export preset</p>
                  <div className="flex flex-wrap gap-2">
                    {["executive", "technical", "custom"].map((preset) => (
                      <Button
                        key={preset}
                        variant={exportPreset === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportPreset(preset)}
                        className={cn(
                          "capitalize",
                          exportPreset === preset && "bg-primary text-primary-foreground"
                        )}
                      >
                        {preset === "executive"
                          ? "Executive summary"
                          : preset === "technical"
                          ? "Full technical"
                          : "Custom selection"}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 mb-3">Include sections</p>
                  <div className="flex flex-wrap gap-2">
                    {["Assets", "Vulnerabilities", "Recommendations", "Appendix"].map((section) => (
                      <Button
                        key={section}
                        variant={selectedSections.includes(section.toLowerCase()) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSection(section.toLowerCase())}
                        className={cn(
                          selectedSections.includes(section.toLowerCase()) &&
                            "bg-primary text-primary-foreground"
                        )}
                      >
                        {section}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-border border-dashed">
                    <p className="text-xs text-muted-foreground mb-1">File name</p>
                    <p className="text-sm font-medium">OT-Scan-A7D2-Report.pdf</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border border-dashed">
                    <p className="text-xs text-muted-foreground mb-1">Estimated size</p>
                    <p className="text-sm font-medium">2.4 MB</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <Checkbox
                      id="anonymize"
                      checked={anonymizeAssets}
                      onCheckedChange={(checked) => setAnonymizeAssets(checked as boolean)}
                    />
                    <label htmlFor="anonymize" className="text-sm cursor-pointer">
                      Anonymize asset identifiers
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <Checkbox
                      id="password"
                      checked={passwordProtect}
                      onCheckedChange={(checked) => setPasswordProtect(checked as boolean)}
                    />
                    <label htmlFor="password" className="text-sm cursor-pointer flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password protect PDF
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border border-dashed">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Export runs in the background. You can continue reviewing the report.
                    </p>
                  </div>
                </div>

                {isExporting && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {exportProgress >= 100 ? "Report ready for viewing" : `Preparing PDF... ${Math.round(exportProgress)}%`}
                      </p>
                    </div>
                    <Progress value={exportProgress} className="h-2 [&>div]:bg-primary" />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setExportModalOpen(false)}>
                    Cancel
                  </Button>
                  {exportProgress >= 100 ? (
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => router.push("/reports/RPT-A7D2")}
                    >
                      View Generated Report
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={startExport}
                      disabled={isExporting && exportProgress < 100}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isExporting ? "Processing..." : "Start Export"}
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or note"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Time range</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "7days", label: "Last 7 days" },
                  { value: "30days", label: "30 days" },
                  { value: "quarter", label: "Quarter" },
                  { value: "year", label: "Year" },
                ].map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRangeFilter === range.value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-xs",
                      timeRangeFilter === range.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setTimeRangeFilter(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Severity</label>
              <div className="flex flex-wrap gap-2">
                {["critical", "high", "medium", "low"].map((severity) => (
                  <Button
                    key={severity}
                    variant={severityFilter === severity ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-xs capitalize",
                      severityFilter === severity && "bg-primary text-primary-foreground"
                    )}
                    onClick={() =>
                      setSeverityFilter(severityFilter === severity ? "all" : severity)
                    }
                  >
                    {severity}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {["Plant A", "PLC", "Network", "Anonymized"].map((tag) => (
                  <Button key={tag} variant="outline" size="sm" className="text-xs">
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Format</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "interactive", label: "Interactive" },
                  { value: "pdf", label: "PDF" },
                ].map((format) => (
                  <Button
                    key={format.value}
                    variant={formatFilter === format.value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-xs",
                      formatFilter === format.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() =>
                      setFormatFilter(formatFilter === format.value ? "all" : format.value)
                    }
                  >
                    {format.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search reports..." className="pl-9" />
              </div>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[280px]">Report</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{report.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.type} • Scan {report.scanId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs mr-1">
                            {report.assets} assets
                          </Badge>
                          <Badge variant="outline" className="text-xs mr-1">
                            {report.vulnerabilities} vulns
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.recommendations} recommendations
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs text-white",
                            severityColors[report.severity]
                          )}
                        >
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getRelativeTime(report.generated)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/reports/${report.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance Frameworks</CardTitle>
          <CardDescription>Track compliance across industry standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceFrameworks.map((framework) => (
              <div
                key={framework.id}
                className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">{framework.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      framework.status === "good"
                        ? "text-green-500 border-green-500/30"
                        : "text-yellow-500 border-yellow-500/30"
                    )}
                  >
                    {framework.status === "good" ? "Compliant" : "Partial"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{framework.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {framework.passedControls}/{framework.totalControls} controls
                    </span>
                    <span className="font-bold">{framework.score}%</span>
                  </div>
                  <Progress
                    value={framework.score}
                    className={cn(
                      "h-2",
                      framework.status === "good"
                        ? "[&>div]:bg-green-500"
                        : "[&>div]:bg-yellow-500"
                    )}
                  />
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
