// src/components/Popups/GeneralSettingsPopup.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { updateSettings } from "../../redux/slices/settingsSlice";

function GeneralSettingsPopup({ onClose }) {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);

  const handleSave = () => {
    dispatch(updateSettings({ currency, timezone }));
    onClose();
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="popup-content bg-white p-6 rounded shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-tycheGray"
          onClick={onClose}
        >
          &times;
        </button>

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
  onClose: PropTypes.func.isRequired,
};

export default GeneralSettingsPopup;
