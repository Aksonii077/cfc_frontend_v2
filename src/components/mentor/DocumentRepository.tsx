import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { PortfolioStartup } from "./PortfolioManagement";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  FolderOpen,
  Trash2,
  Edit,
  Share,
  Clock,
  User,
  Calendar,
  Plus,
  File,
  Image,
  Video,
  Archive,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "pitch-deck" | "financial" | "legal" | "product" | "marketing" | "other";
  fileType: "pdf" | "docx" | "xlsx" | "pptx" | "png" | "jpg" | "mp4";
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  url: string;
  version: number;
  isShared: boolean;
  description?: string;
  tags: string[];
}

interface DocumentRepositoryProps {
  startup: PortfolioStartup;
}

export function DocumentRepository({ startup }: DocumentRepositoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock document data - in real app, this would come from the database
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Series A Pitch Deck v3.2",
      type: "pitch-deck",
      fileType: "pptx",
      size: 2400000,
      uploadedBy: "Sarah Chen",
      uploadedAt: "2024-01-15",
      lastModified: "2024-01-18",
      url: "/documents/pitch-deck-v3.2.pptx",
      version: 3,
      isShared: true,
      description: "Updated pitch deck with Q4 metrics and Series A projections",
      tags: ["series-a", "funding", "current"]
    },
    {
      id: "2",
      name: "Q4 2023 Financial Report",
      type: "financial",
      fileType: "xlsx",
      size: 890000,
      uploadedBy: "Finance Team",
      uploadedAt: "2024-01-10",
      lastModified: "2024-01-12",
      url: "/documents/q4-financial-report.xlsx",
      version: 2,
      isShared: false,
      description: "Comprehensive Q4 financial analysis including revenue, expenses, and projections",
      tags: ["q4", "financial", "revenue"]
    },
    {
      id: "3",
      name: "Product Roadmap 2024",
      type: "product",
      fileType: "pdf",
      size: 1200000,
      uploadedBy: "Product Team",
      uploadedAt: "2024-01-08",
      lastModified: "2024-01-08",
      url: "/documents/product-roadmap-2024.pdf",
      version: 1,
      isShared: true,
      description: "Detailed product development roadmap for 2024 with feature priorities",
      tags: ["product", "roadmap", "2024"]
    },
    {
      id: "4",
      name: "Incorporation Documents",
      type: "legal",
      fileType: "pdf",
      size: 450000,
      uploadedBy: "Legal Team",
      uploadedAt: "2023-12-20",
      lastModified: "2023-12-20",
      url: "/documents/incorporation-docs.pdf",
      version: 1,
      isShared: false,
      description: "Official incorporation documents and company structure",
      tags: ["legal", "incorporation", "official"]
    },
    {
      id: "5",
      name: "Customer Demo Video",
      type: "marketing",
      fileType: "mp4",
      size: 15600000,
      uploadedBy: "Marketing Team",
      uploadedAt: "2024-01-05",
      lastModified: "2024-01-05",
      url: "/documents/customer-demo.mp4",
      version: 1,
      isShared: true,
      description: "Product demonstration video for customer onboarding",
      tags: ["demo", "video", "marketing"]
    },
    {
      id: "6",
      name: "Cap Table Current",
      type: "financial",
      fileType: "xlsx",
      size: 120000,
      uploadedBy: "Sarah Chen",
      uploadedAt: "2024-01-12",
      lastModified: "2024-01-15",
      url: "/documents/cap-table-current.xlsx",
      version: 4,
      isShared: false,
      description: "Current capitalization table with all equity distributions",
      tags: ["cap-table", "equity", "current"]
    }
  ]);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf": return <FileText className="w-5 h-5 text-[#FF220E]" />;
      case "docx": return <FileText className="w-5 h-5 text-[#114DFF]" />;
      case "xlsx": return <FileText className="w-5 h-5 text-[#06CB1D]" />;
      case "pptx": return <FileText className="w-5 h-5 text-[#3CE5A7]" />;
      case "png":
      case "jpg": return <Image className="w-5 h-5 text-[#114DFF]" />;
      case "mp4": return <Video className="w-5 h-5 text-[#114DFF]" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pitch-deck": return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "financial": return "bg-[#06CB1D]/10 text-[#06CB1D] border-[#06CB1D]/30";
      case "legal": return "bg-[#FF220E]/10 text-[#FF220E] border-[#FF220E]/30";
      case "product": return "bg-[#114DFF]/10 text-[#114DFF] border-[#C8D6FF]";
      case "marketing": return "bg-[#3CE5A7]/10 text-[#3CE5A7] border-[#3CE5A7]/30";
      default: return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || doc.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const documentTypes = [
    { value: "all", label: "All Documents" },
    { value: "pitch-deck", label: "Pitch Decks" },
    { value: "financial", label: "Financial" },
    { value: "legal", label: "Legal" },
    { value: "product", label: "Product" },
    { value: "marketing", label: "Marketing" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Document Repository</h2>
          <p className="text-gray-600">Shared repository for all important startup files</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#114DFF]" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#C8D6FF]"
            />
          </div>
          

        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : "border-[#C8D6FF] hover:bg-[#EDF2FF]"}
          >
            List
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : "border-[#C8D6FF] hover:bg-[#EDF2FF]"}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* Document Statistics */}


      {/* Document List/Grid */}
      {viewMode === "list" ? (
        <Card className="border-[#C8D6FF]">
          <CardHeader>
            <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF]"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getFileIcon(document.fileType)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-gray-900 truncate">{document.name}</h4>
                        <Badge variant="outline" className={getTypeColor(document.type)}>
                          {document.type.replace("-", " ")}
                        </Badge>
                        {document.isShared && (
                          <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                            <Share className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                        {document.version > 1 && (
                          <Badge variant="outline" className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                            v{document.version}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatFileSize(document.size)}</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {document.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(document.lastModified)}
                        </span>
                      </div>
                      {document.description && (
                        <p className="text-sm text-gray-600 mt-1 truncate">{document.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="border-[#C8D6FF] hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(document.fileType)}
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <h4 className="text-gray-900 mb-2 line-clamp-2">{document.name}</h4>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={getTypeColor(document.type)}>
                    {document.type.replace("-", " ")}
                  </Badge>
                  {document.isShared && (
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                      <Share className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Size</span>
                    <span>{formatFileSize(document.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Modified</span>
                    <span>{formatDate(document.lastModified)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Version</span>
                    <span>v{document.version}</span>
                  </div>
                </div>
                
                {document.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{document.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 mx-auto text-[#C8D6FF] mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedType !== "all" 
              ? "Try adjusting your search or filters"
              : "Upload your first document to get started"
            }
          </p>
          <Button onClick={() => setShowUploadModal(true)} className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border-[#C8D6FF]">
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="w-12 h-12 mx-auto text-[#C8D6FF] mb-4" />
                <p className="text-gray-600 mb-4">Upload functionality would be implemented here</p>
                <Button onClick={() => setShowUploadModal(false)} className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}