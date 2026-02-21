import './StatusPanel.css';

import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';

type Props = {
  mode: string;
  message?: string;
  children?: React.ReactNode;
};

export function StatusPanel({ mode, message }: Props) {
  return (
    <div className="status-panel" role="status" aria-live="polite">
        <div className="status-panel__header--blank"/>
        {mode === 'error'
          ? <h2 className="status-panel__title">WELL, THIS IS<br />EMBARASSING.</h2>
          : <LoadingSpinner size={150} duration={5000} /> 
        }
        {message && <p className="status-panel__message">{message}</p>}
    </div>
  );
}