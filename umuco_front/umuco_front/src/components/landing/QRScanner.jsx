import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, CameraOff, ImageUp, QrCode, ScanLine } from 'lucide-react';

const REJECT_COOLDOWN_MS = 2000;

// Decode a QR from any drawable (video frame / image) using a shared canvas.
function decodeWithJsQR(source, width, height, canvas) {
  const maxW = 720;
  const scale = Math.min(1, maxW / width);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const result = jsQR(data.data, w, h, { inversionAttempts: 'attemptBoth' });
  return result?.data || '';
}

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [qrText, setQrText] = useState('');

  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  if (!canvasRef.current && typeof document !== 'undefined') {
    canvasRef.current = document.createElement('canvas');
  }

  useEffect(() => {
    if (!scanning) return undefined;
    let stream;
    let cancelled = false;
    let timeoutId;
    let lastRejected = '';
    let lastRejectedAt = 0;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera access needs HTTPS (or localhost). Open the site securely, upload a photo, or paste a QR link below.');
        setScanning(false);
        return;
      }

      try {
        // Use the native detector only if it really supports QR codes.
        let detector = null;
        if ('BarcodeDetector' in window) {
          try {
            const formats = await window.BarcodeDetector.getSupportedFormats();
            if (formats.includes('qr_code')) detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          } catch { /* fall back to jsQR */ }
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        const scanFrame = async () => {
          if (cancelled || !videoRef.current) return;
          const v = videoRef.current;
          try {
            if (v.readyState >= 2 && v.videoWidth) {
              let value = '';
              if (detector) {
                const codes = await detector.detect(v);
                value = codes[0]?.rawValue || '';
              }
              if (!value) value = decodeWithJsQR(v, v.videoWidth, v.videoHeight, canvasRef.current);

              if (value) {
                const now = Date.now();
                const sameRecentReject = value === lastRejected && now - lastRejectedAt < REJECT_COOLDOWN_MS;
                if (!sameRecentReject) {
                  const accepted = onScanRef.current(value);
                  if (accepted !== false) {
                    setScanning(false);
                    return;
                  }
                  lastRejected = value;
                  lastRejectedAt = now;
                  setError('This QR code does not link to a Story Quest yet. Try a Umuco story QR code.');
                }
              }
            }
          } catch {
            // Camera still warming up or no code in frame; keep scanning.
          }
          timeoutId = window.setTimeout(scanFrame, 150);
        };
        scanFrame();
      } catch (scanError) {
        const name = scanError?.name;
        setError(
          name === 'NotAllowedError' ? 'Allow camera access in your browser settings to scan a story QR code.'
          : name === 'NotFoundError' ? 'No camera was found on this device. Upload a photo or paste a QR link below.'
          : name === 'NotReadableError' ? 'The camera is being used by another app. Close it and try again.'
          : 'Could not start the camera. You can upload a photo or paste a QR link below.'
        );
        setScanning(false);
      }
    };

    setError('');
    start();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [scanning]);

  const submitQrText = (event) => {
    event.preventDefault();
    if (!qrText.trim()) return;
    const accepted = onScanRef.current(qrText.trim());
    if (accepted === false) setError('This QR code does not link to a Story Quest yet. Try a Umuco story QR code.');
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    try {
      const bitmap = await createImageBitmap(file);
      const value = decodeWithJsQR(bitmap, bitmap.width, bitmap.height, canvasRef.current);
      bitmap.close?.();
      if (!value) {
        setError('No QR code found in that image. Try a clearer, closer photo.');
        return;
      }
      const accepted = onScanRef.current(value);
      if (accepted === false) setError('This QR code does not link to a Story Quest yet. Try a Umuco story QR code.');
    } catch {
      setError('Could not read that image. Try another photo.');
    }
  };

  return (
    <section id="scan-qr" className="scroll-mt-24 border-y border-[#EADBC8]/60 bg-[#F8F3ED] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADBC8] bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#8D493A]"><QrCode size={14} /> Unlock a story</span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#30221E] sm:text-4xl">Scan a QR code.<br /><span className="text-[#8D493A]">Meet the story behind it.</span></h2>
          <p className="mb-6 max-w-xl text-sm leading-6 text-[#6F5B55]">Point your camera at a Umuco story QR code to unlock an oral history carried through generations. The full Story Quest opens as your scan reward.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setError(''); setScanning((value) => !value); }} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]">
              {scanning ? <><CameraOff size={17} /> Stop scanning</> : <><Camera size={17} /> Scan QR code</>}
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-[#8D493A] px-5 py-3 text-sm font-bold text-[#8D493A] transition hover:bg-[#FCDFD3]/40">
              <ImageUp size={17} /> Upload photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#EADBC8] bg-white p-3 shadow-sm sm:p-5">
          {scanning ? <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#30221E]">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline autoPlay aria-label="Camera QR scanner" />
            <div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="relative h-44 w-44 rounded-2xl border-2 border-[#FCDFD3] shadow-[0_0_0_999px_rgba(25,16,13,.22)] sm:h-56 sm:w-56"><span className="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-white" /><span className="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-white" /><span className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-white" /><span className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-white" /></div></div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-white">Center a story QR code in the frame</p>
          </div> : <div className="grid aspect-video place-items-center rounded-2xl bg-[#F5EEE5] text-center">
            <div><span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#8D493A]"><ScanLine size={26} /></span><p className="mb-1 text-sm font-bold text-[#30221E]">Your next story is waiting</p><p className="m-0 text-xs text-[#78665E]">Start the camera, upload a photo, or enter a QR link</p></div>
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