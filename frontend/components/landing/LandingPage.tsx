'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function CheckIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const featureList = [
  'Real-time thread synchronization',
  'Integrated developer tools logs',
  'Shared internal notes system',
];

const stats = [
  { label: 'Resolution Time', value: '-24%', note: 'vs. last quarter' },
  { label: 'Active Seats', value: '1.2k', note: '12% boost', trend: true },
  { label: 'CSAT Score', value: '4.9', note: 'out of 5.0' },
  { label: 'Pending Tasks', value: '14', note: 'Lowest in 30 days' },
];

const trustedTeams = ['VelocityScale', 'CloudNine', 'DataPulse', 'NexaFlow', 'OrbitOps'];

export function LandingPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-content px-4 pb-16 pt-12 md:px-margin md:pb-24 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-md text-primary">
              bolt v2.0 is now live
            </span>
            <h1 className="text-[40px] font-bold leading-tight tracking-tight text-foreground md:text-[56px] md:leading-[1.1]">
              Support at the speed of flow.
            </h1>
            <p className="max-w-lg text-body-lg text-on-surface-variant">
              The modernist ticket management system built for high-performance teams.
              Stop chasing tickets and start solving problems.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button className="h-12 px-6">
                  Start Free Trial
                  <ArrowIcon />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="h-12 px-6">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((initial) => (
                  <span
                    key={initial}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary text-label-sm text-primary-foreground"
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <span className="text-body-md text-on-surface-variant">
                Joined by <strong className="text-foreground">10k+</strong> teams
              </span>
            </div>
          </div>

          {/* Ticket preview card */}
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-hover">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-label-md text-on-surface-variant">KAN-142</span>
              <span className="rounded-full bg-status-in-progress/10 px-2.5 py-0.5 text-label-sm text-status-in-progress">
                In Progress
              </span>
            </div>
            <h3 className="mb-4 text-headline-sm text-foreground">
              Checkout API latency spike investigation
            </h3>
            <div className="space-y-3 rounded-md border border-outline-variant bg-surface-container-low p-4">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-label-sm text-secondary-foreground">
                  AM
                </span>
                <div>
                  <p className="text-body-md text-foreground">
                    We&apos;ve noticed a latency spike in the checkout flow. Can we investigate
                    the API response times?
                  </p>
                  <p className="mt-1 font-mono text-label-md text-on-surface-variant">
                    10:45 AM · Alex M.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-sm text-primary">
                  SL
                </span>
                <div>
                  <p className="text-body-md text-foreground">
                    I&apos;ve attached the CloudWatch logs below. Looks like an RDS scaling issue.
                  </p>
                  <p className="mt-1 font-mono text-label-md text-on-surface-variant">
                    10:47 AM · Support Lead
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-3 py-2">
                <span className="font-mono text-label-md text-on-surface-variant">attach_file</span>
                <span className="text-body-md text-foreground">logs-2024-05-22.csv</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-outline-nav bg-surface-container-low py-10">
        <div className="mx-auto max-w-content px-4 md:px-margin">
          <p className="mb-6 text-center text-label-md uppercase tracking-wider text-on-surface-variant">
            Trusted by the world&apos;s most agile teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustedTeams.map((name) => (
              <span
                key={name}
                className="text-headline-sm font-semibold text-on-surface-variant/60"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Context-rich collaboration */}
      <section className="mx-auto max-w-content px-4 py-16 md:px-margin md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
              <p className="mb-4 font-mono text-label-md text-primary">chat_bubble Active Discussion</p>
              <div className="space-y-4">
                <div className="rounded-md bg-surface-container-low p-4">
                  <p className="text-body-md text-foreground">
                    We&apos;ve noticed a latency spike in the checkout flow. Can we investigate
                    the API response times?
                  </p>
                  <p className="mt-2 font-mono text-label-md text-on-surface-variant">
                    10:45 AM · Alex M.
                  </p>
                </div>
                <div className="rounded-md bg-surface-container-low p-4">
                  <p className="text-body-md text-foreground">
                    I&apos;ve attached the CloudWatch logs below. Looks like an RDS scaling issue.
                  </p>
                  <p className="mt-2 font-mono text-label-md text-on-surface-variant">
                    10:47 AM · Support Lead
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 flex flex-col gap-4 lg:order-2">
            <span className="font-mono text-label-md text-primary">groups</span>
            <h2 className="text-display text-foreground">Context-rich collaboration</h2>
            <p className="text-body-lg text-on-surface-variant">
              Eliminate the back-and-forth. Luff-Flow keeps every conversation, file, and system
              log inside the ticket so your team never loses the thread.
            </p>
            <ul className="mt-2 space-y-3">
              {featureList.map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-foreground">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Visibility by default */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 md:px-margin">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-label-md text-primary">dashboard</span>
              <h2 className="text-display text-foreground">Visibility by default</h2>
              <p className="text-body-lg text-on-surface-variant">
                Switch between Kanban boards, detailed lists, and timeline views instantly. See the
                whole board or zoom into a single task without losing momentum.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
                  <h4 className="text-headline-sm text-foreground">Board View</h4>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    Drag-and-drop workflow management.
                  </p>
                </div>
                <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
                  <h4 className="text-headline-sm text-foreground">Timeline</h4>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    Visual roadmap and deadline tracking.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5"
                >
                  <p className="font-mono text-label-md text-on-surface-variant">{stat.label}</p>
                  <p className="mt-2 text-[28px] font-bold text-foreground">{stat.value}</p>
                  <p
                    className={`mt-1 text-body-md ${
                      stat.trend ? 'text-status-resolved' : 'text-on-surface-variant'
                    }`}
                  >
                    {stat.trend && 'trending_up '}
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="mx-auto max-w-content px-4 py-16 md:px-margin md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-label-md text-primary">insights</span>
            <h2 className="text-display text-foreground">Insights that matter</h2>
            <p className="text-body-lg text-on-surface-variant">
              Data is only useful if it&apos;s actionable. Get automated reports that highlight
              bottlenecks before they become roadblocks. Track sentiment, speed, and satisfaction
              in real-time.
            </p>
          </div>
          <blockquote className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
            <p className="text-body-lg italic text-foreground">
              &ldquo;Luff-Flow cut our response times in half within the first 30 days. The
              reporting is simply unmatched.&rdquo;
            </p>
            <footer className="mt-4 text-body-md text-on-surface-variant">
              — Sarah Chen, VP of Support at VelocityScale
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-outline-nav bg-surface-container-low py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 text-center md:px-margin">
          <h2 className="text-display text-foreground">Ready to find your flow?</h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-on-surface-variant">
            Join 2,000+ companies that have traded chaos for clarity. Set up your workspace in
            minutes, not months.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup">
              <Button className="h-12 px-8">Get Started Free</Button>
            </Link>
            <Button variant="secondary" className="h-12 px-8" disabled title="Coming soon">
              Talk to Sales
            </Button>
          </div>
          <p className="mt-4 text-body-md text-on-surface-variant">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest py-8">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-margin">
          <p className="text-label-sm text-secondary">© 2024 Luff-Flow Support Systems</p>
          <div className="flex gap-6">
            <span className="text-label-sm text-secondary">Privacy Policy</span>
            <span className="text-label-sm text-secondary">Terms of Service</span>
            <span className="text-label-sm text-secondary">Help Center</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
