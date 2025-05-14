import { useEmails } from "@/hooks/use-email";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar } from "lucide-react";

export function RecentActivity() {
  const { emails, isLoading } = useEmails("sent");
  
  if (isLoading) {
    return (
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 py-4 last:border-0">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="mt-2 flex justify-between">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Sort emails by sent date
  const sortedEmails = [...(emails || [])].sort((a, b) => {
    return new Date(b.sentAt || b.createdAt).getTime() - new Date(a.sentAt || a.createdAt).getTime();
  }).slice(0, 5); // Show only the 5 most recent
  
  if (sortedEmails.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {sortedEmails.map((email) => (
              <li key={email.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary truncate">
                    {email.subject}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {email.listId ? `List ${email.listId}` : (email.to || "No recipient")}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>
                      {email.sentAt 
                        ? `Sent on ${format(new Date(email.sentAt), "MMM d, yyyy")}`
                        : `Created on ${format(new Date(email.createdAt), "MMM d, yyyy")}`
                      }
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
