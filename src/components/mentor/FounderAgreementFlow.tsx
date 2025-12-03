import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner@2.0.3";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Send,
  Clock,
  AlertCircle,
  User,
  Building,
} from "lucide-react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  mentorName: string;
  mentorCompany: string;
  status: string;
}

interface TermsVersion {
  version: number;
  tenure: string;
  equity: string;
  deliverables: string;
  status: string;
  submittedBy: "mentor" | "founder";
  submittedAt: string;
  timestamp: string;
}

interface FounderAgreementFlowProps {
  application: Application;
  onClose: () => void;
}

export function FounderAgreementFlow({
  application,
  onClose,
}: FounderAgreementFlowProps) {
  // Mock terms data - in production, this would come from the database
  const getInitialTermsVersions = (): TermsVersion[] => {
    return [
      {
        version: 1,
        tenure: "12 months",
        equity: "2.5%",
        deliverables: `Time Commitment: 2 hours a Month

Network Introductions: Yes

Expertise & Guidance:
• Guidance on Product Development
• Guidance on Branding & Marketing
• Guidance on Go To Market

Additional Deliverables:
• Access to investor network
• Quarterly business reviews`,
        status: "pending-review",
        submittedBy: "mentor",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
      },
    ];
  };

  const [termsVersions, setTermsVersions] = useState<TermsVersion[]>(getInitialTermsVersions());
  const [showCounterProposal, setShowCounterProposal] = useState(false);

  // Counter-proposal form state
  const [tenure, setTenure] = useState("12");
  const [tenureOther, setTenureOther] = useState("");
  const [equityPercentage, setEquityPercentage] = useState("2.5");
  const [equityOther, setEquityOther] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("2-hours-month");
  const [timeCommitmentOther, setTimeCommitmentOther] = useState("");
  const [networkIntroductions, setNetworkIntroductions] = useState("yes");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseOther, setExpertiseOther] = useState("");
  const [deliverables, setDeliverables] = useState("");

  const getEquityValidation = (equity: number) => {
    if (equity < 2) return { status: "too-low", message: "Equity percentage is lower than standard (2.5%)", color: "text-[#FF220E]" };
    if (equity > 5) return { status: "too-high", message: "Equity percentage is higher than standard (2.5%)", color: "text-[#FF220E]" };
    if (equity >= 2 && equity <= 3) return { status: "optimal", message: "Equity percentage is within optimal range", color: "text-[#06CB1D]" };
    return { status: "acceptable", message: "Equity percentage is acceptable", color: "text-[#114DFF]" };
  };

  const handleAcceptTerms = () => {
    toast.success("Terms Accepted!", {
      description: `You have accepted the mentorship terms from ${application.mentorName}. Final agreement documents will be prepared.`,
      duration: 5000,
    });

    // In production:
    // 1. Update application status in database
    // 2. Send notification to mentor
    // 3. Trigger agreement document generation

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSubmitCounterProposal = () => {
    // Get final values
    const finalTenure = tenure === "other" ? tenureOther : tenure;
    const finalEquity = equityPercentage === "other" ? equityOther : equityPercentage;
    const finalTimeCommitment = timeCommitment === "other" ? timeCommitmentOther :
      timeCommitment === "2-hours-month" ? "2 hours a Month" : "2 hours a Fortnight";

    // Build expertise list
    const expertiseLabels = {
      "product": "Guidance on Product Development",
      "marketing": "Guidance on Branding & Marketing",
      "finance": "Guidance on Finance",
      "operations": "Guidance on Operations",
      "gtm": "Guidance on Go To Market",
      "hiring": "Guidance on Hiring",
      "other": expertiseOther || "Other"
    };

    const expertiseList = expertise.map(id => expertiseLabels[id as keyof typeof expertiseLabels]).join("\n• ");

    // Build complete deliverables text
    const completeDeliverables = `Time Commitment: ${finalTimeCommitment}

Network Introductions: ${networkIntroductions === "yes" ? "Yes" : "No"}

Expertise & Guidance:
• ${expertiseList}${deliverables ? "\n\nAdditional Deliverables:\n" + deliverables : ""}`;

    const newVersion: TermsVersion = {
      version: termsVersions.length + 1,
      tenure: finalTenure + " months",
      equity: finalEquity + "%",
      deliverables: completeDeliverables,
      status: "pending-review",
      submittedBy: "founder",
      submittedAt: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
    };

    setTermsVersions([...termsVersions, newVersion]);
    setShowCounterProposal(false);

    toast.success("Counter-Proposal Submitted", {
      description: `Your counter-proposal has been sent to ${application.mentorName} for review.`,
      duration: 5000,
    });

    // In production:
    // 1. Save new terms version to database
    // 2. Send email notification to mentor
    // 3. Update application status if needed
  };

  const latestTerms = termsVersions[termsVersions.length - 1];
  const isPendingFounderResponse = latestTerms.submittedBy === "mentor";

  if (showCounterProposal) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowCounterProposal(false)}
              className="mb-4 border-[#C8D6FF] hover:bg-[#EDF2FF]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Terms Review
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-2">Propose Counter-Terms</h1>
                <p className="text-gray-600">
                  Modify the terms and submit your counter-proposal to {application.mentorName}
                </p>
              </div>
              <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Version {termsVersions.length + 1}
              </Badge>
            </div>
          </div>

          {/* Counter-Proposal Form */}
          <div className="space-y-6">
            {/* Tenure */}
            <Card className="border-[#C8D6FF] bg-white">
              <CardContent className="p-5">
                <Label className="mb-3 block">Tenure (Months) *</Label>
                <RadioGroup value={tenure} onValueChange={setTenure} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="12" id="tenure-12" />
                    <Label htmlFor="tenure-12" className="cursor-pointer flex-1">
                      <span className="text-gray-900">12 Months</span>
                      <span className="text-gray-500 text-xs ml-2">(1 year)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="18" id="tenure-18" />
                    <Label htmlFor="tenure-18" className="cursor-pointer flex-1">
                      <span className="text-gray-900">18 Months</span>
                      <span className="text-gray-500 text-xs ml-2">(1.5 years)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="24" id="tenure-24" />
                    <Label htmlFor="tenure-24" className="cursor-pointer flex-1">
                      <span className="text-gray-900">24 Months</span>
                      <span className="text-gray-500 text-xs ml-2">(2 years)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="other" id="tenure-other" />
                    <Label htmlFor="tenure-other" className="cursor-pointer flex-1 text-gray-900">Custom Duration</Label>
                  </div>
                </RadioGroup>

                {tenure === "other" && (
                  <div className="mt-3 ml-8">
                    <Input
                      type="number"
                      value={tenureOther}
                      onChange={(e) => setTenureOther(e.target.value)}
                      placeholder="Enter months (e.g., 6, 30, 36)"
                      className="bg-[#F7F9FF] border-[#C8D6FF]"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">Duration of the mentorship/incubation program</p>
              </CardContent>
            </Card>

            {/* Equity Percentage */}
            <Card className="border-[#C8D6FF] bg-white">
              <CardContent className="p-5">
                <Label className="mb-3 block">Equity Percentage *</Label>
                <RadioGroup value={equityPercentage} onValueChange={setEquityPercentage} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border-2 border-[#114DFF] bg-[#EDF2FF] rounded-lg cursor-pointer">
                    <RadioGroupItem value="2.5" id="equity-2.5" />
                    <Label htmlFor="equity-2.5" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">2.5%</span>
                        <Badge variant="outline" className="bg-[#06CB1D]/10 text-[#06CB1D] border-[#06CB1D]/30 text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <span className="text-gray-500 text-xs">Standard equity for incubation programs</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="other" id="equity-other" />
                    <Label htmlFor="equity-other" className="cursor-pointer flex-1 text-gray-900">Custom Percentage</Label>
                  </div>
                </RadioGroup>

                {equityPercentage === "other" && (
                  <div className="mt-3 ml-8 space-y-2">
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        value={equityOther}
                        onChange={(e) => setEquityOther(e.target.value)}
                        placeholder="Enter percentage (e.g., 1.5, 3.0, 5.0)"
                        className="bg-[#F7F9FF] border-[#C8D6FF] pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>

                    {equityOther && (
                      <div className={`flex items-center gap-2 text-sm ${getEquityValidation(parseFloat(equityOther)).color}`}>
                        {getEquityValidation(parseFloat(equityOther)).status === "optimal" && <CheckCircle className="w-4 h-4" />}
                        {(getEquityValidation(parseFloat(equityOther)).status === "too-low" ||
                          getEquityValidation(parseFloat(equityOther)).status === "too-high") && <AlertCircle className="w-4 h-4" />}
                        <span>{getEquityValidation(parseFloat(equityOther)).message}</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">Standard equity is 2.5%. Adjust based on program value and startup stage.</p>
              </CardContent>
            </Card>

            {/* Time Commitment */}
            <Card className="border-[#C8D6FF] bg-white">
              <CardContent className="p-5">
                <Label className="mb-3 block">Time Commitment *</Label>
                <RadioGroup value={timeCommitment} onValueChange={setTimeCommitment} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="2-hours-month" id="time-month" />
                    <Label htmlFor="time-month" className="cursor-pointer flex-1">
                      <span className="text-gray-900">2 hours a Month</span>
                      <span className="text-gray-500 text-xs ml-2">(~30 min/week)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="2-hours-fortnight" id="time-fortnight" />
                    <Label htmlFor="time-fortnight" className="cursor-pointer flex-1">
                      <span className="text-gray-900">2 hours a Fortnight</span>
                      <span className="text-gray-500 text-xs ml-2">(~1 hour/week)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="other" id="time-other" />
                    <Label htmlFor="time-other" className="cursor-pointer flex-1 text-gray-900">Custom Time Commitment</Label>
                  </div>
                </RadioGroup>

                {timeCommitment === "other" && (
                  <div className="mt-3 ml-8">
                    <Input
                      value={timeCommitmentOther}
                      onChange={(e) => setTimeCommitmentOther(e.target.value)}
                      placeholder="e.g., 4 hours a week, 1 hour daily"
                      className="bg-[#F7F9FF] border-[#C8D6FF]"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">Time the mentor will dedicate to your startup</p>
              </CardContent>
            </Card>

            {/* Introductions to Network */}
            <Card className="border-[#C8D6FF] bg-white">
              <CardContent className="p-5">
                <Label className="mb-3 block">Introductions to Network *</Label>
                <RadioGroup value={networkIntroductions} onValueChange={setNetworkIntroductions} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="intro-yes" />
                    <Label htmlFor="intro-yes" className="cursor-pointer flex-1">
                      <span className="text-gray-900">Yes</span>
                      <span className="text-gray-500 text-xs ml-2">Mentor will provide network introductions</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="intro-no" />
                    <Label htmlFor="intro-no" className="cursor-pointer flex-1">
                      <span className="text-gray-900">No</span>
                      <span className="text-gray-500 text-xs ml-2">Network introductions not included</span>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500 mt-3">Will mentor provide introductions to investors, partners, or customers?</p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card className="border-[#C8D6FF] bg-white">
              <CardContent className="p-5">
                <Label className="mb-3 block">Expertise & Guidance Areas *</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "product", label: "Product Development" },
                    { id: "marketing", label: "Branding & Marketing" },
                    { id: "finance", label: "Finance" },
                    { id: "operations", label: "Operations" },
                    { id: "gtm", label: "Go To Market" },
                    { id: "hiring", label: "Hiring" },
                    { id: "other", label: "Other" }
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors cursor-pointer ${
                        expertise.includes(item.id)
                          ? 'border-[#114DFF] bg-[#EDF2FF]'
                          : 'border-[#C8D6FF] hover:bg-[#F7F9FF]'
                      }`}
                    >
                      <Checkbox
                        id={`expertise-${item.id}`}
                        checked={expertise.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setExpertise([...expertise, item.id]);
                          } else {
                            setExpertise(expertise.filter(e => e !== item.id));
                          }
                        }}
                      />
                      <Label htmlFor={`expertise-${item.id}`} className="cursor-pointer flex-1 text-gray-900">
                        Guidance on {item.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {expertise.includes("other") && (
                  <div className="mt-3">
                    <Input
                      value={expertiseOther}
                      onChange={(e) => setExpertiseOther(e.target.value)}
                      placeholder="Specify other expertise areas (e.g., Legal, IP, International expansion)"
                      className="bg-[#F7F9FF] border-[#C8D6FF]"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">Select all areas where you need guidance (select at least one)</p>
              </CardContent>
            </Card>

            {/* Additional Deliverables */}
            <Card className="border-[#C8D6FF] bg-white">
              <CardContent className="p-5">
                <Label htmlFor="deliverables" className="mb-3 block">Additional Deliverables (Optional)</Label>
                <textarea
                  id="deliverables"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="Enter any additional specific deliverables:
• Access to investor network
• Quarterly business reviews
• Introduction to potential customers
• Monthly workshops on specific topics"
                  className="w-full min-h-[120px] p-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#114DFF]"
                />
                <p className="text-xs text-gray-500 mt-2">List any additional specific services beyond the core commitment</p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmitCounterProposal}
                disabled={
                  !tenure ||
                  (tenure === "other" && !tenureOther) ||
                  !equityPercentage ||
                  (equityPercentage === "other" && !equityOther) ||
                  !timeCommitment ||
                  (timeCommitment === "other" && !timeCommitmentOther) ||
                  expertise.length === 0 ||
                  (expertise.includes("other") && !expertiseOther)
                }
                className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Counter-Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FF] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="mb-4 border-[#C8D6FF] hover:bg-[#EDF2FF]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Mentorship Agreement Terms</h1>
              <p className="text-gray-600">
                Review the terms proposed by {application.mentorName} from {application.mentorCompany}
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#114DFF] mb-1">Agreement Negotiation Process</h4>
              <p className="text-gray-700 text-sm">
                Review the mentorship terms carefully. You can accept them as-is or propose changes. 
                Once both parties agree on the same terms, the final agreement documents will be prepared.
              </p>
            </div>
          </div>
        </div>

        {/* Current Terms Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Current Terms (Version {latestTerms.version})</h3>
            <Badge variant="outline" className={
              isPendingFounderResponse
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]"
            }>
              <Clock className="w-3 h-3 mr-1" />
              {isPendingFounderResponse ? "Awaiting Your Response" : "Under Review by Mentor"}
            </Badge>
          </div>

          <Card className="border-[#C8D6FF] bg-white">
            <CardContent className="p-6 space-y-5">
              {/* Terms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tenure</p>
                  <p className="text-gray-900">{latestTerms.tenure}</p>
                </div>
                <div className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Equity Percentage</p>
                  <p className="text-[#114DFF]">{latestTerms.equity}</p>
                </div>
                <div className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                  <div className="flex items-center gap-2">
                    {latestTerms.submittedBy === "mentor" ? (
                      <Building className="w-4 h-4 text-[#114DFF]" />
                    ) : (
                      <User className="w-4 h-4 text-[#3CE5A7]" />
                    )}
                    <p className="text-gray-900 capitalize">{latestTerms.submittedBy}</p>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <p className="text-gray-900 mb-2">Deliverables & Commitments:</p>
                <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {latestTerms.deliverables}
                  </p>
                </div>
              </div>

              {/* Submitted Info */}
              <div className="pt-4 border-t border-[#C8D6FF]">
                <p className="text-xs text-gray-500">
                  Submitted on {latestTerms.timestamp}
                </p>
              </div>

              {/* Action Buttons - Only show if latest version is from mentor */}
              {isPendingFounderResponse && (
                <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                  <Button
                    onClick={handleAcceptTerms}
                    className="flex-1 bg-[#06CB1D] hover:bg-[#059e17] text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Terms
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Pre-fill with current values for modification
                      const currentTenure = latestTerms.tenure.replace(" months", "");
                      setTenure(["12", "18", "24"].includes(currentTenure) ? currentTenure : "other");
                      if (!["12", "18", "24"].includes(currentTenure)) {
                        setTenureOther(currentTenure);
                      }

                      const currentEquity = latestTerms.equity.replace("%", "");
                      setEquityPercentage(currentEquity === "2.5" ? "2.5" : "other");
                      if (currentEquity !== "2.5") {
                        setEquityOther(currentEquity);
                      }

                      setShowCounterProposal(true);
                    }}
                    className="flex-1 border-[#114DFF] text-[#114DFF] hover:bg-[#EDF2FF]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Propose Changes
                  </Button>
                </div>
              )}

              {/* Waiting for Mentor Response */}
              {!isPendingFounderResponse && (
                <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#114DFF]">
                    <Clock className="w-4 h-4" />
                    <p>Waiting for {application.mentorName} to review your counter-proposal</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version History */}
          {termsVersions.length > 1 && (
            <Card className="border-[#C8D6FF] bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#114DFF]" />
                  Negotiation History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {termsVersions.slice(0, -1).reverse().map((version) => (
                  <div
                    key={version.version}
                    className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white text-gray-700 border-[#CCCCCC]">
                          Version {version.version}
                        </Badge>
                        <span className="text-gray-600 text-sm">
                          by {version.submittedBy === "mentor" ? application.mentorName : "You"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{version.timestamp}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Tenure:</span> {version.tenure} •{" "}
                      <span className="font-medium">Equity:</span> {version.equity}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
