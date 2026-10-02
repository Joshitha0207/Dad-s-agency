import React, { useState } from 'react';
import { MessageSquare, ExternalLink, Check, Copy, Phone, Store, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '../../types/order';
import {
  getOwnerWhatsAppNumber,
  buildOwnerWhatsAppOrderMessage,
  createWhatsAppUrl,
  sendOrderToOwnerWhatsApp
} from '../../utils/whatsapp';

interface WhatsAppOrderCardProps {
  order: Order;
  compact?: boolean;
  autoOpened?: boolean;
}

export const WhatsAppOrderCard: React.FC<WhatsAppOrderCardProps> = ({ order, compact = false, autoOpened = false }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const ownerPhone = getOwnerWhatsAppNumber();
  const message = buildOwnerWhatsAppOrderMessage(order);
  const whatsappUrl = createWhatsAppUrl(ownerPhone, message);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToOwner = () => {
    sendOrderToOwnerWhatsApp(order);
  };

  if (compact) {
    return (
      <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-900 font-semibold truncate">
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            💬
          </span>
          <div className="truncate">
            <span className="block font-bold truncate">Owner WhatsApp Notification</span>
            <span className="text-[11px] text-emerald-700 font-normal">Sent to +91 {ownerPhone}</span>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-full transition-colors shrink-0 flex items-center gap-1 shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-emerald-200">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">
                Shop Owner WhatsApp Alert
              </h3>
              <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full text-[10px] font-black uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-emerald-800 font-medium">
              Order details are dispatched to Dad's Agency shop owner: <strong>+91 {ownerPhone}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSendToOwner}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full transition-colors"
            title="Copy WhatsApp order message"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dispatched details breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-white/80 p-3.5 rounded-2xl border border-emerald-100 text-emerald-950">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Shop Owner</span>
          <span className="font-extrabold flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-emerald-600" /> Dad's Agency
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Owner Mobile (WhatsApp)</span>
          <span className="font-extrabold flex items-center gap-1 font-mono">
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> +91 {ownerPhone}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Customer Registered Phone</span>
          <span className="font-extrabold flex items-center gap-1 font-mono">
            📱 {order.customer_phone}
          </span>
        </div>
      </div>

      {/* Expandable formatted message preview */}
      <div className="border-t border-emerald-100 pt-2">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
        >
          <span>{showPreview ? 'Hide WhatsApp Message Text' : 'View Formatted WhatsApp Message Sent to Owner'}</span>
          {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showPreview && (
          <div className="mt-2.5 p-3.5 bg-emerald-950 text-emerald-100 rounded-2xl font-mono text-[11px] leading-relaxed whitespace-pre-line shadow-inner max-h-60 overflow-y-auto">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
