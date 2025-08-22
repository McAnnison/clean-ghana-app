import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Expand } from "lucide-react";

interface MapViewProps {
  title?: string;
  height?: string;
  showExpandButton?: boolean;
}

export default function MapView({ 
  title = "Interactive Map", 
  height = "h-64", 
  showExpandButton = true 
}: MapViewProps) {
  // This is a placeholder for map integration
  // In production, you would integrate with Google Maps, OpenStreetMap, or similar
  const handleExpandMap = () => {
    // Navigate to full map view
    console.log("Expanding map view");
  };

  return (
    <Card className="w-full">
      {title && (
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className={`${height} bg-gray-100 rounded-xl flex items-center justify-center relative`}>
          {/* Map placeholder - replace with actual map component */}
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
            <p className="text-gray-500 font-medium">Interactive Map</p>
            <p className="text-sm text-gray-400">
              Shows waste reports and cleanup activities
            </p>
          </div>
          
          {/* Mock map markers */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-6 w-3 h-3 bg-ghana-green rounded-full"></div>
          <div className="absolute bottom-6 left-8 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-ghana-blue rounded-full"></div>
        </div>
        
        {showExpandButton && (
          <Button 
            onClick={handleExpandMap}
            variant="outline"
            className="w-full mt-4"
            data-testid="button-expand-map"
          >
            <Expand className="mr-2 h-4 w-4" />
            View Full Map
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
