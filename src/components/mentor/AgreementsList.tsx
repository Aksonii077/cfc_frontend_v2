import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Send,
  Edit,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";

interface Agreement {
  id: string;
  companyName: string;
  founderName: string;
  agreementType: string;
  status: "draft" | "pending_signature" | "signed" | "active";
  createdDate: string;
  signedDate?: string;
  expiryDate?: string;
  terms: string;
}

export function AgreementsList() {
  const [filter, setFilter] = useState<"all" | "draft" | "pending_signature" | "signed">("all");

  // Mock data
  const agreements: Agreement[] = [
    {
      id: "1",
      companyName: "TechFlow AI",
      founderName: "Sarah Chen",
      agreementType: "Mentorship Agreement",
      status: "signed",
      createdDate: "2024-01-15",
      signedDate: "2024-01-18",
      expiryDate: "2025-01-18",
      terms: "6-month mentorship program with monthly meetings",
    },
    {
      id: "2",
      companyName: "EcoGrow",
      founderName: "Michael Torres",
      agreementType: "Incubator Agreement",
      status: "pending_signature",
      createdDate: "2024-01-17",
      terms: "12-month incubation with equity stake",
    },
    {
      id: "3",
      companyName: "HealthBridge",
      founderName: "Emily Watson",
      agreementType: "Advisory Agreement",
      status: "draft",
      createdDate: "2024-01-19",
      terms: "Advisory role with quarterly reviews",
    },
  ];

  const filteredAgreements = agreements.filter((agreement) => {
    if (filter === "all") return true;
    return agreement.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
      case "pending_signature":
        return "bg-[#F5F5F5] text-[#114DFF] border-[#C8D6FF]";
      case "signed":
      case "active":
        return "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]";
      default:
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit className="w-4 h-4" />;
      case "pending_signature":
        return <Clock className="w-4 h-4" />;
      case "signed":
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const stats = {
    total: agreements.length,
    draft: agreements.filter((a) => a.status === "draft").length,
    pending: agreements.filter((a) => a.status === "pending_signature").length,
    signed: agreements.filter((a) => a.status === "signed" || a.status === "active").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Agreements & Contracts</h2>
        <p className="text-gray-600">Manage mentorship and incubation agreements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#114DFF]">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Agreements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-700">{stats.draft}</p>
              <p className="text-sm text-gray-600">Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#114DFF]">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#06CB1D]">{stats.signed}</p>
              <p className="text-sm text-gray-600">Signed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              All Agreements
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("draft")}
              className={
                filter === "draft"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Drafts
            </Button>
            <Button
              variant={filter === "pending_signature" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending_signature")}
              className={
                filter === "pending_signature"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Pending
            </Button>
            <Button
              variant={filter === "signed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("signed")}
              className={
                filter === "signed"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Signed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.map((agreement) => (
          <Card
            key={agreement.id}
            className="border-[#C8D6FF] hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {agreement.companyName}
                    </h3>
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                      {agreement.agreementType}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(agreement.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(agreement.status)}
                        {getStatusLabel(agreement.status)}
                      </span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <User className="w-4 h-4" />
                    <span>{agreement.founderName}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Terms:</p>
                    <p className="text-sm text-gray-600">{agreement.terms}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {agreement.createdDate}</span>
                    </div>
                    {agreement.signedDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#06CB1D]" />
                        <span>Signed {agreement.signedDate}</span>
                      </div>
                    )}
                    {agreement.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Expires {agreement.expiryDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {agreement.status === "draft" && (
                    <>
                      <Button
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </Button>
                    </>
                  )}
                  {agreement.status === "pending_signature" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  )}
                  {(agreement.status === "signed" || agreement.status === "active") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgreements.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agreements found</h3>
          <p className="text-gray-600">
            {filter !== "all"
              ? `No ${getStatusLabel(filter)} agreements at this time`
              : "Agreements will appear here when created"}
          </p>
        </div>
      )}
    </div>
  );
}