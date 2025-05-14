import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendEmail, getEmails, getScheduledEmails, deleteEmail, getRecipientLists } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Hook for sending emails
export function useSendEmail() {
  const { toast } = useToast();
  const [isScheduling, setIsScheduling] = useState(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: sendEmail,
    onSuccess: (data) => {
      toast({
        title: isScheduling ? "Email Scheduled" : "Email Sent",
        description: isScheduling ? "Your email has been scheduled successfully." : "Your email has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: isScheduling ? "Schedule Failed" : "Send Failed",
        description: (error as Error).message || "There was an error processing your email.",
        variant: "destructive",
      });
    },
  });

  const handleSend = (formData: {
    subject: string;
    body: string;
    to?: string;
    listId?: number;
    scheduledFor?: string;
  }) => {
    setIsScheduling(!!formData.scheduledFor);
    mutate(formData);
  };

  return {
    sendEmail: handleSend,
    isLoading: isPending,
    isError,
    error,
  };
}

// Hook for getting emails
export function useEmails(status?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/emails", status],
    queryFn: () => getEmails(status),
  });

  return {
    emails: data || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook for getting scheduled emails
export function useScheduledEmails() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/emails/scheduled"],
    queryFn: getScheduledEmails,
  });

  return {
    scheduledEmails: data || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook for deleting an email
export function useDeleteEmail() {
  const { toast } = useToast();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => {
      toast({
        title: "Email Deleted",
        description: "The email has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: (error as Error).message || "There was an error deleting the email.",
        variant: "destructive",
      });
    },
  });

  return {
    deleteEmail: mutate,
    isDeleting: isPending,
    isError,
    error,
  };
}

// Hook for getting recipient lists
export function useRecipientLists() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/recipient-lists"],
    queryFn: getRecipientLists,
  });

  return {
    recipientLists: data || [],
    isLoading,
    error,
    refetch,
  };
}
