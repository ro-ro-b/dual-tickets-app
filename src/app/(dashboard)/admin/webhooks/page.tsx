'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { Webhook, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const demoWebhookLog = [
  { id: 'wh-001', event: 'ticket.purchased', objectId: 'tkt-001', status: 'delivered', timestamp: new Date(Date.now() - 300000).toISOString(), statusCode: 200 },
  { id: 'wh-002', event: 'ticket.anchored', objectId: 'tkt-001', status: 'delivered', timestamp: new Date(Date.now() - 295000).toISOString(), statusCode: 200 },
  { id: 'wh-003', event: 'ticket.purchased', objectId: 'tkt-002', status: 'delivered', timestamp: new Date(Date.now() - 600000).toISOString(), statusCode: 200 },
  { id: 'wh-004', event: 'ticket.transferred', objectId: 'tkt-005', status: 'delivered', timestamp: new Date(Date.now() - 1200000).toISOString(), statusCode: 200 },
  { id: 'wh-005', event: 'ticket.redeemed', objectId: 'tkt-005', status: 'delivered', timestamp: new Date(Date.now() - 900000).toISOString(), statusCode: 200 },
  { id: 'wh-006', event: 'ticket.listed', objectId: 'tkt-006', status: 'failed', timestamp: new Date(Date.now() - 180000).toISOString(), statusCode: 500 },
  { id: 'wh-007', event: 'ticket.purchased', objectId: 'tkt-009', status: 'delivered', timestamp: new Date(Date.now() - 60000).toISOString(), statusCode: 200 },
  { id: 'wh-008', event: 'ticket.anchoring', objectId: 'tkt-009', status: 'pending', timestamp: new Date(Date.now() - 30000).toISOString(), statusCode: null },
];

const eventColors: Record<string, string> = {
  'ticket.purchased': 'bg-green-100 text-green-800',
  'ticket.anchored': 'bg-blue-100 text-blue-800',
  'ticket.transferred': 'bg-purple-100 text-purple-800',
  'ticket.redeemed': 'bg-amber-100 text-amber-800',
  'ticket.listed': 'bg-orange-100 text-orange-800',
  'ticket.anchoring': 'bg-yellow-100 text-yellow-800',
};

export default function WebhooksPage() {
  const delivered = demoWebhookLog.filter(w => w.status === 'delivered').length;
  const failed = demoWebhookLog.filter(w => w.status === 'failed').length;
  const pending = demoWebhookLog.filter(w => w.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <CheckCircle size={20} className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Delivered</p>
              <p className="text-lg font-bold text-gray-900">{delivered}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <AlertCircle size={20} className="text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Failed</p>
              <p className="text-lg font-bold text-gray-900">{failed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <Clock size={20} className="text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-bold text-gray-900">{pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhook log */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Webhook size={18} className="text-brand-600" />
          <h2 className="font-semibold text-gray-900">Webhook Event Log</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2 font-medium">Event</th>
                  <th className="pb-2 font-medium">Object</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Code</th>
                  <th className="pb-2 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demoWebhookLog.map((wh) => (
                  <tr key={wh.id} className="hover:bg-gray-50">
                    <td className="py-2.5">
                      <Badge className={eventColors[wh.event] || 'bg-gray-100 text-gray-600'}>{wh.event}</Badge>
                    </td>
                    <td className="py-2.5 font-mono text-xs text-gray-600">{wh.objectId}</td>
                    <td className="py-2.5">
                      <Badge className={
                        wh.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        wh.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {wh.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 font-mono text-xs">{wh.statusCode || '—'}</td>
                    <td className="py-2.5 text-xs text-gray-500">{formatDateTime(wh.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
