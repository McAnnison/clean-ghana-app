import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import StatsCard from "@/components/stats-card";
import MapView from "@/components/map-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Report } from "@shared/schema";
import { ClipboardList, CheckCircle, Users, Clock, MapPin, User, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AgencyDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });

  const { data: agencyStats } = useQuery({
    queryKey: ['/api/agencies/dev-agency/stats'],
  });

  const acceptReport = useMutation({
    mutationFn: async (reportId: string) => {
      return await apiRequest('PATCH', `/api/reports/${reportId}/status`, {
        status: 'assigned',
        agencyId: 'dev-agency-1',
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Accepted",
        description: "The cleanup request has been assigned to your team.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept the request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const unassignedReports = reports.filter(r => r.status === 'reported');
  const assignedReports = reports.filter(r => r.assignedAgencyId === 'dev-agency-1');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Agency Dashboard</h2>
            <p className="text-xl text-gray-600">Manage cleanup requests and coordinate your team efficiently</p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Button className="bg-ghana-blue text-white hover:bg-blue-600" data-testid="button-new-assignment">
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Active Requests"
            value={agencyStats?.activeRequests || assignedReports.length}
            icon={ClipboardList}
            color="bg-gradient-to-r from-ghana-green to-emerald-600"
          />
          <StatsCard
            title="Completed Today"
            value={agencyStats?.completedToday || 8}
            icon={CheckCircle}
            color="bg-gradient-to-r from-ghana-blue to-blue-600"
          />
          <StatsCard
            title="Team Members"
            value={12}
            icon={Users}
            color="bg-gradient-to-r from-ghana-gold to-yellow-600"
          />
          <StatsCard
            title="Response Time"
            value={`${agencyStats?.avgResponseTime || 2.5}h`}
            icon={Clock}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Available Requests</CardTitle>
                  <div className="flex space-x-2">
                    <Select defaultValue="all-priority">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-priority">All Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all-areas">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-areas">All Areas</SelectItem>
                        <SelectItem value="accra">Accra Central</SelectItem>
                        <SelectItem value="tema">Tema</SelectItem>
                        <SelectItem value="kumasi">Kumasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghana-green mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading requests...</p>
                  </div>
                ) : unassignedReports.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending requests at the moment.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {unassignedReports.map((report) => (
                      <div 
                        key={report.id} 
                        className="py-6 hover:bg-gray-50 transition-colors"
                        data-testid={`request-${report.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {report.imageUrls && report.imageUrls.length > 0 ? (
                              <img 
                                src={report.imageUrls[0]} 
                                alt="Report" 
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ClipboardList className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h5 className="font-semibold text-gray-900" data-testid={`request-title-${report.id}`}>
                                {report.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1" data-testid={`request-description-${report.id}`}>
                                {report.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {report.address}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  Reporter
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge 
                              className={getPriorityColor(report.priority)}
                              data-testid={`request-priority-${report.id}`}
                            >
                              {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                            </Badge>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                className="bg-ghana-green text-white hover:bg-emerald-600"
                                onClick={() => acceptReport.mutate(report.id)}
                                disabled={acceptReport.isPending}
                                data-testid={`button-accept-${report.id}`}
                              >
                                {acceptReport.isPending ? "Accepting..." : "Accept"}
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                data-testid={`button-details-${report.id}`}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Status & Map */}
          <div className="space-y-6">
            {/* Team Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Team Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-ghana-green rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">KA</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kwame Asante</p>
                        <p className="text-xs text-gray-500">Truck #GH-001</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-ghana-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">AD</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ama Darko</p>
                        <p className="text-xs text-gray-500">Truck #GH-002</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">En Route</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-ghana-gold rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">KO</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kofi Owusu</p>
                        <p className="text-xs text-gray-500">Truck #GH-003</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Off Duty</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map View */}
            <MapView title="Service Area Map" height="h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
