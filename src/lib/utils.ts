import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}

export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getEventTypeColor(type: string): string {
  const colors: Record<string, string> = {
    concert: 'bg-purple-100 text-purple-800',
    festival: 'bg-pink-100 text-pink-800',
    sport: 'bg-green-100 text-green-800',
    conference: 'bg-blue-100 text-blue-800',
    experience: 'bg-amber-100 text-amber-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

export function getTicketStatusColor(status: string): string {
  const colors: Record<string, string> = {
    valid: 'bg-gold-50 text-gold-800',
    used: 'bg-gray-100 text-gray-600',
    transferred: 'bg-blue-100 text-blue-800',
    expired: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
    listed: 'bg-amber-100 text-amber-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getOnChainStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    anchored: 'bg-gold-50 text-gold-800',
    verified: 'bg-gold-100 text-gold-900',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getEventStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    'on-sale': 'bg-green-100 text-green-800',
    'sold-out': 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function generateQrHash(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function tierAvailability(sold: number, capacity: number): { percent: number; label: string; color: string } {
  const percent = Math.round((sold / capacity) * 100);
  if (percent >= 100) return { percent: 100, label: 'Sold Out', color: 'text-red-600' };
  if (percent >= 80) return { percent, label: 'Almost Gone', color: 'text-amber-600' };
  if (percent >= 50) return { percent, label: 'Selling Fast', color: 'text-yellow-600' };
  return { percent, label: 'Available', color: 'text-green-600' };
}
