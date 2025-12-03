import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { toast } from "sonner";
import {
  FileText,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Plus,
  ExternalLink,
  Signature,
  Mail,
  Calendar,
} from "lucide-react";

interface OnboardedStartup {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  documents: {
    investmentAgreement?: { status: "pending" | "signed"; url?: string };
    safeNote?: { status: "pending" | "signed"; url?: string };
    programAgreement?: { status: "pending" | "signed"; url?: string };
  };
}

interface DocumentSigningProps {
  startup: OnboardedStartup;
  onDocumentUpdate: (documentType: keyof typeof startup.documents, status: "pending" | "signed", url?: string) => void;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: "investment" | "program" | "legal";
  required: boolean;
  template?: string;
}

export function DocumentSigning({ startup, onDocumentUpdate }: DocumentSigningProps) {
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState("");
  const [newDocumentName, setNewDocumentName] = useState("");
  const [documentNotes, setDocumentNotes] = useState("");

  const documentTemplates: DocumentTemplate[] = [
    {
      id: "investment-agreement",
      name: "Investment Agreement",
      description: "Standard investment terms and conditions",
      type: "investment",
      required: true,
      template: "SERIES SEED INVESTMENT AGREEMENT"
    },
    {
      id: "safe-note",
      name: "SAFE Note",
      description: "Simple Agreement for Future Equity",
      type: "investment",
      required: false,
      template: "SAFE (Simple Agreement for Future Equity)"
    },
    {
      id: "program-agreement",
      name: "Program Participation Agreement",
      description: "Accelerator program terms and expectations",
      type: "program",
      required: true,
      template: "ACCELERATOR PROGRAM AGREEMENT"
    },
    {
      id: "nda",
      name: "Non-Disclosure Agreement",
      description: "Confidentiality agreement for program materials",
      type: "legal",
      required: false,
    },
    {
      id: "equity-agreement",
      name: "Equity Agreement",
      description: "Equity stake and terms documentation",
      type: "investment",
      required: false,
    }
  ];

  const documentStatuses = [
    {
      status: "pending",
      label: "Pending Signature",
      color: "bg-orange-50 text-orange-700 border-orange-200",
      icon: Clock,
    },
    {
      status: "signed",
      label: "Signed & Complete",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle,
    },
  ];

  const getDocumentStatus = (documentKey: keyof typeof startup.documents) => {
    const doc = startup.documents[documentKey];
    return doc?.status || "not-created";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending Signature",
          color: "bg-orange-50 text-orange-700 border-orange-200",
          icon: Clock,
        };
      case "signed":
        return {
          label: "Signed & Complete",
          color: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
        };
      case "not-created":
        return {
          label: "Not Created",
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const handleGenerateDocument = async (template: DocumentTemplate) => {
    setIsGeneratingDocument(true);
    setActiveDocument(template.id);

    try {
      // Simulate document generation with DocuSign/HelloSign API
      await new Promise(resolve => setTimeout(resolve, 3000));

      const documentKey = template.id.includes("investment") ? "investmentAgreement" :
                          template.id.includes("safe") ? "safeNote" :
                          template.id.includes("program") ? "programAgreement" :
                          "programAgreement"; // fallback

      const mockDocumentUrl = `https://documents.example.com/${template.id}-${startup.id}.pdf`;
      
      onDocumentUpdate(documentKey as keyof typeof startup.documents, "pending", mockDocumentUrl);
      
      toast.success(`${template.name} generated and sent for signature!`);
      
    } catch (error) {
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsGeneratingDocument(false);
      setActiveDocument(null);
    }
  };

  const handleSendReminder = async (documentType: string) => {
    try {
      // Simulate sending reminder email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Reminder email sent to founder!");
    } catch (error) {
      toast.error("Failed to send reminder.");
    }
  };

  const handleMarkAsSigned = (documentKey: keyof typeof startup.documents) => {
    onDocumentUpdate(documentKey, "signed");
    toast.success("Document marked as signed!");
  };

  const handleCreateCustomDocument = async () => {
    if (!newDocumentName.trim()) {
      toast.error("Please enter a document name.");
      return;
    }

    try {
      setIsGeneratingDocument(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll add it as a program agreement
      onDocumentUpdate("programAgreement", "pending", `https://documents.example.com/custom-${startup.id}.pdf`);
      
      toast.success("Custom document created and sent!");
      setShowNewDocumentDialog(false);
      setNewDocumentName("");
      setNewDocumentType("");
      setDocumentNotes("");
      
    } catch (error) {
      toast.error("Failed to create document.");
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const signedDocuments = Object.values(startup.documents).filter(doc => doc?.status === "signed").length;
  const totalDocuments = Object.keys(startup.documents).length;
  const completionPercentage = totalDocuments > 0 ? (signedDocuments / totalDocuments) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Signature className="w-5 h-5" />
              Document Signing Status
            </CardTitle>
            <Badge variant="outline" className={
              completionPercentage === 100 
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }>
              {signedDocuments}/{totalDocuments} Signed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Completion Progress</span>
              <span className="font-medium">{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            {completionPercentage === 100 ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">All documents signed and complete!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-700 bg-orange-50 p-3 rounded-lg">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {totalDocuments - signedDocuments} document(s) pending signature
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Document Templates</CardTitle>
            <Dialog open={showNewDocumentDialog} onOpenChange={setShowNewDocumentDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Custom Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Document Name</Label>
                    <Input
                      placeholder="e.g., Custom NDA, Special Terms Agreement"
                      value={newDocumentName}
                      onChange={(e) => setNewDocumentName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Document Type</Label>
                    <Select value={newDocumentType} onValueChange={setNewDocumentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investment">Investment Document</SelectItem>
                        <SelectItem value="program">Program Document</SelectItem>
                        <SelectItem value="legal">Legal Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      placeholder="Add any special instructions or requirements..."
                      value={documentNotes}
                      onChange={(e) => setDocumentNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewDocumentDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCustomDocument} disabled={isGeneratingDocument}>
                      {isGeneratingDocument ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Create Document
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {documentTemplates.map((template) => {
              const documentKey = template.id.includes("investment") ? "investmentAgreement" :
                                template.id.includes("safe") ? "safeNote" :
                                template.id.includes("program") ? "programAgreement" :
                                null;
              
              const status = documentKey ? getDocumentStatus(documentKey) : "not-created";
              const statusConfig = getStatusConfig(status);
              const isActive = activeDocument === template.id && isGeneratingDocument;

              return (
                <Card key={template.id} className={`border-l-4 ${
                  template.type === "investment" ? "border-l-green-400" :
                  template.type === "program" ? "border-l-blue-400" :
                  "border-l-purple-400"
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          {template.required && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge variant="outline" className={statusConfig.color}>
                            <statusConfig.icon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                        
                        {status === "pending" && documentKey && startup.documents[documentKey]?.url && (
                          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded text-sm">
                            <Mail className="w-4 h-4" />
                            <span>Sent to {startup.founderEmail} for signature</span>
                          </div>
                        )}
                        
                        {status === "signed" && (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Signed and completed</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {status === "not-created" && (
                          <Button
                            onClick={() => handleGenerateDocument(template)}
                            disabled={isGeneratingDocument}
                            size="sm"
                          >
                            {isActive ? (
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            {isActive ? "Generating..." : "Generate & Send"}
                          </Button>
                        )}
                        
                        {status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(template.id)}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Remind
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => documentKey && handleMarkAsSigned(documentKey)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Signed
                            </Button>
                          </>
                        )}
                        
                        {status === "signed" && documentKey && startup.documents[documentKey]?.url && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                        
                        {documentKey && startup.documents[documentKey]?.url && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* E-Signature Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            E-Signature Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">DocuSign Integration</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Automatic document generation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Email delivery to signers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Real-time status tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Automatic reminders
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Document Security</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  256-bit SSL encryption
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Audit trail logging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Legal compliance certified
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Tamper-proof signatures
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Document Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Program Agreement generated</div>
                <div className="text-sm text-gray-600">2 hours ago</div>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Pending
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <div className="font-medium">Reminder sent to founder</div>
                <div className="text-sm text-gray-600">1 day ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}