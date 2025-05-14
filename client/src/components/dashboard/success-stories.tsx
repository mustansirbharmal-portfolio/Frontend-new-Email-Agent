import { Card, CardContent } from "@/components/ui/card";

export function SuccessStories() {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Email Marketing Success Stories</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="hover:border-gray-400 transition-colors">
          <CardContent className="p-0">
            <a href="#" className="block p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">How Company X increased open rates by 45%</p>
                  <p className="text-sm text-gray-500 truncate">Learn the strategies that transformed their email engagement</p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:border-gray-400 transition-colors">
          <CardContent className="p-0">
            <a href="#" className="block p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">5 Email Scheduling Techniques That Convert</p>
                  <p className="text-sm text-gray-500 truncate">Timing is everything when it comes to email marketing</p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
