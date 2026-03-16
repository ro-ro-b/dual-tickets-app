'use client';

import { useParams } from 'next/navigation';
import { demoTickets, demoActions, demoEvents } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TicketStatusBadge, OnChainBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatDateTime, formatCurrency, truncateAddress } from '@/lib/utils';
import { Calendar, MapPin, QrCode, ArrowRightLeft, Shield, Clock, Send, Tag, ExternalLink } from 'lucide-react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const ticket = demoTickets.find(t => t.id === id);

  if (!ticket) {
    return <div className="text-center py-12"><p className="text-gray-500">Ticket not found</p></div>;
  }

  const event = demoEvents.find(e => e.id === ticket.eventId);
  const actions = demoActions.filter(a => a.objectId === ticket.id);
  const isActive = ticket.ticketData.status === 'valid';
  const canResell = isActive && event?.resaleEnabled;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Ticket hero */}
      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-56">
          <img
            src={ticket.faces[0]?.url || ''}
            alt={ticket.ticketData.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex gap-2 mb-2">
              <TicketStatusBadge status={ticket.ticketData.status} />
              <OnChainBadge status={ticket.onChainStatus} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">{ticket.ticketData.eventName}</h1>
            <p className="text-white/80 text-sm mt-1">{ticket.tierName}</p>
          </div>
        </div>

        {/* Tear line */}
        <div className="relative">
          <div className="absolute -left-2 -top-2 w-4 h-4 bg-[#f8fafc] rounded-full" />
          <div className="absolute -right-2 -top-2 w-4 h-4 bg-[#f8fafc] rounded-full" />
          <div className="border-t-2 border-dashed border-gray-200 mx-6" />
        </div>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> Date</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(ticket.ticketData.eventDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Venue</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{ticket.ticketData.venue}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Tag size={12} /> Price Paid</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{formatCurrency(ticket.ticketData.purchasePrice)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> Purchased</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(ticket.ticketData.purchasedAt)}</p>
            </div>
          </div>

          {ticket.ticketData.seatInfo && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Seat Assignment</p>
              <p className="text-sm font-semibold text-gray-900">{ticket.ticketData.seatInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900 flex items-center gap-2"><QrCode size={18} /> Entry QR Code</h2></CardHeader>
          <CardContent className="text-center py-6">
            {isActive ? (
              <>
                <div className="w-48 h-48 mx-auto bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                  {/* Simulated QR code pattern */}
                  <div className="grid grid-cols-8 gap-0.5 p-4">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-gray-900'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-mono text-gray-500">{ticket.ticketData.qrCode}</p>
                <p className="text-xs text-gray-400 mt-2">Present this QR code at the venue entrance</p>
              </>
            ) : (
              <div className="py-8">
                <p className="text-sm text-gray-500">
                  {ticket.ticketData.status === 'used' ? 'This ticket has been redeemed' : 'QR code unavailable'}
                </p>
                {ticket.ticketData.redeemedAt && (
                  <p className="text-xs text-gray-400 mt-1">Redeemed: {formatDateTime(ticket.ticketData.redeemedAt)}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Actions</h2></CardHeader>
          <CardContent className="space-y-3">
            {isActive && (
              <>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Send size={16} /> Transfer to Friend
                </Button>
                {canResell && (
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Tag size={16} /> List for Resale
                    <span className="ml-auto text-xs text-gray-400">
                      Max {formatCurrency(ticket.ticketData.purchasePrice * (event?.resaleMaxMarkup || 1))}
                    </span>
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield size={16} /> Verify on Chain
                </Button>
              </>
            )}
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500">
              <ExternalLink size={16} /> View on DUAL Explorer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* On-chain info */}
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900 flex items-center gap-2"><Shield size={18} /> On-Chain Details</h2></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Token ID</p>
              <p className="font-mono text-gray-900">{ticket.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Template</p>
              <p className="font-mono text-gray-900">{ticket.templateName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Owner Wallet</p>
              <p className="font-mono text-gray-900">{truncateAddress(ticket.ownerWallet)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Organisation</p>
              <p className="font-mono text-gray-900">{ticket.organizationId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Chain Status</p>
              <OnChainBadge status={ticket.onChainStatus} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-gray-900">{formatDateTime(ticket.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer history */}
      {ticket.ticketData.transferHistory.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900 flex items-center gap-2"><ArrowRightLeft size={18} /> Transfer History</h2></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticket.ticketData.transferHistory.map((transfer, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {truncateAddress(transfer.from)} → {truncateAddress(transfer.to)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDateTime(transfer.timestamp)}</p>
                  </div>
                  {transfer.price && (
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(transfer.price)}</p>
                  )}
                  {transfer.verified && (
                    <Shield size={14} className="text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity log */}
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Activity Log</h2></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${action.status === 'completed' ? 'bg-green-500' : action.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{action.description}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(action.timestamp)}</p>
                </div>
                <span className="text-xs font-mono text-gray-400">{action.type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
