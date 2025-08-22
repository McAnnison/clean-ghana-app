import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, MapPin } from "lucide-react";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(['illegal_dumping', 'overflowing_bin', 'littering', 'blocked_drainage', 'other']),
  address: z.string().min(1, "Address is required"),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function ReportForm() {
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      category: 'other',
      address: "",
      priority: 'medium',
    },
  });

  const submitReport = useMutation({
    mutationFn: async (data: ReportFormData & { latitude?: number; longitude?: number }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      return await apiRequest('POST', '/api/reports', formData);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your waste report has been submitted successfully.",
        variant: "default",
      });
      form.reset();
      setImages([]);
      setLocation(null);
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location Updated",
            description: "Your location has been captured.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter address manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
    }
  };

  const onSubmit = (data: ReportFormData) => {
    submitReport.mutate({
      ...data,
      latitude: location?.lat,
      longitude: location?.lng,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Report Waste Issue</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief title of the issue" {...field} data-testid="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="illegal_dumping">Illegal Dumping</SelectItem>
                      <SelectItem value="overflowing_bin">Overflowing Bin</SelectItem>
                      <SelectItem value="littering">Littering</SelectItem>
                      <SelectItem value="blocked_drainage">Blocked Drainage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the waste issue in detail..." 
                      className="h-32" 
                      {...field} 
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input placeholder="Enter address" {...field} data-testid="input-address" />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={getCurrentLocation}
                      data-testid="button-location"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  {location && (
                    <p className="text-sm text-ghana-green">
                      GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ghana-green transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  data-testid="input-images"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-2">Click to take photo or upload from gallery</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB (Max 5 images)</p>
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{images.length} image(s) selected</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-ghana-green text-white hover:bg-emerald-600"
              disabled={submitReport.isPending}
              data-testid="button-submit-report"
            >
              {submitReport.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
