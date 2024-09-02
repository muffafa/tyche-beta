import { useState } from "react";
import PropTypes from "prop-types";

function GeneralSettingsPopup({ settings, onSave, onClose }) {
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);

  const handleSave = () => {
    onSave({ currency, timezone });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content bg-white p-6 rounded shadow-lg">
        <h3 className="text-2xl font-bold text-tycheBlue mb-4">
          General Settings
        </h3>
        <div className="mb-4">
          <label className="block text-tycheGray mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="USD">USD</option>
            <option value="TRY">TRY</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-tycheGray mb-2">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="GMT+0">GMT+0</option>
            <option value="GMT+1">GMT+1</option>
            <option value="GMT+2">GMT+2</option>
            <option value="GMT+3">GMT+3</option>
          </select>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-tycheBlue text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="mt-4 ml-2 px-4 py-2 bg-tycheGray text-white rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

GeneralSettingsPopup.propTypes = {
  settings: PropTypes.shape({
    currency: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GeneralSettingsPopup;
