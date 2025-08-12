import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus, ExternalLink, RefreshCw } from "lucide-react";
import { DashboardFooter } from "@/components/DashboardFooter";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your connected bank accounts and financial institutions.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connect Account
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,567.89</div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 min ago</div>
            <p className="text-xs text-muted-foreground">Data is current</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Your linked bank accounts and their current balances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Bank of America</p>
                  <p className="text-sm text-muted-foreground">
                    Checking Account • ****1234
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: 2 minutes ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$12,345.67</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Chase Bank</p>
                  <p className="text-sm text-muted-foreground">
                    Savings Account • ****5678
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: 5 minutes ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$8,901.23</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Wells Fargo</p>
                  <p className="text-sm text-muted-foreground">
                    Credit Card • ****9012
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: 1 hour ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">-$1,234.56</p>
                <p className="text-xs text-muted-foreground">
                  Credit limit: $5,000
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">American Express</p>
                  <p className="text-sm text-muted-foreground">
                    Credit Card • ****3456
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: 30 minutes ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">-$567.89</p>
                <p className="text-xs text-muted-foreground">
                  Credit limit: $10,000
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Monitor the health of your account connections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-800">Bank of America</p>
                  <p className="text-sm text-green-700">
                    Connected and syncing
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-800">Chase Bank</p>
                  <p className="text-sm text-green-700">
                    Connected and syncing
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-yellow-800">Wells Fargo</p>
                  <p className="text-sm text-yellow-700">
                    Connection needs attention
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-800">American Express</p>
                  <p className="text-sm text-green-700">
                    Connected and syncing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>
              Your financial data is protected with bank-level security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">256-bit Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    Bank-level security protocols
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Read-Only Access</p>
                  <p className="text-sm text-muted-foreground">
                    We can&apos;t make changes to your accounts
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">SOC 2 Compliant</p>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade security standards
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DashboardFooter />
    </div>
  );
}
