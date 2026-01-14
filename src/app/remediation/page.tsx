"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Wrench,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  BookOpen,
  FileText,
  Lightbulb,
  Target,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { remediationTasks, assets, vulnerabilities } from "@/lib/data"
import { cn } from "@/lib/utils"

const priorityColors: Record<string, { bg: string; text: string; badge: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-500", badge: "bg-red-500 text-white" },
  high: { bg: "bg-orange-500/10", text: "text-orange-500", badge: "bg-orange-500 text-white" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-500", badge: "bg-yellow-500 text-black" },
  low: { bg: "bg-green-500/10", text: "text-green-500", badge: "bg-green-500 text-white" },
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Clock className="h-4 w-4" />, label: "Pending", color: "text-muted-foreground" },
  in_progress: { icon: <Play className="h-4 w-4" />, label: "In Progress", color: "text-yellow-500" },
  completed: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Completed", color: "text-green-500" },
}

const workflowSteps = [
  { step: 1, title: "Identify", description: "Detect and classify the vulnerability" },
  { step: 2, title: "Assess", description: "Evaluate risk and impact" },
  { step: 3, title: "Plan", description: "Develop remediation strategy" },
  { step: 4, title: "Test", description: "Validate fix in test environment" },
  { step: 5, title: "Deploy", description: "Apply fix to production" },
  { step: 6, title: "Verify", description: "Confirm successful remediation" },
]

export default function RemediationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const filteredTasks = remediationTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesPriority && matchesStatus
  })

  const stats = {
    total: remediationTasks.length,
    pending: remediationTasks.filter((t) => t.status === "pending").length,
    inProgress: remediationTasks.filter((t) => t.status === "in_progress").length,
    completed: remediationTasks.filter((t) => t.status === "completed").length,
  }

  const getAssetName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    return asset?.name || assetId
  }

  const getVulnTitle = (vulnId: string) => {
    const vuln = vulnerabilities.find((v) => v.id === vulnId)
    return vuln?.title || vulnId
  }

  const activeTask = selectedTask
    ? remediationTasks.find((t) => t.id === selectedTask)
    : remediationTasks.find((t) => t.status === "in_progress")

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Remediation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage security remediation tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Best Practices
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Play className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Remediation Workflow</CardTitle>
          <CardDescription>Standard 6-step process for vulnerability remediation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {workflowSteps.map((step, index) => (
              <div key={step.step} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      index < 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.step}
                  </div>
                  <p className="text-xs font-medium mt-2">{step.title}</p>
                  <p className="text-[10px] text-muted-foreground text-center max-w-[80px]">
                    {step.description}
                  </p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base">Tasks</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    selectedTask === task.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-[10px]", priorityColors[task.priority].badge)}>
                          {task.priority}
                        </Badge>
                        <div className={cn("flex items-center gap-1", statusConfig[task.status].color)}>
                          {statusConfig[task.status].icon}
                          <span className="text-xs">{statusConfig[task.status].label}</span>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold">{task.progress}%</p>
                      <Progress value={task.progress} className="w-20 h-1.5 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks found matching your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {activeTask && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Task Details</CardTitle>
                  <Badge className={cn("text-[10px]", priorityColors[activeTask.priority].badge)}>
                    {activeTask.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">{activeTask.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{activeTask.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{activeTask.progress}%</span>
                  </div>
                  <Progress value={activeTask.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Steps</h4>
                  {activeTask.steps.map((step) => (
                    <div
                      key={step.step}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg",
                        step.completed ? "bg-green-500/10" : "bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-muted-foreground/20 text-muted-foreground"
                        )}
                      >
                        {step.completed ? <CheckCircle2 className="h-3 w-3" /> : step.step}
                      </div>
                      <span
                        className={cn(
                          "text-xs",
                          step.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Affected Assets</h4>
                  {activeTask.assets.map((assetId) => (
                    <Link
                      key={assetId}
                      href="/assets"
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs truncate">{getAssetName(assetId)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Related Vulnerabilities</h4>
                  {activeTask.vulnerabilities.map((vulnId) => (
                    <Link
                      key={vulnId}
                      href="/vulnerabilities"
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs truncate">{getVulnTitle(vulnId)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    {activeTask.status === "pending" ? "Start Task" : "Update Progress"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Knowledge Base</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "PLC Security Hardening Guide",
                "Network Segmentation Best Practices",
                "Firmware Update Procedures",
                "Incident Response Playbook",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{item}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
