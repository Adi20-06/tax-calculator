import { generatePdfReport, buildShareUrl } from '../utils/reportGenerator';
import { useToast } from '../context/ToastContext';

export default function ReportActions({ result, chartsRef }) {
  const { showToast } = useToast();

  const handlePdf = async () => {
    try {
      await generatePdfReport(result, chartsRef?.current);
      showToast('PDF downloaded', 'success');
    } catch (err) {
      console.error(err);
      showToast('PDF generation failed', 'error');
    }
  };

  const handleShare = async () => {
    if (!result.id) {
      showToast('Save a calculation first to get a share link.', 'info');
      return;
    }
    const url = buildShareUrl(result.id);
    try {
      await navigator.clipboard.writeText(url);
      showToast('Share link copied', 'success');
    } catch {
      showToast(url, 'info', 6000);
    }
  };

  return (
    <div className="report-actions">
      <button type="button" className="btn-secondary" onClick={handlePdf}>Download PDF</button>
      <button type="button" className="btn-secondary" onClick={handleShare}>Copy Share Link</button>
    </div>
  );
}