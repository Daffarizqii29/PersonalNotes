import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../state/store';

export default function LoadingOverlay() {
  const isLoading = useSelector(selectIsLoading);

  if (!isLoading) return null;

  return (
    <div className="loadingOverlay" role="status" aria-live="polite" aria-label="Memuat">
      <div className="loadingOverlayCard">
        <div className="spinner" />
        <div className="loadingText">Memuat…</div>
      </div>
    </div>
  );
}
