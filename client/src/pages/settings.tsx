import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/lib/auth";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, User, Settings as SettingsIcon, Bell, Lock, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { isConnected, gmailEmail, connect, isLoading } = useGmailAuth();
  const { toast } = useToast();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);
  
  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app this would call an API to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app this would call an API to change the password
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    });
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  // Handle notification settings
  const handleNotificationChange = () => {
    setEmailNotifications(!emailNotifications);
    
    // In a real app this would call an API to update notification settings
    toast({
      title: "Notification Settings Updated",
      description: `Email notifications ${!emailNotifications ? "enabled" : "disabled"}.`,
    });
  };
  
  // Handle account logout
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Settings | MailConnect</title>
        <meta name="description" content="Configure your account settings, manage Gmail connections, and customize notification preferences." />
      </Helmet>

      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Tabs defaultValue="account" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="account" className="flex items-center justify-center">
                      <User className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                    <TabsTrigger value="gmail" className="flex items-center justify-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Gmail Connection</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center justify-center">
                      <Bell className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center justify-center">
                      <Lock className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Account Tab */}
                  <TabsContent value="account" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                          Manage your account details and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4 mb-6">
                          <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                              {user?.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium">{user?.username}</h3>
                            <p className="text-sm text-gray-500">{user?.email || "No email set"}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                value={user?.username || ""}
                                disabled
                              />
                              <p className="text-sm text-gray-500">
                                Username cannot be changed
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                              />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit">
                              Update Profile
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>
                          Proceed with caution
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Log out of your account</h3>
                              <p className="text-sm text-gray-500">
                                You'll need to log back in to access your account
                              </p>
                            </div>
                            <Button 
                              variant="destructive" 
                              onClick={handleLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log Out
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Gmail Connection Tab */}
                  <TabsContent value="gmail" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Gmail Connection</CardTitle>
                        <CardDescription>
                          Connect your Gmail account to send emails through MailConnect
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Connection Status</h3>
                              <p className="text-sm text-gray-500">
                                {isConnected 
                                  ? `Connected as ${gmailEmail}` 
                                  : "Not connected"}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isConnected 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {isConnected ? "Connected" : "Not Connected"}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">
                                {isConnected ? "Reconnect Gmail" : "Connect Gmail"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isConnected 
                                  ? "Reconnect your Gmail account if you're experiencing issues" 
                                  : "Connect your Gmail account to send emails"}
                              </p>
                            </div>
                            <Button 
                              onClick={connect} 
                              disabled={isLoading}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              {isLoading 
                                ? "Connecting..." 
                                : (isConnected ? "Reconnect" : "Connect")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>
                          Manage how and when you receive notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Email Notifications</h3>
                              <p className="text-sm text-gray-500">
                                Receive email notifications about your MailConnect activity
                              </p>
                            </div>
                            <Switch
                              checked={emailNotifications}
                              onCheckedChange={handleNotificationChange}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <h3 className="font-medium">Desktop Notifications</h3>
                              <p className="text-sm text-gray-500">
                                Receive desktop notifications when in the app (Coming soon)
                              </p>
                            </div>
                            <Switch disabled />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <h3 className="font-medium">Mobile Notifications</h3>
                              <p className="text-sm text-gray-500">
                                Receive push notifications on your mobile device (Coming soon)
                              </p>
                            </div>
                            <Switch disabled />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Security Tab */}
                  <TabsContent value="security" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Manage your password and security preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter your current password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter your new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm your new password"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              type="submit"
                              disabled={!currentPassword || !newPassword || !confirmPassword}
                            >
                              Change Password
                            </Button>
                          </div>
                        </form>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <h3 className="font-medium">Two-Factor Authentication</h3>
                              <p className="text-sm text-gray-500">
                                Add an extra layer of security to your account (Coming soon)
                              </p>
                            </div>
                            <Button disabled>Enable</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
