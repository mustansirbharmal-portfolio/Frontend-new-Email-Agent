import { useState } from "react";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { useScheduledEmails } from "@/hooks/use-email";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Mail, Users, AlertCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getRecipientLists } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { deleteEmail } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScheduledPage() {
  const { isConnected } = useGmailAuth();
  const { scheduledEmails, isLoading, refetch } = useScheduledEmails();
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Get recipient lists for display
  const { data: recipientLists = [] } = useQuery({
    queryKey: ["/api/recipient-lists"],
    queryFn: getRecipientLists,
  });

  // Delete email mutation
  const { mutate: deleteEmailMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails/scheduled"] });
      toast({
        title: "Email Deleted",
        description: "Scheduled email has been deleted successfully.",
      });
      setIsDetailsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete scheduled email",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (email: any) => {
    setSelectedEmail(email);
    setIsDetailsOpen(true);
  };

  const handleDeleteEmail = () => {
    if (selectedEmail) {
      deleteEmailMutation(selectedEmail.id);
    }
  };

  const getListName = (listId: number) => {
    const list = recipientLists.find(list => list.id === listId);
    return list ? list.name : `List ${listId}`;
  };

  const getRecipientDisplay = (email: any) => {
    if (email.to) {
      return email.to;
    } else if (email.listId) {
      return getListName(email.listId);
    }
    return "No recipient";
  };

  return (
    <>
      <Helmet>
        <title>Scheduled Emails | MailConnect</title>
        <meta name="description" content="View and manage your scheduled emails. Edit scheduled time or cancel future emails." />
      </Helmet>

      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Scheduled Emails</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {!isConnected ? (
                  <div className="mt-6">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please connect your Gmail account to view scheduled emails.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Upcoming Scheduled Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center py-4">Loading scheduled emails...</div>
                      ) : scheduledEmails.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">No scheduled emails</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You don't have any emails scheduled for delivery.
                          </p>
                          <div className="mt-6">
                            <Button
                              onClick={() => window.location.href = "/compose"}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Compose Scheduled Email
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Subject</TableHead>
                              <TableHead>Recipients</TableHead>
                              <TableHead>Scheduled For</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {scheduledEmails.map((email) => (
                              <TableRow key={email.id}>
                                <TableCell className="font-medium">{email.subject}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                                    {email.listId ? (
                                      <Badge variant="outline" className="bg-blue-50">
                                        {getListName(email.listId)}
                                      </Badge>
                                    ) : (
                                      email.to
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm">
                                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                    {email.scheduledFor 
                                      ? format(new Date(email.scheduledFor), "MMM d, yyyy 'at' h:mm a")
                                      : "Not scheduled"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mr-2"
                                      onClick={() => handleViewDetails(email)}
                                    >
                                      View Details
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedEmail(email);
                                        handleDeleteEmail();
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Email Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Scheduled Email Details</DialogTitle>
            <DialogDescription>
              This email is scheduled to be sent automatically.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmail && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                  <p className="mt-1 text-sm">{selectedEmail.subject}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1 text-sm">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      {selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Recipients</h4>
                  <p className="mt-1 text-sm flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    {getRecipientDisplay(selectedEmail)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Scheduled For</h4>
                  <p className="mt-1 text-sm flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    {selectedEmail.scheduledFor 
                      ? format(new Date(selectedEmail.scheduledFor), "PPpp")
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email Content</h4>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-1">
                  <div className="email-content" dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                </ScrollArea>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmail}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Cancel This Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
