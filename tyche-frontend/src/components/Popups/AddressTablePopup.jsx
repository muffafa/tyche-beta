import PropTypes from "prop-types";
import shortenAddress from "../../utils/shortenAddress";

function AddressTablePopup({ addresses, onEdit, onDelete, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container bg-tycheBeige p-6 rounded shadow-lg">
        <h2 className="text-tycheBlue font-bold mb-4">Manage Addresses</h2>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="text-left text-tycheGray">Alias</th>
              <th className="text-left text-tycheGray">Address</th>
              <th className="text-left text-tycheGray">Network</th>
              <th className="text-right text-tycheGray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address, index) => (
              <tr key={index}>
                <td className="text-tycheGray">{address.alias}</td>
                <td className="text-tycheGray">
                  {shortenAddress(address.address)}
                </td>
                <td className="text-tycheGray">{address.network}</td>
                <td className="text-right">
                  <button
                    className="bg-tycheBlue text-white p-2 rounded mr-2"
                    onClick={() => onEdit(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-tycheRed text-white p-2 rounded"
                    onClick={() => onDelete(address)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-4 bg-tycheBlue text-white p-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

AddressTablePopup.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      alias: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      network: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddressTablePopup;
