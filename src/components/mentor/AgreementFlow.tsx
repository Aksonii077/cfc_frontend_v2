import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  User,
  Building,
  ArrowLeft,
  Download,
  Eye,
  PenTool,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
  status: "pending" | "reviewing" | "interview-scheduled" | "interview-completed" | "accepted" | "rejected" | "agreement-ongoing" | "agreement-successful";
  description: string;
}

interface AgreementFlowProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApplicationStatus: (applicationId: string, newStatus: string, data?: any) => void;
}

export function AgreementFlow({
  application,
  isOpen,
  onClose,
  onUpdateApplicationStatus
}: AgreementFlowProps) {
  const [currentStep, setCurrentStep] = useState<"select-template" | "review-agreement" | "signing">("select-template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [agreementProgress, setAgreementProgress] = useState(0);
  const [signingStatus, setSigningStatus] = useState({
    mentor: false,
    founder: false
  });

  const getAgreementTemplates = () => {
    switch (application.stage) {
      case "Pre-Seed":
      case "Ideation":
        return [
          {
            id: "ideation-mentorship",
            name: "Ideation Stage Mentorship Agreement",
            description: "For early-stage startups in ideation phase requiring guidance on validation and initial development.",
            duration: "3 months",
            equity: "No equity",
            commitment: "2 hours/week"
          },
          {
            id: "pre-seed-advisor",
            name: "Pre-Seed Advisor Agreement",
            description: "Formal advisory role with equity compensation for pre-seed stage companies.",
            duration: "12 months",
            equity: "0.5-1%",
            commitment: "4 hours/week"
          }
        ];
      case "Seed":
        return [
          {
            id: "seed-incubator",
            name: "Seed Stage Incubator Agreement",
            description: "Comprehensive incubator program with funding, mentorship, and resources.",
            duration: "6 months",
            equity: "5-8%",
            commitment: "Full-time program"
          },
          {
            id: "seed-accelerator",
            name: "Seed Accelerator Agreement",
            description: "Intensive 3-month accelerator program with demo day and investor connections.",
            duration: "3 months",
            equity: "6%",
            commitment: "Full-time program"
          }
        ];
      case "Series A":
        return [
          {
            id: "series-a-board",
            name: "Series A Board Advisory Agreement",
            description: "Board advisory role for established companies seeking strategic guidance.",
            duration: "24 months",
            equity: "0.1-0.25%",
            commitment: "6 hours/month"
          },
          {
            id: "series-a-strategic",
            name: "Strategic Partnership Agreement",
            description: "Strategic partnership for market expansion and business development.",
            duration: "12 months",
            equity: "Negotiable",
            commitment: "10 hours/month"
          }
        ];
      default:
        return [
          {
            id: "general-mentorship",
            name: "General Mentorship Agreement",
            description: "Standard mentorship agreement suitable for various stages.",
            duration: "6 months",
            equity: "0.25%",
            commitment: "3 hours/week"
          }
        ];
    }
  };

  const templates = getAgreementTemplates();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep("review-agreement");
  };

  const handleStartSigning = async () => {
    try {
      // Update application status to agreement-ongoing
      await onUpdateApplicationStatus(application.id, "agreement-ongoing", {
        agreement_template: selectedTemplate,
        agreement_started_at: new Date().toISOString()
      });
      
      setCurrentStep("signing");
      setAgreementProgress(25);
    } catch (error) {
      console.error('Error starting agreement process:', error);
    }
  };

  const handleMentorSign = () => {
    setSigningStatus(prev => ({ ...prev, mentor: true }));
    setAgreementProgress(75);
  };

  const handleFounderSign = async () => {
    setSigningStatus(prev => ({ ...prev, founder: true }));
    setAgreementProgress(100);
    
    // Update to agreement successful
    setTimeout(async () => {
      try {
        await onUpdateApplicationStatus(application.id, "agreement-successful", {
          agreement_completed_at: new Date().toISOString(),
          final_agreement_template: selectedTemplate
        });
        onClose();
      } catch (error) {
        console.error('Error completing agreement:', error);
      }
    }, 1000);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            {currentStep !== "select-template" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentStep(currentStep === "review-agreement" ? "select-template" : "review-agreement")}
                className="p-1 h-auto"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <FileText className="w-5 h-5" />
            <span>Agreement Process - {application.startupName}</span>
          </DialogTitle>
          <DialogDescription>
            Application Stage: {application.stage} | Status: {application.status.replace("-", " ").toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Agreement Template */}
            {currentStep === "select-template" && (
              <motion.div
                key="select-template"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Select Agreement Template</CardTitle>
                    <DialogDescription>
                      Choose the appropriate agreement template based on the startup stage and your engagement type.
                    </DialogDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className={`cursor-pointer border-2 transition-all duration-200 ${
                              selectedTemplate === template.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                                  <p className="text-gray-600 mb-4">{template.description}</p>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Duration:</span>
                                      <p className="text-gray-600">{template.duration}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Equity:</span>
                                      <p className="text-gray-600">{template.equity}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Commitment:</span>
                                      <p className="text-gray-600">{template.commitment}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Recommended for {application.stage}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Review Agreement */}
            {currentStep === "review-agreement" && selectedTemplateData && (
              <motion.div
                key="review-agreement"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Review Agreement Details
                    </CardTitle>
                    <DialogDescription>
                      Review the agreement terms before proceeding to the signing process.
                    </DialogDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">{selectedTemplateData.name}</h3>
                      <p className="text-gray-700 mb-4">{selectedTemplateData.description}</p>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Agreement Terms</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">{selectedTemplateData.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Equity Stake:</span>
                              <span className="font-medium">{selectedTemplateData.equity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Time Commitment:</span>
                              <span className="font-medium">{selectedTemplateData.commitment}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Startup Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Company:</span>
                              <span className="font-medium">{application.startupName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Founder:</span>
                              <span className="font-medium">{application.founderName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stage:</span>
                              <span className="font-medium">{application.stage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Industry:</span>
                              <span className="font-medium">{application.industry}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("select-template")}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Change Template
                      </Button>
                      <Button
                        onClick={handleStartSigning}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        Proceed to Signing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Digital Signing */}
            {currentStep === "signing" && (
              <motion.div
                key="signing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Digital Agreement Signing
                    </CardTitle>
                    <DialogDescription>
                      Both parties need to digitally sign the agreement to complete the process.
                    </DialogDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Agreement Progress</span>
                        <span>{agreementProgress}% Complete</span>
                      </div>
                      <Progress value={agreementProgress} className="h-2" />
                    </div>

                    {/* Signing Status */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Mentor Signing */}
                      <Card className={`${signingStatus.mentor ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                        <CardContent className="p-6 text-center">
                          <div className="mb-4">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                              signingStatus.mentor ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {signingStatus.mentor ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                              ) : (
                                <User className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <h3 className="font-medium mb-2">Mentor Signature</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {signingStatus.mentor ? 'Signed successfully' : 'Pending signature'}
                          </p>
                          {!signingStatus.mentor && (
                            <Button
                              onClick={handleMentorSign}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <PenTool className="w-4 h-4 mr-2" />
                              Sign as Mentor
                            </Button>
                          )}
                        </CardContent>
                      </Card>

                      {/* Founder Signing */}
                      <Card className={`${signingStatus.founder ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                        <CardContent className="p-6 text-center">
                          <div className="mb-4">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                              signingStatus.founder ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {signingStatus.founder ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                              ) : (
                                <Building className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <h3 className="font-medium mb-2">Founder Signature</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {signingStatus.founder ? 'Signed successfully' : 'Pending signature'}
                          </p>
                          {!signingStatus.founder && signingStatus.mentor && (
                            <Button
                              onClick={handleFounderSign}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <PenTool className="w-4 h-4 mr-2" />
                              Sign as Founder
                            </Button>
                          )}
                          {!signingStatus.mentor && (
                            <p className="text-xs text-gray-500">
                              Waiting for mentor to sign first
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Agreement Completed */}
                    {signingStatus.mentor && signingStatus.founder && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                      >
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-green-900 mb-2">Agreement Successfully Completed!</h3>
                        <p className="text-green-700 mb-4">
                          Both parties have signed the agreement. The startup is now officially part of your portfolio.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Agreement
                          </Button>
                          <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Send to Both Parties
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}