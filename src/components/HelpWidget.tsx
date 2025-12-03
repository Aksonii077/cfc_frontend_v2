import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import {
  Wrench,
  X,
  Upload,
  FileImage,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../utils/supabase/client";

interface HelpSubmission {
  user_id: string;
  page_url: string;
  page_title: string;
  help_description: string;
  screenshot_url?: string;
  user_email?: string;
  user_role?: string;
  created_at: string;
}

export function HelpWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [helpDescription, setHelpDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(
    null,
  );
  const [screenshotPreview, setScreenshotPreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current page information
  const getCurrentPageInfo = () => {
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      title: document.title || "RACE AI Platform",
    };
  };

  // Handle screenshot upload
  const handleScreenshotSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Screenshot too large", {
          description:
            "Please upload an image smaller than 5MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description:
            "Please upload an image file (PNG, JPG, etc.)",
        });
        return;
      }

      setScreenshot(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove screenshot
  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload screenshot to Supabase Storage
  const uploadScreenshot = async (
    file: File,
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `help-screenshots/${fileName}`;

      const { data, error } = await supabase.storage
        .from("help-submissions")
        .upload(filePath, file);

      if (error) {
        console.error("Screenshot upload error:", error);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("help-submissions")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      return null;
    }
  };

  // Submit help request
  const handleSubmit = async () => {
    if (!helpDescription.trim()) {
      toast.error("Please describe your issue", {
        description: "Help description is required",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pageInfo = getCurrentPageInfo();
      let screenshotUrl: string | null = null;

      // Upload screenshot if provided
      if (screenshot) {
        screenshotUrl = await uploadScreenshot(screenshot);
      }

      // Get user role from localStorage
      const userRole = user?.id
        ? localStorage.getItem(`user_role_${user.id}`)
        : null;

      // Prepare submission data
      const submission: Omit<HelpSubmission, "created_at"> = {
        user_id: user?.id || "anonymous",
        page_url: pageInfo.url,
        page_title: pageInfo.title,
        help_description: helpDescription.trim(),
        screenshot_url: screenshotUrl || undefined,
        user_email: user?.email || undefined,
        user_role: userRole || undefined,
      };

      // Insert into Supabase
      const { error } = await supabase
        .from("help_submissions")
        .insert([submission]);

      if (error) {
        throw error;
      }

      // Success
      toast.success("Help request submitted", {
        description:
          "Our team will review your request and get back to you soon.",
        duration: 5000,
      });

      // Reset form and close
      setHelpDescription("");
      setScreenshot(null);
      setScreenshotPreview(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting help request:", error);
      toast.error("Failed to submit", {
        description:
          "Please try again or contact support@raceai.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Help Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-white border-2 border-[#114DFF] hover:bg-[#EDF2FF] p-0 flex items-center justify-center group"
          aria-label="Get Help"
        >
          <Wrench className="w-10 h-10 text-[#114DFF] transition-transform group-hover:scale-110" />
        </Button>
      </motion.div>

      {/* Help Dialog */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] border-[#C8D6FF] fixed bottom-24 right-6 top-auto left-auto translate-x-0 translate-y-0 max-h-[calc(100vh-120px)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              Need Help?
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Describe your issue or question, and optionally
              attach a screenshot. We'll get back to you as soon
              as possible.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Page Info */}
            <div className="p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#114DFF] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700">Current page:</p>
                  <p className="text-gray-600 truncate">
                    {getCurrentPageInfo().title}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Description */}
            <div className="space-y-2">
              <Label
                htmlFor="help-description"
                className="text-gray-900"
              >
                Describe your issue or question *
              </Label>
              <Textarea
                id="help-description"
                placeholder="Please provide as much detail as possible..."
                value={helpDescription}
                onChange={(e) =>
                  setHelpDescription(e.target.value)
                }
                rows={5}
                className="resize-none border-[#C8D6FF] focus:border-[#114DFF] bg-white"
                disabled={isSubmitting}
              />
              <p className="text-gray-500">
                {helpDescription.length} / 1000 characters
              </p>
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label className="text-gray-900">
                Screenshot (optional)
              </Label>

              {!screenshotPreview ? (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] gap-2"
                    disabled={isSubmitting}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Screenshot
                  </Button>
                  <p className="text-gray-500">
                    PNG, JPG, or GIF (max 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg border border-[#C8D6FF] overflow-hidden flex-shrink-0">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-[#114DFF]" />
                        <p className="text-gray-900 truncate">
                          {screenshot?.name}
                        </p>
                      </div>
                      <p className="text-gray-600">
                        {screenshot
                          ? `${(screenshot.size / 1024).toFixed(0)} KB`
                          : ""}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveScreenshot}
                      className="flex-shrink-0 hover:bg-[#FFE5E5] hover:text-[#FF220E]"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* User Info (if logged in) */}
            {user && (
              <div className="p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06CB1D]" />
                  <p className="text-gray-700">
                    Logged in as{" "}
                    <span className="text-gray-900">
                      {user.email}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#C8D6FF]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !helpDescription.trim()}
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}