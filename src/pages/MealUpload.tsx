import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, Camera, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { analyzeMealImage, type MealAnalysis } from "@/services/mealDetectionService";

const MealUpload = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      toast({
        title: "Oops! 🤔",
        description: "Please upload a photo of your meal for analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Analyze the meal image
      const analysis = await analyzeMealImage(imagePreview, description);
      
      // Store analysis results in session storage to pass to Results page
      sessionStorage.setItem("mealAnalysis", JSON.stringify(analysis));
      
      toast({
        title: "Success! 🎉",
        description: "Meal analyzed successfully",
      });
      
      navigate("/results");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze meal",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-warm pb-20">
      <div className="container max-w-2xl mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Analyze Your Meal 🍽️</h1>
          <p className="text-muted-foreground">
            Upload a photo or describe what you ate
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 shadow-elevated mb-6"
        >
          {/* Image Upload Area */}
          <div className="mb-6">
            <label
              htmlFor="image-upload"
              className={`relative block w-full aspect-video rounded-2xl border-2 border-dashed transition-smooth cursor-pointer overflow-hidden ${
                imagePreview
                  ? "border-primary bg-primary/5"
                  : "border-border bg-accent hover:bg-accent/80 hover:border-primary"
              }`}
            >
              <AnimatePresence mode="wait">
                {imagePreview ? (
                  <motion.img
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={imagePreview}
                    alt="Meal preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center p-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-semibold mb-1">Upload meal photo</p>
                    <p className="text-sm text-muted-foreground">
                      Click to browse or drag and drop
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Meal Description (Optional)
            </label>
            <Textarea
              placeholder="E.g., Grilled chicken with quinoa and steamed broccoli 🥗"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-2xl min-h-[120px] resize-none"
            />
          </div>

          {/* Analyze Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze My Meal
              </>
            )}
          </Button>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/50 rounded-2xl p-5 border border-border/50"
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Quick Tips
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• Take photos in good lighting for better results</li>
            <li>• Include all items in your meal</li>
            <li>• Add details about portion sizes if possible</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default MealUpload;
