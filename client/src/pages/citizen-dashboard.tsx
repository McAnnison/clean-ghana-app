import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import ReportForm from "@/components/report-form";
import StatsCard from "@/components/stats-card";
import MapView from "@/components/map-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Report } from "@shared/schema";
import { ClipboardList, CheckCircle, Award, Truck, Calendar, Map, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CitizenDashboard() {
  const { user } = useAuth();

  const { data: reports = [], isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports/my'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'Reported';
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const resolvedCount = reports.filter(r => r.status === 'completed').length;
  const pendingCount = reports.filter(r => r.status === 'reported').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName}!</h2>
          <p className="text-xl text-gray-600">Ready to make a difference in your community?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-2">
            <ReportForm />
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-ghana-blue text-white hover:bg-blue-600" data-testid="button-request-pickup">
                  <Truck className="mr-2 h-4 w-4" />
                  Request Pickup
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-schedule-service">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Service
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-view-map">
                  <Map className="mr-2 h-4 w-4" />
                  View Area Map
                </Button>
              </CardContent>
            </Card>

            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reports Submitted</span>
                  <span className="font-bold text-ghana-green" data-testid="stat-reports-submitted">
                    {reports.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Issues Resolved</span>
                  <span className="font-bold text-ghana-green" data-testid="stat-issues-resolved">
                    {resolvedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reward Points</span>
                  <span className="font-bold text-ghana-gold" data-testid="stat-reward-points">
                    {user?.rewardPoints || 0}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Community Rank</span>
                    <span className="text-sm font-medium text-ghana-green">Top 15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-ghana-green h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map View */}
            <MapView title="Area Map" height="h-48" />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Your Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghana-green mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports yet. Submit your first report above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      data-testid={`report-${report.id}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-ghana-green rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`report-title-${report.id}`}>
                            {report.title}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span data-testid={`report-date-${report.id}`}>
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={getStatusColor(report.status)}
                        data-testid={`report-status-${report.id}`}
                      >
                        {getStatusText(report.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
