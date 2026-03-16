'use client';

import { demoActions } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import {
  ShoppingCart,
  ArrowRightLeft,
  Shield,
  QrCode,
  Tag,
  XCircle,
  Flame,
  PlusCircle,
} from 'lucide-react';

const actionIcons: Record<string, React.ReactNode> = {
  PURCHASE: <ShoppingCart size={16} className="text-green-600" />,
  TRANSFER: <ArrowRightLeft size={16} className="text-blue-600" />,
  VERIFY: <Shield size={16} className="text-purple-600" />,
  REDEEM: <QrCode size={16} className="text-amber-600" />,
  LIST_RESALE: <Tag size={16} className="text-orange-600" />,
  CANCEL: <XCircle size={16} className="text-red-600" />,
  BURN: <Flame size={16} className="text-red-600" />,
  MINT: <PlusCircle size={16} className="text-brand-600" />,
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

export default function ActivityPage() {
  const actions = [...demoActions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Transaction History</h2>
          <p className="text-xs text-gray-500 mt-1">{actions.length} actions recorded on the DUAL network</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action, i) => (
              <div key={action.id} className="flex items-start gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {actionIcons[action.type] || <Shield size={16} className="text-gray-400" />}
                  </div>
                  {i < actions.length - 1 && <div className="w-px h-8 bg-gray-200 mt-1" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{action.description}</p>
                    <Badge className={statusColors[action.status] || 'bg-gray-100 text-gray-600'}>
                      {action.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{formatDateTime(action.timestamp)}</span>
                    <span className="font-mono">{action.type}</span>
                    <span className="font-mono text-gray-400">{action.objectId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
