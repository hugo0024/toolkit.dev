import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Star } from "lucide-react";

export const TravelPlanningCalling: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      <span>Searching for travel options...</span>
    </div>
  );
};

export const TravelPlanningResult: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Tokyo, Japan
            </CardTitle>
            <CardDescription>7-day cultural experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>March 15-22</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>$2,400</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8/5</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Cherry Blossoms</Badge>
              <Badge variant="secondary">Temples</Badge>
              <Badge variant="secondary">Food Tours</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Barcelona, Spain
            </CardTitle>
            <CardDescription>5-day art & architecture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>April 8-13</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>$1,850</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Gaudí</Badge>
              <Badge variant="secondary">Museums</Badge>
              <Badge variant="secondary">Beach</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 