import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Search, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UtilityRequestService, { UtilityRequest } from "@/services/utilityRequest.service";

const UtilityRequests = () => {
  const [requests, setRequests] = useState<UtilityRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [newRequestOpen, setNewRequestOpen] = useState<boolean>(false);
  
  // New request form state
  const [itemName, setItemName] = useState<string>("");
  const [itemType, setItemType] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [urgency, setUrgency] = useState<string>("Medium");
  const [reason, setReason] = useState<string>("");
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchUtilityRequests();
  }, []);

  const fetchUtilityRequests = async () => {
    try {
      setLoading(true);
      const response = await UtilityRequestService.getUtilityRequests();
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching utility requests:", error);
      toast.error("Failed to load utility requests");
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !itemType || !quantity || !urgency || !reason) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      await UtilityRequestService.createUtilityRequest({
        itemName,
        itemType: itemType as any,
        quantity: parseInt(quantity),
        urgency: urgency as any,
        reason
      });
      
      toast.success("Utility request created successfully");
      setNewRequestOpen(false);
      resetForm();
      fetchUtilityRequests();
    } catch (error) {
      console.error("Error creating utility request:", error);
      toast.error("Failed to create utility request");
    } finally {
      setFormSubmitting(false);
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemType("");
    setQuantity("1");
    setUrgency("Medium");
    setReason("");
  };

  // Filter requests based on search query and tab
  const filterRequests = (status: "pending" | "approved" | "rejected") => {
    return requests
      .filter(request => request.status === status)
      .filter(request => 
        request.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const pendingRequests = filterRequests("pending");
  const approvedRequests = filterRequests("approved");
  const rejectedRequests = filterRequests("rejected");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="doctor">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Utility Requests</h1>
            <p className="text-muted-foreground">
              Request medical equipment and supplies
            </p>
          </div>
          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreateRequest}>
                <DialogHeader>
                  <DialogTitle>Create New Utility Request</DialogTitle>
                  <DialogDescription>
                    Fill in the details to request medical equipment or supplies.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g., Stethoscope, Surgical Gloves"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="itemType">Item Type</Label>
                    <Select value={itemType} onValueChange={setItemType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Medicine">Medicine</SelectItem>
                        <SelectItem value="Consumable">Consumable</SelectItem>
                        <SelectItem value="Device">Device</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Request</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain why you need this item and how it will be used"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setNewRequestOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formSubmitting}>
                    {formSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>My Utility Requests</CardTitle>
            <CardDescription>
              {requests.length > 0 
                ? `You have ${pendingRequests.length} pending requests`
                : "No utility requests found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">
                    Pending ({pendingRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved ({approvedRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({rejectedRequests.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-4 mt-4">
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No pending requests found
                    </div>
                  ) : (
                    pendingRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-yellow-100">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.itemName}</h3>
                              {getStatusBadge(request.status)}
                              <Badge variant="outline">{request.itemType}</Badge>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Qty: {request.quantity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Urgency: {request.urgency}
                            </p>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Requested on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="approved" className="space-y-4 mt-4">
                  {approvedRequests.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No approved requests found
                    </div>
                  ) : (
                    approvedRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.itemName}</h3>
                              {getStatusBadge(request.status)}
                              <Badge variant="outline">{request.itemType}</Badge>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Qty: {request.quantity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Urgency: {request.urgency}
                            </p>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                            {request.adminNotes && (
                              <p className="text-sm mt-2 text-green-600">
                                <span className="font-medium">Admin Notes:</span> {request.adminNotes}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Approved on {new Date(request.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="rejected" className="space-y-4 mt-4">
                  {rejectedRequests.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No rejected requests found
                    </div>
                  ) : (
                    rejectedRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-red-100">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.itemName}</h3>
                              {getStatusBadge(request.status)}
                              <Badge variant="outline">{request.itemType}</Badge>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Qty: {request.quantity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Urgency: {request.urgency}
                            </p>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                            {request.adminNotes && (
                              <p className="text-sm mt-2 text-red-600">
                                <span className="font-medium">Reason for rejection:</span> {request.adminNotes}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Rejected on {new Date(request.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setItemName(request.itemName);
                            setItemType(request.itemType);
                            setQuantity(request.quantity.toString());
                            setUrgency(request.urgency);
                            setReason(request.reason);
                            setNewRequestOpen(true);
                          }}
                        >
                          Request Again
                        </Button>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UtilityRequests;