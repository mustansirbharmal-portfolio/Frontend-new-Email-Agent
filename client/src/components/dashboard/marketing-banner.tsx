import { Mail, Users, Calendar } from "lucide-react";

export function MarketingBanner() {
  return (
    <div className="mt-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Banner Image & Overlay */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <svg 
              className="absolute inset-0 w-full h-full text-white opacity-10" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="currentColor" />
              <path d="M0,0 C40,40 60,40 100,0 L100,100 L0,100 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Streamline Your Email Marketing</h2>
              <p className="mt-2 text-white text-opacity-90 max-w-lg mx-auto">
                Connect your Gmail account to start sending personalized emails to your audience with just a few clicks.
              </p>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Single Emails</h3>
            <p className="mt-1 text-sm text-gray-500">
              Send personalized emails to individual contacts with rich formatting.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Bulk Sending</h3>
            <p className="mt-1 text-sm text-gray-500">
              Reach your entire audience at once with mass email campaigns.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Schedule Emails</h3>
            <p className="mt-1 text-sm text-gray-500">
              Plan ahead by scheduling emails to be sent at the perfect time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
