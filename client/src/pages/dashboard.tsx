import { useEffect } from "react";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ConnectGmailPrompt } from "@/components/dashboard/connect-gmail-prompt";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { MarketingBanner } from "@/components/dashboard/marketing-banner";
import { SuccessStories } from "@/components/dashboard/success-stories";
import { Helmet } from "react-helmet";

export default function DashboardPage() {
  const { isConnected, refetchStatus } = useGmailAuth();
  
  // Check Gmail status on mount
  useEffect(() => {
    refetchStatus();
  }, [refetchStatus]);
  
  return (
    <>
      <Helmet>
        <title>Dashboard | MailConnect</title>
        <meta name="description" content="Manage your email marketing campaigns, track performance, and send personalized emails to your audience." />
      </Helmet>
      
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Gmail Connect Prompt */}
                <ConnectGmailPrompt />
                
                {/* Stats Cards */}
                {isConnected && <StatsCards />}
                
                {/* Recent Activity */}
                {isConnected && <RecentActivity />}
                
                {/* Marketing Banner */}
                <MarketingBanner />
                
                {/* Success Stories */}
                <SuccessStories />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
