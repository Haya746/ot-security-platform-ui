"use client"

import { useState } from "react"
import {
  Settings,
  Building2,
  Network,
  Bell,
  Link2,
  Users,
  Key,
  Save,
  ChevronRight,
  Shield,
  Mail,
  Globe,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const settingsTabs = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "network", label: "Network", icon: Network },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "users", label: "Users", icon: Users },
  { id: "api", label: "API Keys", icon: Key },
]

const vendorIntegrations = [
  { name: "Siemens ProductCERT", status: "connected", lastSync: "2 hours ago" },
  { name: "Rockwell Security", status: "connected", lastSync: "3 hours ago" },
  { name: "Schneider Security", status: "connected", lastSync: "1 hour ago" },
  { name: "CISA ICS-CERT", status: "connected", lastSync: "30 min ago" },
  { name: "NVD Database", status: "connected", lastSync: "15 min ago" },
]

const users = [
  { name: "Alex Chen", email: "alex@company.com", role: "Admin", status: "active" },
  { name: "Sarah Johnson", email: "sarah@company.com", role: "Analyst", status: "active" },
  { name: "Mike Williams", email: "mike@company.com", role: "Viewer", status: "active" },
  { name: "Lisa Wong", email: "lisa@company.com", role: "Analyst", status: "invited" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization")
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifications, setNotifications] = useState({
    criticalVulns: true,
    scanComplete: true,
    weeklyDigest: false,
    newAssets: true,
    complianceAlerts: true,
  })

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your OT security platform
          </p>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === "organization" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization Settings</CardTitle>
                <CardDescription>Manage your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue="Acme Industrial Corp" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select defaultValue="manufacturing">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="energy">Energy & Utilities</SelectItem>
                        <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                        <SelectItem value="water">Water & Wastewater</SelectItem>
                        <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Contact</Label>
                    <Input defaultValue="security@acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern (UTC-5)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Security Preferences</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "network" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Network Configuration</CardTitle>
                <CardDescription>Configure network scanning preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scan Subnets</Label>
                    <Input defaultValue="10.10.0.0/16, 10.20.0.0/16, 192.168.1.0/24" />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of CIDR ranges to scan
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Excluded IPs</Label>
                    <Input defaultValue="10.10.0.1, 10.10.0.254" />
                    <p className="text-xs text-muted-foreground">
                      IPs to exclude from scanning
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Scan Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Default Scan Mode</Label>
                      <Select defaultValue="deep">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quick">Quick Scan</SelectItem>
                          <SelectItem value="deep">Deep Scan</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Scan Schedule</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Passive Discovery</p>
                      <p className="text-xs text-muted-foreground">
                        Continuously monitor network traffic
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Real-time Alerts</p>
                      <p className="text-xs text-muted-foreground">
                        Alert on new device detection
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Shield className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Critical Vulnerabilities</p>
                        <p className="text-xs text-muted-foreground">
                          Immediate alerts for critical findings
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.criticalVulns}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, criticalVulns: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Zap className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Scan Complete</p>
                        <p className="text-xs text-muted-foreground">
                          Notification when scans finish
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.scanComplete}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, scanComplete: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Weekly Digest</p>
                        <p className="text-xs text-muted-foreground">
                          Summary email every Monday
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyDigest: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Network className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New Assets Detected</p>
                        <p className="text-xs text-muted-foreground">
                          Alert when new devices appear
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.newAssets}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newAssets: checked })
                      }
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Delivery Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Recipients</Label>
                      <Input defaultValue="security-team@acme.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slack Webhook</Label>
                      <Input type="password" defaultValue="https://hooks.slack.com/..." />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendor Integrations</CardTitle>
                <CardDescription>Manage security feed connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendorIntegrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{integration.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs text-green-500">Connected</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • Last sync: {integration.lastSync}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">User Management</CardTitle>
                    <CardDescription>Manage team access and roles</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            user.status === "invited" && "text-yellow-500 border-yellow-500/30"
                          )}
                        >
                          {user.status === "invited" ? "Pending" : user.role}
                        </Badge>
                        <Select defaultValue={user.role.toLowerCase()}>
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "api" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API Keys</CardTitle>
                <CardDescription>Manage API access tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">Production API Key</p>
                      <p className="text-xs text-muted-foreground">Created Jan 10, 2024</p>
                    </div>
                    <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_Oq7zKx9Lm4nP8rSt2wYv1zAb3cDe5fGh"
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border border-dashed">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">Development API Key</p>
                      <p className="text-xs text-muted-foreground">Created Jan 5, 2024</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Test Mode
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="sk_test_Xw2yZ3aB4cD5eF6gH7iJ8kL9mN0oPqRs"
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rotate Keys
                  </Button>
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
