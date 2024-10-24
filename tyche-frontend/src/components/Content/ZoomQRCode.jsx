import QRCode from "react-qr-code";

function ZoomQRCode({ value, setZoom }) {
  return (
    <>
      <>
        <div
          className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setZoom(false)}
        >
          <div className="bg-white p-4 rounded-lg">
            <QRCode value={value} size={300} />
          </div>
        </div>
      </>
    </>
  );
}

export default ZoomQRCode;
