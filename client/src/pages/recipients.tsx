import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipients, getRecipientLists, createRecipient, createRecipientList, deleteRecipient, deleteRecipientList } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Users, ListPlus } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schemas for form validation
const recipientSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  listId: z.string().optional(),
});

const listSchema = z.object({
  name: z.string().min(1, "List name is required"),
  description: z.string().optional(),
});

type RecipientFormValues = z.infer<typeof recipientSchema>;
type ListFormValues = z.infer<typeof listSchema>;

export default function RecipientsPage() {
  const { toast } = useToast();
  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>("");

  // Queries
  const { data: lists = [], isLoading: listsLoading } = useQuery({
    queryKey: ["/api/recipient-lists"],
    queryFn: getRecipientLists,
  });

  const { data: recipients = [], isLoading: recipientsLoading } = useQuery({
    queryKey: ["/api/recipients", selectedListId !== "all" ? parseInt(selectedListId) : undefined],
    queryFn: () => getRecipients(selectedListId !== "all" ? parseInt(selectedListId) : undefined),
  });

  // Add recipient form
  const recipientForm = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      email: "",
      name: "",
      listId: selectedListId || "",
    },
  });

  // Add list form
  const listForm = useForm<ListFormValues>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Mutations
  const createRecipientMutation = useMutation({
    mutationFn: (data: { email: string; name?: string; listId?: number }) => createRecipient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
      setIsAddRecipientOpen(false);
      recipientForm.reset();
      toast({
        title: "Success",
        description: "Recipient added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add recipient",
        variant: "destructive",
      });
    },
  });

  const createListMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) => createRecipientList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipient-lists"] });
      setIsAddListOpen(false);
      listForm.reset();
      toast({
        title: "Success",
        description: "List created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create list",
        variant: "destructive",
      });
    },
  });

  const deleteRecipientMutation = useMutation({
    mutationFn: (id: number) => deleteRecipient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
      toast({
        title: "Success",
        description: "Recipient deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete recipient",
        variant: "destructive",
      });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: number) => deleteRecipientList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipient-lists"] });
      if (selectedListId) {
        setSelectedListId("");
      }
      toast({
        title: "Success",
        description: "List deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete list",
        variant: "destructive",
      });
    },
  });

  // Form submit handlers
  const onSubmitRecipient = (data: RecipientFormValues) => {
    createRecipientMutation.mutate({
      email: data.email,
      name: data.name || undefined,
      listId: data.listId && data.listId !== 'none' ? parseInt(data.listId) : undefined,
    });
  };

  const onSubmitList = (data: ListFormValues) => {
    createListMutation.mutate({
      name: data.name,
      description: data.description || undefined,
    });
  };

  // Reset form when dialog opens
  const handleOpenAddRecipient = () => {
    recipientForm.reset({ 
      email: "", 
      name: "", 
      listId: selectedListId || "" 
    });
    setIsAddRecipientOpen(true);
  };

  const handleOpenAddList = () => {
    listForm.reset({ name: "", description: "" });
    setIsAddListOpen(true);
  };

  const handleDeleteRecipient = (id: number) => {
    if (confirm("Are you sure you want to delete this recipient?")) {
      deleteRecipientMutation.mutate(id);
    }
  };

  const handleDeleteList = (id: number) => {
    if (confirm("Are you sure you want to delete this list? This will not delete the recipients.")) {
      deleteListMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Recipients | MailConnect</title>
        <meta name="description" content="Manage your email recipients and recipient lists. Organize contacts for targeted email campaigns." />
      </Helmet>

      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Recipients</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Tabs defaultValue="recipients" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recipients">Recipients</TabsTrigger>
                    <TabsTrigger value="lists">Recipient Lists</TabsTrigger>
                  </TabsList>
                  
                  {/* Recipients Tab */}
                  <TabsContent value="recipients" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Recipients</CardTitle>
                        <div className="flex space-x-2">
                          <Select
                            value={selectedListId}
                            onValueChange={setSelectedListId}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by list" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Recipients</SelectItem>
                              {lists.map((list) => (
                                <SelectItem key={list.id} value={list.id.toString()}>
                                  {list.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button onClick={handleOpenAddRecipient}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Recipient
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {recipientsLoading ? (
                          <div className="text-center py-4">Loading recipients...</div>
                        ) : recipients.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No recipients</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a recipient.</p>
                            <div className="mt-6">
                              <Button onClick={handleOpenAddRecipient}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Recipient
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>List</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recipients.map((recipient) => (
                                <TableRow key={recipient.id}>
                                  <TableCell className="font-medium">{recipient.email}</TableCell>
                                  <TableCell>{recipient.name || "-"}</TableCell>
                                  <TableCell>
                                    {recipient.listId ? 
                                      lists.find(l => l.id === recipient.listId)?.name || `List ${recipient.listId}` 
                                      : "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteRecipient(recipient.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Lists Tab */}
                  <TabsContent value="lists" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Recipient Lists</CardTitle>
                        <Button onClick={handleOpenAddList}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create List
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {listsLoading ? (
                          <div className="text-center py-4">Loading lists...</div>
                        ) : lists.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <ListPlus className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No recipient lists</h3>
                            <p className="mt-1 text-sm text-gray-500">Create lists to organize your recipients.</p>
                            <div className="mt-6">
                              <Button onClick={handleOpenAddList}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create List
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Recipients</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {lists.map((list) => (
                                <TableRow key={list.id}>
                                  <TableCell className="font-medium">{list.name}</TableCell>
                                  <TableCell>{list.description || "-"}</TableCell>
                                  <TableCell>
                                    {recipients.filter(r => r.listId === list.id).length}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteList(list.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Recipient Dialog */}
      <Dialog open={isAddRecipientOpen} onOpenChange={setIsAddRecipientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Recipient</DialogTitle>
          </DialogHeader>
          <Form {...recipientForm}>
            <form onSubmit={recipientForm.handleSubmit(onSubmitRecipient)} className="space-y-4">
              <FormField
                control={recipientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recipientForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recipientForm.control}
                name="listId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient List (Optional)</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a list" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No List</SelectItem>
                        {lists.map((list) => (
                          <SelectItem key={list.id} value={list.id.toString()}>
                            {list.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddRecipientOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRecipientMutation.isPending}>
                  {createRecipientMutation.isPending ? "Adding..." : "Add Recipient"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add List Dialog */}
      <Dialog open={isAddListOpen} onOpenChange={setIsAddListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Recipient List</DialogTitle>
          </DialogHeader>
          <Form {...listForm}>
            <form onSubmit={listForm.handleSubmit(onSubmitList)} className="space-y-4">
              <FormField
                control={listForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Newsletter Subscribers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={listForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Monthly newsletter recipients" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddListOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createListMutation.isPending}>
                  {createListMutation.isPending ? "Creating..." : "Create List"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
