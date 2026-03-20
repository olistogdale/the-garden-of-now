import './BackgroundScroll.css';

const PHRASES = [
  'WELCOME TO THE GARDEN OF NOW ◆',
  'LOCAL • SEASONAL • TASTY ◆',
  "COOK ONLY WHAT'S IN SEASON ◆",
] as const;

const ROWS = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
] as const;

export function BackgroundScroll() {
  return (
    <div className="bg-scroll" aria-hidden="true">
      {ROWS.map((row, i) => (
        <div
          key={i}
          className={['bg-scroll__row', `bg-scroll__row--${i + 1}`].join(' ')}
        >
          {row.map((phrase) => (
            <span key={phrase}>{PHRASES[phrase]}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
