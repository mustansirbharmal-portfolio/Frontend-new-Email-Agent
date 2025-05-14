import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { initiateGmailAuth, checkGmailConnection } from "@/lib/gmail";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useGmailAuth() {
  const { user, updateUserGmailStatus } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Query to check Gmail connection status
  const { 
    data: gmailStatus,
    isLoading: isCheckingStatus,
    refetch: refetchGmailStatus
  } = useQuery({
    queryKey: ["/api/gmail/status"],
    queryFn: checkGmailConnection,
    enabled: Boolean(user),
    retry: false,
    onSuccess: (data) => {
      if (user && data.connected !== user.gmailConnected) {
        updateUserGmailStatus(data.connected);
      }
    },
    onError: () => {
      toast({
        title: "Connection check failed",
        description: "Unable to check Gmail connection status.",
        variant: "destructive"
      });
    }
  });

  // Mutation to connect Gmail
  const { mutate: connectGmail, isPending: isConnectingGmail } = useMutation({
    mutationFn: initiateGmailAuth,
    onMutate: () => {
      setIsConnecting(true);
      toast({
        title: "Connecting to Gmail",
        description: "You'll be redirected to Google for authentication."
      });
    },
    onError: (error) => {
      setIsConnecting(false);
      toast({
        title: "Connection failed",
        description: (error as Error).message || "Failed to connect to Gmail",
        variant: "destructive"
      });
    }
  });

  // Handle the OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      
      if (code) {
        try {
          // The actual callback is handled by the server
          // Just update the UI status by refetching
          await refetchGmailStatus();
          toast({
            title: "Connected to Gmail",
            description: "Your Gmail account is now connected.",
            variant: "default"
          });
        } catch (error) {
          toast({
            title: "Connection failed",
            description: (error as Error).message || "Failed to verify Gmail connection",
            variant: "destructive"
          });
        } finally {
          setIsConnecting(false);
          // Remove the query parameters from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleCallback();
  }, [refetchGmailStatus, toast]);

  const handleConnect = useCallback(() => {
    connectGmail();
  }, [connectGmail]);

  return {
    isConnected: gmailStatus?.connected || false,
    gmailEmail: gmailStatus?.email || null,
    isLoading: isCheckingStatus || isConnectingGmail || isConnecting,
    connect: handleConnect,
    refetchStatus: refetchGmailStatus
  };
}
