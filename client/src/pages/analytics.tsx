import { useState } from "react";
import { Helmet } from "react-helmet";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview, getEmails } from "@/lib/api";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { AlertCircle, Mail, Calendar, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";
import { format, subDays, parseISO, isAfter } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  const { isConnected } = useGmailAuth();
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days");
  
  // Analytics overview
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ["/api/analytics/overview"],
    queryFn: getAnalyticsOverview,
    enabled: isConnected,
  });
  
  // Emails for charting
  const { data: emailsData, isLoading: emailsLoading } = useQuery({
    queryKey: ["/api/emails", "sent"],
    queryFn: () => getEmails("sent"),
    enabled: isConnected,
  });

  // Get date range for filtering
  const getRangeDate = () => {
    switch (timeRange) {
      case "7days":
        return subDays(new Date(), 7);
      case "30days":
        return subDays(new Date(), 30);
      case "90days":
        return subDays(new Date(), 90);
      default:
        return subDays(new Date(), 30);
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!emailsData) return { emailOverTime: [], statusDistribution: [] };
    
    const rangeDate = getRangeDate();
    const filteredEmails = emailsData.filter(email => 
      email.sentAt && isAfter(parseISO(email.sentAt), rangeDate)
    );
    
    // Email over time data
    const emailsByDay = filteredEmails.reduce((acc: any, email) => {
      const day = format(parseISO(email.sentAt!), "MMM d");
      if (!acc[day]) acc[day] = 0;
      acc[day]++;
      return acc;
    }, {});
    
    const emailOverTime = Object.keys(emailsByDay).map(day => ({
      date: day,
      count: emailsByDay[day],
    }));
    
    // Email status distribution
    const statusCounts = filteredEmails.reduce((acc: any, email) => {
      if (!acc[email.status]) acc[email.status] = 0;
      acc[email.status]++;
      return acc;
    }, {});
    
    const statusDistribution = Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }));
    
    return { emailOverTime, statusDistribution };
  };

  const chartData = prepareChartData();
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <Helmet>
        <title>Analytics | MailConnect</title>
        <meta name="description" content="View analytics and performance metrics for your email campaigns. Track open rates, clicks, and more." />
      </Helmet>

      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {!isConnected ? (
                  <div className="mt-6">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please connect your Gmail account to view analytics.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                              <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-500 truncate">
                                Total Emails Sent
                              </p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {overviewLoading ? "..." : overviewData?.totalSent || 0}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                              <PieChartIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-500 truncate">
                                Open Rate
                              </p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {overviewLoading ? "..." : overviewData?.openRate || "0%"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                              <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-500 truncate">
                                Scheduled Emails
                              </p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {overviewLoading ? "..." : overviewData?.scheduled || 0}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Time Range Filter */}
                    <div className="flex justify-end">
                      <div className="inline-flex rounded-md shadow-sm">
                        <Button
                          variant={timeRange === "7days" ? "default" : "outline"}
                          className={`rounded-l-md ${timeRange === "7days" ? "" : "hover:bg-gray-50"}`}
                          onClick={() => setTimeRange("7days")}
                        >
                          Last 7 Days
                        </Button>
                        <Button
                          variant={timeRange === "30days" ? "default" : "outline"}
                          className={`-ml-px ${timeRange === "30days" ? "" : "hover:bg-gray-50"}`}
                          onClick={() => setTimeRange("30days")}
                        >
                          Last 30 Days
                        </Button>
                        <Button
                          variant={timeRange === "90days" ? "default" : "outline"}
                          className={`-ml-px rounded-r-md ${timeRange === "90days" ? "" : "hover:bg-gray-50"}`}
                          onClick={() => setTimeRange("90days")}
                        >
                          Last 90 Days
                        </Button>
                      </div>
                    </div>

                    {/* Charts */}
                    <Tabs defaultValue="emailOverTime" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="emailOverTime" className="flex items-center">
                          <BarChartIcon className="mr-2 h-4 w-4" />
                          Emails Over Time
                        </TabsTrigger>
                        <TabsTrigger value="statusDistribution" className="flex items-center">
                          <PieChartIcon className="mr-2 h-4 w-4" />
                          Email Status Distribution
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="emailOverTime">
                        <Card>
                          <CardHeader>
                            <CardTitle>Emails Sent Over Time</CardTitle>
                            <CardDescription>
                              Number of emails sent each day over the selected time period
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="h-[400px]">
                            {emailsLoading ? (
                              <div className="flex h-full items-center justify-center">
                                Loading chart data...
                              </div>
                            ) : chartData.emailOverTime.length === 0 ? (
                              <div className="flex h-full items-center justify-center flex-col">
                                <BarChartIcon className="h-16 w-16 text-gray-300 mb-4" />
                                <p className="text-gray-500">No data available for the selected period</p>
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={chartData.emailOverTime}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="count" name="Emails Sent" fill="#3B82F6" />
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="statusDistribution">
                        <Card>
                          <CardHeader>
                            <CardTitle>Email Status Distribution</CardTitle>
                            <CardDescription>
                              Distribution of email statuses over the selected time period
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="h-[400px]">
                            {emailsLoading ? (
                              <div className="flex h-full items-center justify-center">
                                Loading chart data...
                              </div>
                            ) : chartData.statusDistribution.length === 0 ? (
                              <div className="flex h-full items-center justify-center flex-col">
                                <PieChartIcon className="h-16 w-16 text-gray-300 mb-4" />
                                <p className="text-gray-500">No data available for the selected period</p>
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={chartData.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {chartData.statusDistribution.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
