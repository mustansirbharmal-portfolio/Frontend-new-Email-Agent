import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { Link } from "lucide-react";
import { Bell } from "lucide-react";

export function Topbar() {
  const { user } = useAuth();
  const { isConnected, connect, isLoading } = useGmailAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex">
          <div className="w-full flex md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                id="search"
                className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Gmail Connect Button */}
          {!isConnected ? (
            <Button
              variant="outline"
              className="flex items-center mx-2 px-3 py-1 border border-primary text-primary rounded-md hover:bg-blue-50 text-sm font-medium"
              onClick={connect}
              disabled={isLoading}
            >
              <Link className="mr-2 h-5 w-5" />
              Connect Gmail
            </Button>
          ) : (
            <div className="flex items-center mx-2 px-3 py-1 bg-green-100 text-success rounded-md text-sm font-medium">
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Gmail Connected
            </div>
          )}
          
          {/* Notification bell */}
          <button className="p-1 bg-white text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
