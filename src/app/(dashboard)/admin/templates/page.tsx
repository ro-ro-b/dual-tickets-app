'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { FileCode, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  fields: Array<{ name: string; type: string; required: boolean }>;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch from /api/templates
        const response = await fetch('/api/templates');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const json = await response.json();
        const items = json?.data || json || [];
        setTemplates(Array.isArray(items) ? items : []);
      } catch (err: any) {
        setError(err.message);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">DUAL Templates</h2>
          <p className="text-sm text-gray-500">Token schemas registered on the DUAL network</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 mt-4">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading templates: {error}</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found</p>
        </div>
      ) : (
        templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-50">
                <FileCode size={18} className="text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-mono text-sm">{template.name}</h3>
                <p className="text-xs text-gray-500">v{template.version} &middot; Created {formatDate(template.createdAt)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 font-mono mb-3">ID: {template.id}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Fields:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {template.fields.map((field: any) => (
                    <div key={field.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <code className="text-xs font-mono text-gray-800 flex-1">{field.name}</code>
                      <Badge className="bg-gray-200 text-gray-600 text-[10px]">{field.type}</Badge>
                      {field.required && <Check size={12} className="text-green-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
