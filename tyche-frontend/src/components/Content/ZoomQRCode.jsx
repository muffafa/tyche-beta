import PropTypes from "prop-types";

function ZoomQRCode({ qr, setZoom }) {
  return (
    <>
      <>
        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50" onClick={() => setZoom(false)}>
           <img src={qr} alt = "QR Code" className="w-[300px] h-[300px]" />
        </div>
      </>
    </>
  );
}

ZoomQRCode.propTypes = {
    qr: PropTypes.string.isRequired,
    setZoom: PropTypes.func.isRequired,
};

export default ZoomQRCode;