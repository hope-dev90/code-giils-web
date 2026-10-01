import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, QrCode, ScanLine } from 'lucide-react';

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [qrText, setQrText] = useState('');

  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    if (!scanning) return undefined;
    let stream;
    let cancelled = false;
    let timeoutId;

    const start = async () => {
      if (!('BarcodeDetector' in window)) {
        setError('Camera QR scanning is not supported in this browser. Paste a QR link below to open its story.');
        setScanning(false);
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera access is unavailable. Open this page over HTTPS or paste a QR link below.');
        setScanning(false);
        return;
      }

      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const scanFrame = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length && codes[0].rawValue) {
              const accepted = onScanRef.current(codes[0].rawValue);
              if (accepted !== false) {
                setScanning(false);
                return;
              }
              setError('This QR code does not link to a Story Quest yet. Try a Umuco story QR code.');
            }
          } catch {
            // Keep scanning while the camera is warming up or no code is in frame.
          }
          timeoutId = window.setTimeout(scanFrame, 250);
        };
        scanFrame();
      } catch (scanError) {
        setError(scanError.name === 'NotAllowedError' ? 'Allow camera access to scan a story QR code.' : 'Could not start the camera. You can paste a QR link below instead.');
        setScanning(false);
      }
    };

    setError('');
    start();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [scanning]);

  const submitQrText = (event) => {
    event.preventDefault();
    if (!qrText.trim()) return;
    const accepted = onScanRef.current(qrText.trim());
    if (accepted === false) setError('This QR code does not link to a Story Quest yet. Try a Umuco story QR code.');
  };

  return (
    <section id="scan-qr" className="scroll-mt-24 border-y border-[#EADBC8]/60 bg-[#F8F3ED] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADBC8] bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#8D493A]"><QrCode size={14} /> Unlock a story</span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#30221E] sm:text-4xl">Scan a QR code.<br /><span className="text-[#8D493A]">Meet the story behind it.</span></h2>
          <p className="mb-6 max-w-xl text-sm leading-6 text-[#6F5B55]">Point your camera at a Umuco story QR code to unlock an oral history carried through generations. The full Story Quest opens as your scan reward.</p>
          <button type="button" onClick={() => { setError(''); setScanning((value) => !value); }} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]">
            {scanning ? <><CameraOff size={17} /> Stop scanning</> : <><Camera size={17} /> Scan QR code</>}
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#EADBC8] bg-white p-3 shadow-sm sm:p-5">
          {scanning ? <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#30221E]">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline aria-label="Camera QR scanner" />
            <div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="relative h-44 w-44 rounded-2xl border-2 border-[#FCDFD3] shadow-[0_0_0_999px_rgba(25,16,13,.22)] sm:h-56 sm:w-56"><span className="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-white" /><span className="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-white" /><span className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-white" /><span className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-white" /></div></div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-white">Center a story QR code in the frame</p>
          </div> : <div className="grid aspect-video place-items-center rounded-2xl bg-[#F5EEE5] text-center">
            <div><span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#8D493A]"><ScanLine size={26} /></span><p className="mb-1 text-sm font-bold text-[#30221E]">Your next story is waiting</p><p className="m-0 text-xs text-[#78665E]">Start the camera or enter a QR link</p></div>
          </div>}
          <form onSubmit={submitQrText} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input value={qrText} onChange={(event) => setQrText(event.target.value)} aria-label="QR code link" placeholder="Paste a QR code link" className="min-w-0 flex-1 rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#8D493A]" />
            <button type="submit" disabled={!qrText.trim()} className="rounded-xl border border-[#8D493A] px-5 py-3 text-sm font-bold text-[#8D493A] transition hover:bg-[#FCDFD3]/40 disabled:cursor-not-allowed disabled:opacity-40">Open story</button>
          </form>
          {error && <p role="status" className="mb-0 mt-3 text-xs leading-5 text-[#8D493A]">{error}</p>}
        </div>
      </div>
    </section>
  );
}
