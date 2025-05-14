import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function ConnectGmailPrompt() {
  const { isConnected, connect, isLoading } = useGmailAuth();
  
  if (isConnected) {
    return null;
  }
  
  return (
    <div className="py-4">
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900">Connect your Gmail account</h3>
              <p className="mt-1 text-sm text-gray-500">
                To start sending emails, connect your Gmail account to MailConnect.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button 
                onClick={connect} 
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isLoading ? "Connecting..." : "Connect Gmail"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
