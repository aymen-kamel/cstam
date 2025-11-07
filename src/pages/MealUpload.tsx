import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/api";

const MealUpload = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mealDescription, setMealDescription] = useState<string>("");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = async () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const payload = { image: reader.result };
        if (mealDescription.trim()) {
          payload.description = mealDescription.trim();
        }
        const response = await api.post('/upload_image', payload);
        console.log(response);
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } catch (error) {
        console.error('Upload failed:', error);
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(selectedFile);
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
          <h1 className="text-3xl font-bold mb-2">Upload Your Meal 🍽️</h1>
          <p className="text-muted-foreground">
            Upload a photo of what you ate
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

          {/* Meal Description */}
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-6"
            >
              <label htmlFor="meal-description" className="block text-sm font-medium mb-2">
                Describe your meal (optional)
              </label>
              <textarea
                id="meal-description"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                placeholder="e.g., Grilled chicken salad with avocado and tomatoes..."
                className="w-full p-3 rounded-2xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </motion.div>
          )}

          {/* Send Button */}
          {imagePreview && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleSendImage}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-3 font-semibold hover:bg-primary/90 transition-colors"
            >
              Send Image
            </motion.button>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default MealUpload;
