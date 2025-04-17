import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Search, Clock, CheckCircle, XCircle, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UtilityRequestService, { UtilityRequest } from "@/services/utilityRequest.service";

const UtilityRequestManagement = () => {
  const [requests, setRequests] = useState<UtilityRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Action dialogs state
  const [selectedRequest, setSelectedRequest] = useState<UtilityRequest | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

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

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      setActionLoading(true);
      await UtilityRequestService.updateUtilityRequestStatus(
        selectedRequest.id,
        'approved',
        adminNotes
      );
      
      toast.success("Request approved successfully");
      setApproveDialogOpen(false);
      setAdminNotes("");
      fetchUtilityRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    if (!adminNotes) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    try {
      setActionLoading(true);
      await UtilityRequestService.updateUtilityRequestStatus(
        selectedRequest.id,
        'rejected',
        adminNotes
      );
      
      toast.success("Request rejected successfully");
      setRejectDialogOpen(false);
      setAdminNotes("");
      fetchUtilityRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter requests based on search query and status
  const filterRequests = (status: "pending" | "approved" | "rejected" | "all") => {
    return requests
      .filter(request => 
        status === "all" ? true : request.status === status
      )
      .filter(request => 
        statusFilter === "all" 
          ? true 
          : request.status === statusFilter
      )
      .filter(request => 
        request.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.doctor.name && request.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (request.doctor.specialization && request.doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  const allRequests = filterRequests("all");
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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Low</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'High':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'Critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utility Request Management</h1>
          <p className="text-muted-foreground">
            Review and manage doctors' requests for medical equipment and supplies
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by item, doctor, or specialization..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Utility Requests</CardTitle>
            <CardDescription>
              {requests.length > 0 
                ? `There are ${pendingRequests.length} pending requests that need your attention`
                : "No utility requests found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    All ({allRequests.length})
                  </TabsTrigger>
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
                
                {["all", "pending", "approved", "rejected"].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-4">
                    {filterRequests(tabValue as any).length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No {tabValue !== "all" ? tabValue : ""} requests found
                      </div>
                    ) : (
                      filterRequests(tabValue as any).map((request) => (
                        <div 
                          key={request.id} 
                          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                        >
                          <div className="flex gap-4 items-start">
                            <div className={`p-2 rounded-full ${
                              request.status === 'pending' ? 'bg-yellow-100' : 
                              request.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {request.status === 'pending' ? (
                                <Clock className="h-5 w-5 text-yellow-600" />
                              ) : request.status === 'approved' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-medium">{request.itemName}</h3>
                                {getStatusBadge(request.status)}
                                <Badge variant="outline">{request.itemType}</Badge>
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  Qty: {request.quantity}
                                </Badge>
                                {getUrgencyBadge(request.urgency)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Requested by: <span className="font-medium">{request.doctor.name}</span> ({request.doctor.specialization})
                              </p>
                              <p className="text-sm mt-2">
                                <span className="font-medium">Reason:</span> {request.reason}
                              </p>
                              {request.adminNotes && (
                                <p className={`text-sm mt-2 ${
                                  request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  <span className="font-medium">Admin Notes:</span> {request.adminNotes}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Requested on {new Date(request.createdAt).toLocaleDateString()}
                                {request.status !== 'pending' && (
                                  <> • Updated on {new Date(request.updatedAt).toLocaleDateString()}</>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setApproveDialogOpen(true);
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Approve Utility Request</DialogTitle>
            <DialogDescription>
              You are approving the request for {selectedRequest?.itemName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adminNotes">Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes or instructions for the doctor"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveRequest}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : "Approve Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Utility Request</DialogTitle>
            <DialogDescription>
              You are rejecting the request for {selectedRequest?.itemName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejectReason">Reason for Rejection <span className="text-red-500">*</span></Label>
              <Textarea
                id="rejectReason"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Explain why this request is being rejected"
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleRejectRequest}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UtilityRequestManagement;