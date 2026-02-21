import "./LoadingSpinner.css";

type Props = {
  label?: string;
  size?: number;
  duration?: number;
};

export function LoadingSpinner({
  label = "the garden of now • the garden of now • ",
  size = 150,
  duration = 500,
}: Props) {
  const radius = 33.5;              
  const viewBoxSize = 120;

  return (
    <div
      className="loading-spinner"
      style={
        {
          "--spinner-size": `${size}px`,
          "--spinner-duration": `${duration}ms`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <svg
        className="loading-spinner__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        aria-hidden="true"
      >
        <defs>
          <path
            id="spinner-path"
            d={`M ${viewBoxSize / 2},${viewBoxSize / 2}
               m 0,-${radius}
               a ${radius},${radius} 0 1,1 0,${2 * radius}
               a ${radius},${radius} 0 1,1 0,-${2 * radius}`}
          />
        </defs>

        <text className="loading-spinner__text">
          <textPath href="#spinner-path" startOffset="0" textAnchor="middle">
            {label}
          </textPath>
        </text>
      </svg>
    </div>
  );
}