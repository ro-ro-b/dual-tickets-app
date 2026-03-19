'use client';

import { demoTemplates } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { FileCode, Check } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">DUAL Templates</h2>
          <p className="text-sm text-gray-500">Token schemas registered on the DUAL network</p>
        </div>
      </div>

      {demoTemplates.map((template) => (
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
      ))}
    </div>
  );
}
