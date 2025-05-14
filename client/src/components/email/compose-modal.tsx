import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "@/components/ui/editor";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecipientSelect } from "@/components/email/recipient-select";
import { useSendEmail } from "@/hooks/use-email";
import { useRecipientLists } from "@/hooks/use-email";
import { Calendar } from "lucide-react";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  // Form state
  const [emailType, setEmailType] = useState<"single" | "bulk">("single");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [listId, setListId] = useState<number | undefined>(undefined);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);

  // Hooks
  const { sendEmail, isLoading } = useSendEmail();
  const { recipientLists, isLoading: loadingLists } = useRecipientLists();

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmailType("single");
      setTo("");
      setSubject("");
      setBody("");
      setListId(undefined);
      setScheduleDate(undefined);
      setShowScheduleOptions(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
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
        ...(emailType === "single" ? { to } : { listId }),
        ...(scheduleDate ? { scheduledFor: scheduleDate.toISOString() } : {})
      };

      // Send email
      await sendEmail(emailData);

      // Close modal after sending
      onClose();
    } catch (error) {
      // Error is handled by useSendEmail hook
      console.error("Form validation error:", error);
    }
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Email Type */}
          <div>
            <Label htmlFor="email-type">Email Type</Label>
            <Select
              value={emailType}
              onValueChange={(value) => setEmailType(value as "single" | "bulk")}
            >
              <SelectTrigger id="email-type">
                <SelectValue placeholder="Select email type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Email</SelectItem>
                <SelectItem value="bulk">Bulk Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipient Field - Single or Bulk based on type */}
          {emailType === "single" ? (
            <div>
              <Label htmlFor="email-to">To</Label>
              <Input
                type="email"
                id="email-to"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="recipient-list">Recipient List</Label>
              <Select
                value={listId?.toString()}
                onValueChange={(value) => setListId(Number(value))}
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
                    recipientLists.map((list) => (
                      <SelectItem key={list.id} value={list.id.toString()}>
                        {list.name} ({list.recipients?.length || 0} recipients)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subject */}
          <div>
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              type="text"
              id="email-subject"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message Body */}
          <div>
            <Label htmlFor="email-body">Message</Label>
            <Editor
              value={body}
              onChange={setBody}
              placeholder="Write your message here..."
            />
          </div>

          {/* Schedule Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {showScheduleOptions ? (
            <Button 
              onClick={handleSend} 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? "Scheduling..." : "Schedule"}
            </Button>
          ) : (
            <Button 
              onClick={handleSend} 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}