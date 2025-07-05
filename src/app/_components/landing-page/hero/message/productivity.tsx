import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar, AlertCircle } from "lucide-react";

export const ProductivityCalling: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      <span>Organizing your schedule...</span>
    </div>
  );
};

export const ProductivityResult: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Optimized Schedule
          </CardTitle>
          <CardDescription>AI-organized for maximum productivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">Morning Exercise</div>
                <div className="text-sm text-muted-foreground">7:00 AM - 8:00 AM</div>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Client Presentation</div>
                <div className="text-sm text-muted-foreground">10:00 AM - 11:30 AM</div>
              </div>
              <Badge variant="default">In Progress</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-medium">Project Review</div>
                <div className="text-sm text-muted-foreground">2:00 PM - 3:30 PM</div>
              </div>
              <Badge variant="secondary">High Priority</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <div className="font-medium">Focus Time: Strategy Planning</div>
                <div className="text-sm text-muted-foreground">4:00 PM - 5:30 PM</div>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 