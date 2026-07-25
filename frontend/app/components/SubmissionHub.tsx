"use client";

import { motion } from "framer-motion";
import { Globe, Phone, Smartphone, Mail, MapPin, Clock, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Channel {
  type: "portal" | "helpline" | "app" | "email" | "office" | "hours";
  label: string;
  value: string;
}

interface SubmissionHubProps {
  channels?: Channel[];
}

const iconMap: Record<string, any> = {
  portal: Globe,
  helpline: Phone,
  app: Smartphone,
  email: Mail,
  office: MapPin,
  hours: Clock,
};

export default function SubmissionHub({ channels = [] }: SubmissionHubProps) {
  if (channels.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-6 backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
        border: "1px solid var(--color-rule)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3
        className="mb-4 text-lg font-semibold"
        style={{ color: "var(--color-ink)" }}
      >
        How to Submit
      </h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {channels.map((channel, i) => (
          <ChannelCard key={i} channel={channel} />
        ))}
      </div>
    </motion.div>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  const [copied, setCopied] = useState(false);
  const Icon = iconMap[channel.type] || Globe;

  function handleCopy() {
    navigator.clipboard.writeText(channel.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isLink = channel.type === "portal" || channel.type === "email";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="group flex items-start gap-3 rounded-xl p-4 transition-colors"
      style={{ background: "var(--color-paper-2)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-paper-3)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "var(--color-paper-2)")
      }
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--color-accent-light)" }}
      >
        <Icon className="h-5 w-5" style={{ color: "var(--color-accent)" }} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-ink)" }}
        >
          {channel.label}
        </p>
        {isLink ? (
          <a
            href={channel.type === "email" ? `mailto:${channel.value}` : channel.value}
            target={channel.type === "portal" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="mt-0.5 flex items-center gap-1 truncate text-sm hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            <span className="truncate">{channel.value}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        ) : channel.type === "helpline" ? (
          <a
            href={`tel:${channel.value}`}
            className="mt-0.5 block text-sm transition-colors hover:underline"
            style={{ color: "var(--color-ink-3)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-ink-3)")
            }
          >
            {channel.value}
          </a>
        ) : (
          <div className="mt-0.5 flex items-center gap-2">
            <p
              className="truncate text-sm"
              style={{ color: "var(--color-ink-3)" }}
            >
              {channel.value}
            </p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" style={{ color: "var(--color-success)" }} />
              ) : (
                <Copy
                  className="h-3.5 w-3.5 transition-colors hover:opacity-70"
                  style={{ color: "var(--color-ink-4)" }}
                />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
