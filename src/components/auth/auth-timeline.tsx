import { EyeOff, KeyRound, ServerOff } from "lucide-react";

const steps = [
  {
    icon: EyeOff,
    title: "You stay anonymous",
    body: "Your identity is never requested and never revealed. Not to us, not to anyone.",
  },
  {
    icon: KeyRound,
    title: "Get your recovery code",
    body: "You receive a one-time recovery code. It's the only way to get back into your account, so keep it safe.",
  },
  {
    icon: ServerOff,
    title: "Nothing is stored",
    body: "You and your personal info are never saved in a database. There's nothing to leak.",
  },
];

const STEP_SECONDS = 2;
const CYCLE_SECONDS = 10;

export function AuthTimeline() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden border-l bg-muted/40 p-12">
      <div
        className="pointer-events-none absolute inset-0 text-foreground opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <p className="mb-1 font-mono text-[11px] font-medium uppercase text-muted-foreground">
          Privacy by design
        </p>

        <h2 className="mb-6 font-heading text-2xl font-semibold tracking-tight text-foreground">
          Private from the very first step.
        </h2>
        <ol>
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;
            const delay = `${i * STEP_SECONDS}s`;

            return (
              <li
                key={step.title}
                className="relative flex gap-5 pb-12 last:pb-0"
              >
                {/* Connecting line */}
                {!isLast && (
                  <div className="absolute bottom-0 left-4.75 top-10 w-px bg-border">
                    <div
                      className="tl-line absolute inset-x-0 h-full origin-top bg-linear-to-b from-foreground/50 to-foreground"
                      style={{
                        animationDelay: `${i * STEP_SECONDS + 0.4}s`,
                      }}
                    />
                  </div>
                )}

                {/* Node */}
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border text-muted-foreground">
                  <Icon className="size-4" />

                  <div
                    className="tl-node absolute inset-0 flex items-center justify-center rounded-full border"
                    style={{ animationDelay: delay }}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>

                {/* Text */}
                <div
                  className="tl-text pt-1.5"
                  style={{ animationDelay: delay }}
                >
                  <h3 className="font-medium text-foreground">{step.title}</h3>

                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
  .tl-line, .tl-node, .tl-text {
    animation-duration: ${CYCLE_SECONDS}s;
    animation-iteration-count: 1;
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;
  }

  .tl-line {
    animation-name: tl-line;
    transform: scaleY(0);
    box-shadow: 0 0 12px 1px color-mix(in srgb, currentColor 70%, transparent);
  }

  .tl-node {
    animation-name: tl-node;
    opacity: 0;
    box-shadow: 0 0 22px 4px color-mix(in srgb, currentColor 45%, transparent),
                inset 0 0 10px color-mix(in srgb, currentColor 25%, transparent);
  }

  .tl-text { animation-name: tl-text; opacity: 0.5; }

  @keyframes tl-line {
    0% { transform: scaleY(0); }
    14%, 100% { transform: scaleY(1); }
  }

  @keyframes tl-node {
    0% { opacity: 0; }
    5%, 100% { opacity: 1; }
  }

  @keyframes tl-text {
    0% { opacity: 0.5; }
    5%, 100% { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tl-line, .tl-node, .tl-text { animation: none; opacity: 1; }
    .tl-line { transform: scaleY(1); }
  }
`}</style>
    </div>
  );
}
