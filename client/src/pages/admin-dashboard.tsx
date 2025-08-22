import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import StatsCard from "@/components/stats-card";
import MapView from "@/components/map-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign } from "@shared/schema";
import { AlertTriangle, CheckCircle, Building, Clock, MapPin, Plus, Download, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: reportStats } = useQuery({
    queryKey: ['/api/analytics/reports'],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  // Mock data for regional stats
  const regionalStats = [
    { name: 'Greater Accra', reports: 324, resolved: 89 },
    { name: 'Ashanti', reports: 187, resolved: 76 },
    { name: 'Western', reports: 93, resolved: 62 },
  ];

  const topAgencies = [
    { name: 'CleanTech Ghana', completed: 45, rating: 96 },
    { name: 'EcoWaste Services', completed: 38, rating: 91 },
    { name: 'Green Ghana Ltd', completed: 29, rating: 87 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Government Admin Panel</h2>
            <p className="text-xl text-gray-600">Monitor citywide waste management and coordinate policy implementation</p>
          </div>
          <div className="mt-6 lg:mt-0 flex space-x-3">
            <Button className="bg-ghana-green text-white hover:bg-emerald-600" data-testid="button-new-campaign">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
            <Button variant="outline" data-testid="button-export-report">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-ghana-green bg-opacity-10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-ghana-green text-xl" />
              </div>
              <span className="text-sm text-red-600 font-medium">+12%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="stat-total-reports">
              {reportStats?.total || 1247}
            </p>
            <p className="text-gray-600">Total Reports</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-ghana-blue bg-opacity-10 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-ghana-blue text-xl" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="stat-resolved-reports">
              {reportStats?.resolved || 945}
            </p>
            <p className="text-gray-600">Resolved</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-ghana-gold bg-opacity-10 rounded-xl flex items-center justify-center">
                <Building className="text-ghana-gold text-xl" />
              </div>
              <span className="text-sm text-green-600 font-medium">+2</span>
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="stat-active-agencies">18</p>
            <p className="text-gray-600">Active Agencies</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                <Clock className="text-purple-500 text-xl" />
              </div>
              <span className="text-sm text-green-600 font-medium">-0.5h</span>
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="stat-avg-response">2.3h</p>
            <p className="text-gray-600">Avg Response</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                <MapPin className="text-red-500 text-xl" />
              </div>
              <span className="text-sm text-red-600 font-medium">+3</span>
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="stat-hotspots">12</p>
            <p className="text-gray-600">Hotspots</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Analytics Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Report Trends</CardTitle>
                  <Select defaultValue="7days">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="3months">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                    <p className="text-gray-500 font-medium">Reports Trend Chart</p>
                    <p className="text-sm text-gray-400">Daily reports vs resolutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotspot Map */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Waste Hotspots</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-ghana-green text-white">Reports</Button>
                    <Button size="sm" variant="outline">Agencies</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MapView title="" height="h-64" showExpandButton={false} />
              </CardContent>
            </Card>
          </div>

          {/* Regional Stats & Actions */}
          <div className="space-y-6">
            {/* Regional Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Regional Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalStats.map((region, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`region-name-${index}`}>
                            {region.name}
                          </p>
                          <p className="text-sm text-gray-500" data-testid={`region-reports-${index}`}>
                            {region.reports} reports this week
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-ghana-green" data-testid={`region-resolved-${index}`}>
                            {region.resolved}%
                          </span>
                          <p className="text-xs text-gray-500">resolved</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-ghana-green h-2 rounded-full" 
                          style={{ width: `${region.resolved}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.slice(0, 2).map((campaign) => (
                    <div 
                      key={campaign.id} 
                      className="p-3 border border-ghana-green rounded-lg bg-green-50"
                      data-testid={`campaign-${campaign.id}`}
                    >
                      <h6 className="font-medium text-gray-900" data-testid={`campaign-title-${campaign.id}`}>
                        {campaign.title}
                      </h6>
                      <p className="text-sm text-gray-600 mt-1" data-testid={`campaign-description-${campaign.id}`}>
                        {campaign.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-ghana-green font-medium">
                          {campaign.participantCount} participants
                        </span>
                        <span className="text-xs text-gray-500">
                          {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Default campaigns if none exist */}
                  {campaigns.length === 0 && (
                    <>
                      <div className="p-3 border border-ghana-green rounded-lg bg-green-50">
                        <h6 className="font-medium text-gray-900">Clean Accra Initiative</h6>
                        <p className="text-sm text-gray-600 mt-1">Community cleanup drive in 15 districts</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-ghana-green font-medium">85% participation</span>
                          <span className="text-xs text-gray-500">Ends Dec 31</span>
                        </div>
                      </div>
                      <div className="p-3 border border-ghana-blue rounded-lg bg-blue-50">
                        <h6 className="font-medium text-gray-900">Recycle Ghana</h6>
                        <p className="text-sm text-gray-600 mt-1">Plastic recycling awareness program</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-ghana-blue font-medium">67% participation</span>
                          <span className="text-xs text-gray-500">Ongoing</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" data-testid="button-create-campaign">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Agency Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Top Performing Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topAgencies.map((agency, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-ghana-gold' : index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`agency-name-${index}`}>
                            {agency.name}
                          </p>
                          <p className="text-xs text-gray-500" data-testid={`agency-completed-${index}`}>
                            {agency.completed} completed
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-ghana-green" data-testid={`agency-rating-${index}`}>
                        {agency.rating}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
