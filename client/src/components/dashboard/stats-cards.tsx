import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, CheckCircle, Calendar } from "lucide-react";

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/analytics/overview"],
    queryFn: getAnalyticsOverview,
  });
  
  const stats = [
    {
      id: 1,
      name: "Total Emails Sent",
      value: data?.totalSent || 0,
      icon: <Mail className="h-6 w-6 text-white" />,
      iconBg: "bg-blue-500",
      change: { value: "12%", trend: "up" },
    },
    {
      id: 2,
      name: "Open Rate",
      value: data?.openRate || "0%",
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      iconBg: "bg-green-500",
      change: { value: "3.2%", trend: "up" },
    },
    {
      id: 3,
      name: "Scheduled Emails",
      value: data?.scheduled || 0,
      icon: <Calendar className="h-6 w-6 text-white" />,
      iconBg: "bg-indigo-500",
      change: { value: "", trend: "none" },
    },
  ];
  
  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.id} className="overflow-hidden">
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.iconBg} rounded-md p-3`}>
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    {stat.change.trend !== "none" && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.change.trend === "up" 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        <svg 
                          className={`self-center flex-shrink-0 h-5 w-5 ${
                            stat.change.trend === "up" 
                              ? "text-green-500" 
                              : "text-red-500"
                          }`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={stat.change.trend === "up" 
                              ? "M5 10l7-7m0 0l7 7m-7-7v18" 
                              : "M19 14l-7 7m0 0l-7-7m7 7V3"
                            } 
                          />
                        </svg>
                        <span className="sr-only">
                          {stat.change.trend === "up" ? "Increased by" : "Decreased by"}
                        </span>
                        {stat.change.value}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
