"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ExternalLink } from "lucide-react";

interface EmbedCodeProps {
  formId: string;
  formTitle: string;
}

export function EmbedCode({ formId, formTitle }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [iframeWidth, setIframeWidth] = useState("100%");
  const [iframeHeight, setIframeHeight] = useState("600px");

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const formUrl = `${baseUrl}/form/${formId}`;

  const iframeCode = `<iframe 
  src="${formUrl}" 
  width="${iframeWidth}" 
  height="${iframeHeight}" 
  frameborder="0" 
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  title="${formTitle}"
></iframe>`;

  const linkCode = `<a href="${formUrl}" target="_blank" rel="noopener noreferrer">
  ${formTitle}
</a>`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const openForm = () => {
    window.open(formUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Share Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Form Link</Label>
          <div className="flex gap-2">
            <Input value={formUrl} readOnly className="flex-1" />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(formUrl)}
              className="min-w-[100px]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" onClick={openForm}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
        </div>

        <Tabs defaultValue="iframe" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="iframe">iFrame</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="iframe" className="space-y-4">
            <div className="space-y-2">
              <Label>iFrame Size</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="text-xs">
                    Width
                  </Label>
                  <Input
                    id="width"
                    value={iframeWidth}
                    onChange={(e) => setIframeWidth(e.target.value)}
                    placeholder="e.g. 100% or 500px"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">
                    Height
                  </Label>
                  <Input
                    id="height"
                    value={iframeHeight}
                    onChange={(e) => setIframeHeight(e.target.value)}
                    placeholder="e.g. 600px"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>HTML Code</Label>
              <div className="relative">
                <textarea
                  value={iframeCode}
                  readOnly
                  className="w-full h-32 p-3 text-sm font-mono bg-gray-50 border rounded-md resize-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(iframeCode)}
                  className="absolute top-2 right-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-md p-4 bg-gray-50">
                <iframe
                  src={formUrl}
                  width={iframeWidth}
                  height={iframeHeight}
                  frameBorder="0"
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  title={formTitle}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label>HTML Link Code</Label>
              <div className="relative">
                <textarea
                  value={linkCode}
                  readOnly
                  className="w-full h-20 p-3 text-sm font-mono bg-gray-50 border rounded-md resize-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(linkCode)}
                  className="absolute top-2 right-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label>Custom JavaScript Code</Label>
              <div className="relative">
                <textarea
                  value={`// Add this code to your website
const formContainer = document.getElementById('form-container');
const iframe = document.createElement('iframe');
iframe.src = '${formUrl}';
iframe.width = '100%';
iframe.height = '600px';
iframe.frameBorder = '0';
iframe.style.border = 'none';
iframe.style.borderRadius = '8px';
iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
iframe.title = '${formTitle}';
formContainer.appendChild(iframe);`}
                  readOnly
                  className="w-full h-40 p-3 text-sm font-mono bg-gray-50 border rounded-md resize-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(`// Add this code to your website
const formContainer = document.getElementById('form-container');
const iframe = document.createElement('iframe');
iframe.src = '${formUrl}';
iframe.width = '100%';
iframe.height = '600px';
iframe.frameBorder = '0';
iframe.style.border = 'none';
iframe.style.borderRadius = '8px';
iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
iframe.title = '${formTitle}';
formContainer.appendChild(iframe);`)
                  }
                  className="absolute top-2 right-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>iFrame:</strong> Paste the HTML code directly on your
              website
            </li>
            <li>
              • <strong>Link:</strong> Create a link to the form
            </li>
            <li>
              • <strong>Custom:</strong> Use JavaScript to dynamically add the
              form
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
