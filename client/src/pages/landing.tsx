import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Truck, ChartLine, Camera, Bell, Gift, Smartphone } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-ghana-green rounded-lg flex items-center justify-center">
                <Leaf className="text-white text-lg" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Clean Ghana</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#citizen" className="text-gray-600 hover:text-ghana-green transition-colors">Citizen Portal</a>
              <a href="#agency" className="text-gray-600 hover:text-ghana-green transition-colors">Agency Dashboard</a>
              <a href="#admin" className="text-gray-600 hover:text-ghana-green transition-colors">Admin Panel</a>
              <Button onClick={handleLogin} className="bg-ghana-green text-white hover:bg-emerald-600">
                Login
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ghana-green to-ghana-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Building a Cleaner Ghana Together
              </h2>
              <p className="text-xl text-emerald-100 mb-8">
                Connect citizens, cleaning agencies, and government authorities to improve sanitation across Ghana. Report waste, request cleanup, and track progress in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleLogin} className="bg-white text-ghana-green px-8 py-3 hover:bg-gray-100">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button variant="outline" className="border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-ghana-green">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Community cleanup in Ghana" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-ghana-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2,450+</p>
                    <p className="text-sm text-gray-600">Reports Resolved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section id="portals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Portal</h3>
            <p className="text-xl text-gray-600">Access the platform based on your role in the waste management ecosystem</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Citizen Portal */}
            <Card className="bg-gradient-to-br from-ghana-green to-emerald-600 p-8 text-white transform hover:scale-105 transition-transform cursor-pointer border-0">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Camera className="text-3xl" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Citizen Portal</h4>
                <p className="text-emerald-100 mb-6">Report waste issues, request pickup services, and track cleanup progress in your area.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Report waste with photos</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Request pickup services</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Track report status</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Earn participation rewards</span>
                  </li>
                </ul>
                <Button onClick={handleLogin} className="w-full bg-white text-ghana-green hover:bg-gray-100">
                  Access Citizen Portal
                </Button>
              </CardContent>
            </Card>

            {/* Agency Portal */}
            <Card className="bg-gradient-to-br from-ghana-blue to-blue-600 p-8 text-white transform hover:scale-105 transition-transform cursor-pointer border-0">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Truck className="text-3xl" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Agency Dashboard</h4>
                <p className="text-blue-100 mb-6">Manage cleanup requests, coordinate teams, and track performance metrics.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Receive citizen reports</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Schedule pickup services</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Track team performance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Manage workload</span>
                  </li>
                </ul>
                <Button onClick={handleLogin} className="w-full bg-white text-ghana-blue hover:bg-gray-100">
                  Access Agency Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Government Portal */}
            <Card className="bg-gradient-to-br from-ghana-gold to-yellow-600 p-8 text-white transform hover:scale-105 transition-transform cursor-pointer border-0">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <ChartLine className="text-3xl" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Admin Panel</h4>
                <p className="text-yellow-100 mb-6">Monitor citywide activities, analyze trends, and coordinate policy implementation.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Monitor waste hotspots</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Generate analytics</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Manage agencies</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Publish campaigns</span>
                  </li>
                </ul>
                <Button onClick={handleLogin} className="w-full bg-white text-ghana-gold hover:bg-gray-100">
                  Access Admin Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h3>
            <p className="text-xl text-gray-600">Comprehensive tools for effective waste management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ghana-green bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="text-ghana-green text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Photo Reporting</h4>
              <p className="text-gray-600">Capture waste issues with automatic GPS tagging for precise location tracking and faster response times.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-ghana-blue bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="text-ghana-blue text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Smart Dispatch</h4>
              <p className="text-gray-600">Intelligent routing system that optimizes cleanup assignments based on location, priority, and team availability.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-ghana-gold bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChartLine className="text-ghana-gold text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Real-time Analytics</h4>
              <p className="text-gray-600">Comprehensive dashboards providing insights into waste patterns, response times, and cleanup effectiveness.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="text-purple-500 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Push Notifications</h4>
              <p className="text-gray-600">Stay updated with real-time alerts about report status, cleanup campaigns, and community initiatives.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="text-pink-500 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Reward System</h4>
              <p className="text-gray-600">Earn points for active participation in waste reporting and community cleanup activities.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="text-indigo-500 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Mobile Ready</h4>
              <p className="text-gray-600">Progressive web app that works seamlessly on all devices with offline capabilities for remote areas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
