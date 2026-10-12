import {
  Activity,
  ArrowLeftRight,
  Bell,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileSignature,
  FileText,
  FolderOpen,
  Headset,
  HeartPulse,
  Keyboard,
  LineChart,
  MessagesSquare,
  Monitor,
  Phone,
  PhoneCall,
  Pill,
  ShieldCheck,
  Users,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Capability, IconKey } from "@/lib/services";

const ICONS: Record<IconKey, LucideIcon> = {
  phone: Phone,
  "phone-call": PhoneCall,
  "clipboard-list": ClipboardList,
  "clipboard-check": ClipboardCheck,
  pill: Pill,
  users: Users,
  "file-signature": FileSignature,
  "heart-pulse": HeartPulse,
  activity: Activity,
  "line-chart": LineChart,
  bell: Bell,
  monitor: Monitor,
  "calendar-check": CalendarCheck,
  "calendar-days": CalendarDays,
  "user-plus": UserPlus,
  "file-text": FileText,
  "folder-open": FolderOpen,
  "messages-square": MessagesSquare,
  "shield-check": ShieldCheck,
  headset: Headset,
  keyboard: Keyboard,
  "arrow-left-right": ArrowLeftRight,
};

/**
 * Capability card grid — the "What does X do?" pattern: centered heading +
 * subtitle, then a responsive grid of cards (cyan icon tile, title, one-line
 * body). Digestible, one idea per card. Cards reveal on scroll with a gentle
 * per-row stagger.
 */
export function FeatureGrid({
  heading,
  subtitle,
  items,
}: {
  heading: string;
  subtitle?: string;
  items: Capability[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
          {heading}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-base leading-relaxed text-body-ink">
            {subtitle}
          </p>
        ) : null}
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]">
                <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-lg font-semibold text-brand-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-body-ink">
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
