import { useState } from "react";
import { Helmet } from "react-helmet";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { useSendEmail, useRecipientLists } from "@/hooks/use-email";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "@/components/ui/editor";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ComposePage() {
  const { isConnected } = useGmailAuth();
  const { sendEmail, isLoading } = useSendEmail();
  const { recipientLists, isLoading: loadingLists } = useRecipientLists();

  // Form state
  const [emailType, setEmailType] = useState<"single" | "bulk">("single");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [listId, setListId] = useState<string>("");
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      // Validate form
      if (emailType === "single" && !to) {
        throw new Error("Recipient email is required");
      }

      if (emailType === "bulk" && !listId) {
        throw new Error("Please select a recipient list");
      }

      if (!subject) {
        throw new Error("Subject is required");
      }

      if (!body) {
        throw new Error("Message body is required");
      }

      // Prepare data based on email type
      const emailData = {
        subject,
        body,
        ...(emailType === "single" ? { to } : { listId: parseInt(listId) }),
        ...(scheduleDate ? { scheduledFor: scheduleDate.toISOString() } : {})
      };

      // Send email
      await sendEmail(emailData);

      // Reset form after successful send
      if (!scheduleDate) {
        resetForm();
      }
    } catch (error) {
      setFormError((error as Error).message);
    }
  };

  const resetForm = () => {
    setEmailType("single");
    setTo("");
    setSubject("");
    setBody("");
    setListId("");
    setScheduleDate(undefined);
    setShowScheduleOptions(false);
  };

  const toggleScheduleOptions = () => {
    setShowScheduleOptions(!showScheduleOptions);
    if (!showScheduleOptions) {
      // Set default date to tomorrow at current time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow);
    } else {
      setScheduleDate(undefined);
    }
  };

  return (
    <>
      <Helmet>
        <title>Compose Email | MailConnect</title>
        <meta name="description" content="Compose and send personalized emails to individuals or groups. Schedule emails for later delivery." />
      </Helmet>

      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Topbar />

          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Compose Email</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {!isConnected ? (
                  <div className="mt-6">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please connect your Gmail account before composing emails.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>New Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit}>
                        <Tabs 
                          value={emailType} 
                          onValueChange={(value) => setEmailType(value as "single" | "bulk")}
                          className="w-full mb-6"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="single">Single Email</TabsTrigger>
                            <TabsTrigger value="bulk">Bulk Email</TabsTrigger>
                          </TabsList>
                          <TabsContent value="single" className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="email-to">To</Label>
                                <Input
                                  id="email-to"
                                  type="email"
                                  placeholder="recipient@example.com"
                                  value={to}
                                  onChange={(e) => setTo(e.target.value)}
                                />
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="bulk" className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="recipient-list">Recipient List</Label>
                                <Select
                                  value={listId}
                                  onValueChange={setListId}
                                >
                                  <SelectTrigger id="recipient-list">
                                    <SelectValue placeholder="Select a recipient list" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {loadingLists ? (
                                      <SelectItem value="loading" disabled>Loading lists...</SelectItem>
                                    ) : recipientLists.length === 0 ? (
                                      <SelectItem value="empty" disabled>No recipient lists available</SelectItem>
                                    ) : (
                                      recipientLists.map((list) => {
                                        const recipientsForList = list.recipients || [];
                                        return (
                                          <SelectItem key={list.id} value={list.id.toString()}>
                                            {list.name} ({recipientsForList.length} recipients)
                                          </SelectItem>
                                        );
                                      })
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email-subject">Subject</Label>
                            <Input
                              id="email-subject"
                              type="text"
                              placeholder="Email subject"
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="email-body">Message</Label>
                            <Editor
                              value={body}
                              onChange={setBody}
                              placeholder="Write your message here..."
                              minRows={12}
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2">
                            <div>
                              <Button 
                                type="button" 
                                variant="link" 
                                onClick={toggleScheduleOptions}
                                className="p-0 h-auto"
                              >
                                <Calendar className="mr-1 h-5 w-5" />
                                {showScheduleOptions ? "Don't schedule" : "Schedule for later"}
                              </Button>

                              {showScheduleOptions && (
                                <div className="mt-3">
                                  <Label htmlFor="schedule-datetime">Select Date & Time</Label>
                                  <DateTimePicker
                                    date={scheduleDate}
                                    setDate={setScheduleDate}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="mt-4 sm:mt-0">
                              <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                {Intl.DateTimeFormat().resolvedOptions().timeZone}
                              </span>
                            </div>
                          </div>

                          {formError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                          )}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={resetForm}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isLoading}
                            className={showScheduleOptions ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                          >
                            {isLoading 
                              ? (showScheduleOptions ? "Scheduling..." : "Sending...") 
                              : (showScheduleOptions ? "Schedule" : "Send")}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}