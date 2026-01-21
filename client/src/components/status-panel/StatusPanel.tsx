import './StatusPanel.css';

type Props = {
  title: string;
  message?: string;
  children?: React.ReactNode;
};

export function StatusPanel({ title, message }: Props) {
  return (
    <div className="status-panel-container" role="status" aria-live="polite">
      <h1 className="status-panel__title">{title}</h1>
      {message && <p className="status-panel__message">{message}</p>}
    </div>
  );
}