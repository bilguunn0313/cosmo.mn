const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface OdometerPart {
  char: string;
  digit: number | null;
  place: number;
}

function splitNumber(text: string) {
  let place = 0;

  return [...text].map((char): OdometerPart => {
    if (!/\d/.test(char)) {
      return { char, digit: null, place };
    }

    const part = { char, digit: Number(char), place };
    place += 1;
    return part;
  });
}

interface StatOdometerProps {
  value: number;
  locale: string;
  unit?: string;
}

export function StatOdometer({ value, locale, unit }: StatOdometerProps) {
  const text = new Intl.NumberFormat(locale).format(value);

  return (
    <span className="flex items-start font-display text-[clamp(40px,4.4vw,68px)] leading-none font-semibold tracking-[-0.025em] text-brand tabular-nums">
      <span className="sr-only">
        {text}+{unit ? ` ${unit}` : ""}
      </span>
      <span aria-hidden className="inline-flex">
        {splitNumber(text).map((part, index) =>
          part.digit === null ? (
            <span key={index}>{part.char}</span>
          ) : (
            <span key={index} className="odometer-reel">
              <span
                className="odometer-strip"
                style={
                  {
                    "--digit": part.digit,
                    "--place": part.place,
                  } as React.CSSProperties
                }
              >
                {DIGITS.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          ),
        )}
      </span>
      <span aria-hidden className="ml-0.5 text-[0.5em] leading-none text-coral">
        +
      </span>
      {unit && (
        <span
          aria-hidden
          className="ml-2 self-end text-[0.42em] leading-[1.5] tracking-normal"
        >
          {unit}
        </span>
      )}
    </span>
  );
}
