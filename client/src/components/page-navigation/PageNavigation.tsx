import './PageNavigation.css';

import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';

type Props = {
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number | null;
  limit: number,
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  pendingAction: string | null;
  setPendingAction: React.Dispatch<React.SetStateAction<string | null>>;
}

export function PageNavigation({
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  isLoading,
  pendingAction,
  setPendingAction
}: Props) {

  const canSelectPrevious = page > 1;
  const canSelectNext = totalPages !== null && page < totalPages;

  function handleAction(id: string, action: () => void) {
    setPendingAction(id);
    action();
  }

  function isSpinning(id: string) {
    return isLoading && pendingAction === id;
  }

  return (
    <section className="recipes-page__pagination">
      <div className="pagination__limit--blank" />
      <div className="pagination__nav">
        <button
          className={`nav-button ${isSpinning('first') ? 'is-loading' : ''}`}
          type="button"
          onClick={() => handleAction('first', () => setPage(1))}
          disabled={isLoading || !canSelectPrevious}
          aria-busy={isSpinning('first')}
        >
          <p className="nav-button-text">&lt;&lt; FIRST</p>
          <ChevronsLeft className="nav-button-icon" />
          <span className="nav-button-spinner" aria-hidden="true" />
        </button>
        <button
          className={`nav-button ${isSpinning('prev') ? 'is-loading' : ''}`}
          type="button"
          onClick={() => handleAction('prev', () => setPage((p) => Math.max(1, p - 1)))}
          disabled={isLoading || !canSelectPrevious}
          aria-busy={isSpinning('prev')}
        >
          <p className="nav-button-text">&lt; PREV</p>
          <ChevronLeft className="nav-button-icon" />
          <span className="nav-button-spinner" aria-hidden="true" />
        </button>
        <span className="nav-info">
          Page <span>{page}</span> of {totalPages ?? 1}
        </span>
        <button
          className={`nav-button ${isSpinning('next') ? 'is-loading' : ''}`}
          type="button"
          onClick={() => handleAction('next', () => setPage((p) => p + 1))}
          disabled={isLoading || !canSelectNext}
          aria-busy={isSpinning('next')}
        >
          <p className="nav-button-text">NEXT &gt;</p>
          <ChevronRight className="nav-button-icon" />
          <span className="nav-button-spinner" aria-hidden="true" />
        </button>
        <button
          className={`nav-button ${isSpinning('last') ? 'is-loading' : ''}`}
          type="button"
          onClick={() => totalPages && handleAction('last', () => setPage(totalPages))}
          disabled={isLoading || !canSelectNext}
          aria-busy={isSpinning('last')}
        >
          <p className="nav-button-text">LAST &gt;&gt;</p>
          <ChevronsRight className="nav-button-icon" />
          <span className="nav-button-spinner" aria-hidden="true" />
        </button>
      </div>
      <div className="pagination__limit">
          <button
            className={`limit-button ${isSpinning('limit-24') ? 'is-loading' : ''}`}
            type="button"
            onClick={() => handleAction('limit-24', () => {setLimit(24); setPage(1);})}
            disabled={isLoading || limit===24}
            aria-busy={isSpinning('limit-24')}
          >
            <span className="limit-button-text">24</span>
            <span className="limit-button-spinner" aria-hidden="true" />
          </button>
          <button
            className={`limit-button ${isSpinning('limit-48') ? 'is-loading' : ''}`}
            type="button"
            onClick={() => handleAction('limit-48', () => {setLimit(48); setPage(1);})}
            disabled={isLoading || limit===48}
            aria-busy={isSpinning('limit-48')}
          >
            <span className="limit-button-text">48</span>
            <span className="limit-button-spinner" aria-hidden="true" />
          </button>
      </div>
    </section>
  )
}
