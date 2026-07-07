"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Save, Globe, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CmsPage = {
  title?: string;
  subtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  description?: string;
  features?: Array<{ title: string; description: string }>;
  pricingTiers?: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
  faqs?: Array<{ question: string; answer: string }>;
  ctaTitle?: string;
  ctaDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
};

type CmsData = Record<string, CmsPage>;

const PAGE_KEYS = ["home", "about", "pricing", "solutions", "contact"] as const;

function JsonEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-xs min-h-[500px] bg-black/40 border-white/10 text-white/90"
      spellCheck={false}
    />
  );
}

function FormEditor({
  data,
  onChange,
}: {
  data: CmsPage;
  onChange: (d: CmsPage) => void;
}) {
  const update = (key: keyof CmsPage, value: unknown) => {
    onChange({ ...data, [key]: value });
  };

  const updateFeature = (
    idx: number,
    field: "title" | "description",
    value: string
  ) => {
    const features = [...(data.features || [])];
    features[idx] = { ...features[idx], [field]: value };
    update("features", features);
  };

  const addFeature = () => {
    update("features", [
      ...(data.features || []),
      { title: "", description: "" },
    ]);
  };

  const removeFeature = (idx: number) => {
    const features = [...(data.features || [])];
    features.splice(idx, 1);
    update("features", features);
  };

  const updateFaq = (
    idx: number,
    field: "question" | "answer",
    value: string
  ) => {
    const faqs = [...(data.faqs || [])];
    faqs[idx] = { ...faqs[idx], [field]: value };
    update("faqs", faqs);
  };

  const addFaq = () => {
    update("faqs", [...(data.faqs || []), { question: "", answer: "" }]);
  };

  const removeFaq = (idx: number) => {
    const faqs = [...(data.faqs || [])];
    faqs.splice(idx, 1);
    update("faqs", faqs);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Page Title</Label>
        <Input
          value={data.title || ""}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Page title"
          className="bg-black/40 border-white/10"
        />
      </div>

      <div className="space-y-3">
        <Label>Subtitle</Label>
        <Input
          value={data.subtitle || ""}
          onChange={(e) => update("subtitle", e.target.value)}
          placeholder="Subtitle"
          className="bg-black/40 border-white/10"
        />
      </div>

      <div className="space-y-3">
        <Label>Hero Title</Label>
        <Input
          value={data.heroTitle || ""}
          onChange={(e) => update("heroTitle", e.target.value)}
          placeholder="Hero title"
          className="bg-black/40 border-white/10"
        />
      </div>

      <div className="space-y-3">
        <Label>Hero Description</Label>
        <Textarea
          value={data.heroDescription || ""}
          onChange={(e) => update("heroDescription", e.target.value)}
          placeholder="Hero description"
          className="bg-black/40 border-white/10 min-h-[80px]"
        />
      </div>

      <div className="space-y-3">
        <Label>Description</Label>
        <Textarea
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Page description"
          className="bg-black/40 border-white/10 min-h-[80px]"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Features</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="border-white/10 text-white/70 hover:bg-white/5"
          >
            + Add Feature
          </Button>
        </div>
        {(data.features || []).map((f, i) => (
          <div
            key={i}
            className="space-y-2 p-3 rounded-lg border border-white/10 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Feature {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(i)}
                className="h-6 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Remove
              </Button>
            </div>
            <Input
              value={f.title}
              onChange={(e) => updateFeature(i, "title", e.target.value)}
              placeholder="Feature title"
              className="bg-black/40 border-white/10"
            />
            <Textarea
              value={f.description}
              onChange={(e) =>
                updateFeature(i, "description", e.target.value)
              }
              placeholder="Feature description"
              className="bg-black/40 border-white/10 min-h-[60px]"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>FAQs</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFaq}
            className="border-white/10 text-white/70 hover:bg-white/5"
          >
            + Add FAQ
          </Button>
        </div>
        {(data.faqs || []).map((f, i) => (
          <div
            key={i}
            className="space-y-2 p-3 rounded-lg border border-white/10 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">FAQ {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFaq(i)}
                className="h-6 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Remove
              </Button>
            </div>
            <Input
              value={f.question}
              onChange={(e) => updateFaq(i, "question", e.target.value)}
              placeholder="Question"
              className="bg-black/40 border-white/10"
            />
            <Textarea
              value={f.answer}
              onChange={(e) => updateFaq(i, "answer", e.target.value)}
              placeholder="Answer"
              className="bg-black/40 border-white/10 min-h-[60px]"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label>CTA Title</Label>
        <Input
          value={data.ctaTitle || ""}
          onChange={(e) => update("ctaTitle", e.target.value)}
          placeholder="CTA title"
          className="bg-black/40 border-white/10"
        />
      </div>

      <div className="space-y-3">
        <Label>CTA Description</Label>
        <Textarea
          value={data.ctaDescription || ""}
          onChange={(e) => update("ctaDescription", e.target.value)}
          placeholder="CTA description"
          className="bg-black/40 border-white/10 min-h-[60px]"
        />
      </div>

      <div className="space-y-3">
        <Label>Meta Title</Label>
        <Input
          value={data.metaTitle || ""}
          onChange={(e) => update("metaTitle", e.target.value)}
          placeholder="SEO meta title"
          className="bg-black/40 border-white/10"
        />
      </div>

      <div className="space-y-3">
        <Label>Meta Description</Label>
        <Textarea
          value={data.metaDescription || ""}
          onChange={(e) => update("metaDescription", e.target.value)}
          placeholder="SEO meta description"
          className="bg-black/40 border-white/10 min-h-[60px]"
        />
      </div>
    </div>
  );
}

export default function CmsAdminPage() {
  const { data, loading, error } = useApi<CmsData>("/api/v1/cms/content");
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [cmsData, setCmsData] = useState<CmsData>({});
  const [jsonText, setJsonText] = useState<string>("{}");
  const [jsonError, setJsonError] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editMode, setEditMode] = useState<"form" | "json">("form");

  useEffect(() => {
    if (data) {
      setCmsData(data);
    }
  }, [data]);

  useEffect(() => {
    const pageData = cmsData[selectedPage] || {};
    setJsonText(JSON.stringify(pageData, null, 2));
    setJsonError("");
  }, [selectedPage, cmsData]);

  const handleSave = async () => {
    let content: CmsPage;

    if (editMode === "json") {
      try {
        content = JSON.parse(jsonText);
      } catch {
        setJsonError("Invalid JSON");
        return;
      }
    } else {
      content = cmsData[selectedPage] || {};
    }

    setSaving(true);
    setSaveSuccess(false);
    setJsonError("");

    try {
      const res = await fetch("/api/v1/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: selectedPage, content }),
      });
      const result = await res.json();

      if (result.success) {
        setSaveSuccess(true);
        setCmsData((prev) => ({
          ...prev,
          [selectedPage]: result.data,
        }));
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setJsonError(result.error || "Save failed");
      }
    } catch {
      setJsonError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      JSON.parse(text);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-400">
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed to load CMS content
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Content Editor</h1>
          <p className="text-sm text-white/50 mt-1">
            Edit marketing page content without code changes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Saved
            </div>
          )}
          {jsonError && (
            <div className="flex items-center gap-1.5 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {jsonError}
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !!jsonError}
            className="bg-white text-black hover:bg-white/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Globe className="w-4 h-4 text-white/40" />
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="w-[200px] h-9 px-3 rounded-md bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
        >
          {PAGE_KEYS.map((key) => (
            <option key={key} value={key} className="bg-[#1a1a1a] text-white">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => setEditMode("form")}
            className={cn(
              "px-3 py-1.5 text-xs rounded-md transition-colors",
              editMode === "form"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            )}
          >
            Form
          </button>
          <button
            onClick={() => setEditMode("json")}
            className={cn(
              "px-3 py-1.5 text-xs rounded-md transition-colors",
              editMode === "json"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            )}
          >
            JSON
          </button>
        </div>
      </div>

      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-6">
          {editMode === "json" ? (
            <JsonEditor value={jsonText} onChange={handleJsonChange} />
          ) : (
            <FormEditor
              data={cmsData[selectedPage] || {}}
              onChange={(d) =>
                setCmsData((prev) => ({ ...prev, [selectedPage]: d }))
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
