import popupCloseIcon from "./../../assets/images/icons/popupCloseIcon.svg";
import tagEditIcon from "./../../assets/images/icons/tagEditIcon.svg";
import tagDeleteIcon from "./../../assets/images/icons/tagDeleteIcon.svg";
import tagConfirmIcon from "./../../assets/images/icons/tagConfirmIcon.svg";
import tagCancelIcon from "./../../assets/images/icons/tagCancelIcon.svg";
import saveWalletIcon from "./../../assets/images/icons/saveWalletIcon.svg";
import { useEffect, useRef, useState } from "react";
import { getSupportedNetworks } from "../../utils/NetworkManager";
import { useSelector } from "react-redux";
import { updateSettings } from "../../redux/slices/settingsSlice";
import { useDispatch } from "react-redux";
import {
  addAddress,
  deleteAddress,
  updateAddress,
} from "../../redux/slices/walletSlice";

function SettingsPopup({ onClose, preferredTab, newWallet, walletToEdit }) {
  const [activeTab, setActiveTab] = useState(preferredTab || "settings");
  //get settings from redux
  console.log("NEW WALLET");
  console.log(newWallet);
  console.log("WALLET TO EDIT");
  console.log(walletToEdit);
  return (
    <>
      <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-2 md:p-0">
        <div className="fixed bg-tycheLightGray rounded-[30px] w-full md:w-[85%] lg:w-[75%] h-[85%] md:h-[75%] items-center overflow-hidden flex flex-col">
          {PopupTabs(activeTab, setActiveTab, onClose)}
          <div className="flex flex-col w-full h-[calc(100%-70px)] md:h-[calc(100%-85px)] p-4 md:p-8">
            {activeTab === "settings" ? (
              <GeneralSettings />
            ) : (
              <SavedWallets
                newWallet={newWallet}
                walletToEdit={walletToEdit}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function GeneralSettings() {
  const generalSettings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-6 md:gap-[45px]">
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <p className="flex font-medium text-[16px] md:text-[18px]">Currency:</p>
        <select
          id="currency"
          name="currency"
          className="flex items-center bg-tychePrimary text-white text-[14px] md:text-[16px] px-4 md:px-6 py-1 h-[40px] md:h-[50px] rounded-full w-fit focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
          onChange={(e) =>
            dispatch(
              updateSettings({
                currency: e.target.value,
                timezone: generalSettings.timezone,
              })
            )
          }
        >
          <option selected={generalSettings.currency === "USD"}>USD</option>
          <option selected={generalSettings.currency === "EUR"}>EUR</option>
          <option selected={generalSettings.currency === "GBP"}>GBP</option>
        </select>
      </div>
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <p className="flex font-medium text-[16px] md:text-[18px] whitespace-nowrap">
          Timezone:
        </p>
        <select
          id="timezone"
          name="timezone"
          className="flex items-center bg-tychePrimary text-white text-[12px] md:text-[14px] px-2 md:px-4 py-1 h-[40px] md:h-[50px] w-fit max-w-[200px] md:max-w-none rounded-full focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
          onChange={(e) =>
            dispatch(
              updateSettings({
                currency: generalSettings.currency,
                timezone: e.target.value,
              })
            )
          }
        >
          <option
            value="Pacific/Honolulu"
            selected={generalSettings.timezone === "Pacific/Honolulu"}
          >
            Pacific/Honolulu (HST)
          </option>
          <option
            value="America/Anchorage"
            selected={generalSettings.timezone === "America/Anchorage"}
          >
            America/Anchorage (AKST)
          </option>
          <option
            value="America/Los_Angeles"
            selected={generalSettings.timezone === "America/Los_Angeles"}
          >
            America/Los Angeles (PST)
          </option>
          <option
            value="America/Denver"
            selected={generalSettings.timezone === "America/Denver"}
          >
            America/Denver (MST)
          </option>
          <option
            value="America/Chicago"
            selected={generalSettings.timezone === "America/Chicago"}
          >
            America/Chicago (CST)
          </option>
          <option
            value="America/New_York"
            selected={generalSettings.timezone === "America/New_York"}
          >
            America/New York (EST)
          </option>
          <option
            value="Europe/London"
            selected={generalSettings.timezone === "Europe/London"}
          >
            Europe/London (GMT+0)
          </option>
          <option
            value="Europe/Paris"
            selected={generalSettings.timezone === "Europe/Paris"}
          >
            Europe/Paris (CET)
          </option>
          <option
            value="Europe/Berlin"
            selected={generalSettings.timezone === "Europe/Berlin"}
          >
            Europe/Berlin (CET)
          </option>
          <option
            value="Europe/Istanbul"
            selected={generalSettings.timezone === "Europe/Istanbul"}
          >
            Europe/Istanbul (TRT)
          </option>
          <option selected={generalSettings.timezone === "Europe/Moscow"}>
            Europe/Moscow (MSK)
          </option>
          <option
            value="Asia/Dubai"
            selected={generalSettings.timezone === "Asia/Dubai"}
          >
            Asia/Dubai (GST)
          </option>
          <option
            value="Asia/Tokyo"
            selected={generalSettings.timezone === "Asia/Tokyo"}
          >
            Asia/Tokyo (JST)
          </option>
          <option
            value="Australia/Sydney"
            selected={generalSettings.timezone === "Australia/Sydney"}
          >
            Australia/Sydney (AEST)
          </option>
        </select>
      </div>
    </div>
  );
}

function SavedWallets({ newWallet, walletToEdit, onClose }) {
  const networks = getSupportedNetworks();
  const [selectedNetwork, setSelectedNetwork] = useState("All Networks");
  const [saveWalletButtonClicked, setSaveWalletButtonClicked] = useState(false);
  const [editWalletId, setEditWalletId] = useState(null);
  const addresses = useSelector((state) => state.wallet.addresses);
  const dispatch = useDispatch();

  const handleNetworkChange = (event) => {
    setSelectedNetwork(event.target.value);
  };

  const handleEditWallet = (wallet) => {
    setEditWalletId(wallet.id);
  };

  const handleSaveWallet = (updatedWallet) => {
    if (addresses.find((wallet) => wallet.id === updatedWallet.id)) {
      dispatch(updateAddress(updatedWallet));
    } else {
      updatedWallet.id = addresses.length + 1;
      dispatch(addAddress(updatedWallet));
    }
    setEditWalletId(null);
    setSaveWalletButtonClicked(false);
    //düzenleme kısmı wallet informationdan açıldıysa kaydedildikten sonra popupu kapatır
    if (walletToEdit || newWallet) {
      onClose();
    }
  };

  const handleDeleteWallet = (walletId) => {
    dispatch(deleteAddress(walletId));
  };

  useEffect(() => {
    if (newWallet) {
      setSaveWalletButtonClicked(true);
    }
    if (walletToEdit) {
      setEditWalletId(walletToEdit.id);
    }
  }, [newWallet, walletToEdit]);

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Network selector */}
        <select
          id="currency"
          name="currency"
          className="flex items-center bg-tychePrimary text-white text-[16px] md:text-[20px] py-[13px] w-fit px-[20px] h-[50px] rounded-full focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen mb-4"
          onChange={handleNetworkChange}
        >
          <option>All Networks</option>
          {networks.map((network) => (
            <option key={network} value={network}>
              {network}
            </option>
          ))}
        </select>

        {/* Table header and content */}
        <div className="flex flex-col flex-grow min-h-0">
          {addresses.length === 0 ? (
            <p className="flex font-bold text-[16px] md:text-[20px] w-full justify-center">
              There is no saved address!
            </p>
          ) : (
            <div className="hidden md:flex flex-row gap-4 items-center w-full px-6 mb-4">
              <p className="flex font-bold text-[16px] md:text-[18px] w-[200px]">
                Address
              </p>
              <p className="flex font-bold text-[16px] md:text-[18px] w-[200px]">
                Tag
              </p>
              <p className="flex font-bold text-[16px] md:text-[18px] w-[200px]">
                Network
              </p>
              <p className="flex font-bold text-[16px] md:text-[18px] w-[100px] justify-end">
                Operations
              </p>
            </div>
          )}

          {/* Scrollable list */}
          <div className="flex-grow overflow-y-auto min-h-0 mb-4">
            <div className="flex flex-col gap-[20px]">
              {addresses
                .filter(
                  (wallet) =>
                    selectedNetwork === "All Networks" ||
                    wallet.network === selectedNetwork
                )
                .map((wallet, index) =>
                  editWalletId === wallet.id ? (
                    <AddOrEditWallet
                      key={index}
                      wallet={wallet}
                      onSave={handleSaveWallet}
                      onCancel={() => setEditWalletId(null)}
                    />
                  ) : (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full rounded-[25px] p-4 md:px-6 bg-white"
                    >
                      <div className="flex flex-col w-full md:w-[200px]">
                        <span className="text-[14px] font-bold md:hidden">
                          Address:
                        </span>
                        <span className="text-[14px] md:text-[16px] text-tycheDarkBlue break-words md:truncate">
                          {wallet.address}
                        </span>
                      </div>

                      <div className="flex flex-col w-full md:w-[200px]">
                        <span className="text-[14px] font-bold md:hidden">
                          Tag:
                        </span>
                        <span className="text-[14px] md:text-[16px] break-words md:truncate">
                          {wallet.tag}
                        </span>
                      </div>

                      <div className="flex flex-col w-full md:w-[200px]">
                        <span className="text-[14px] font-bold md:hidden">
                          Network:
                        </span>
                        <span className="text-[14px] md:text-[16px]">
                          {wallet.network}
                        </span>
                      </div>

                      <div className="flex flex-row gap-4 w-full md:w-[100px] justify-end md:justify-end mt-2 md:mt-0">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={() => handleEditWallet(wallet)}
                        >
                          <img
                            src={tagEditIcon}
                            alt="Edit"
                            className="w-5 h-5 md:w-6 md:h-6"
                          />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={() => handleDeleteWallet(wallet.id)}
                        >
                          <img
                            src={tagDeleteIcon}
                            alt="Delete"
                            className="w-5 h-5 md:w-6 md:h-6"
                          />
                        </button>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* Save Wallet Button - Always at bottom */}
          <div className="mt-auto">
            {saveWalletButtonClicked ? (
              <AddOrEditWallet
                wallet={newWallet}
                setSaveWalletButtonClicked={setSaveWalletButtonClicked}
                setEditWalletId={setEditWalletId}
                onSave={handleSaveWallet}
                onCancel={() => setSaveWalletButtonClicked(false)}
              />
            ) : (
              <AddWalletButton
                setSaveWalletButtonClicked={setSaveWalletButtonClicked}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AddWalletButton({ setSaveWalletButtonClicked }) {
  return (
    <button onClick={() => setSaveWalletButtonClicked(true)}>
      <div className="flex flex-row gap-4 items-center justify-center w-full rounded-[25px] px-[29px] border-dashed border-tycheDarkBlue h-[49px] border-[2px]">
        <div className="flex flex-row items-center justify-center gap-[11px]">
          <img src={saveWalletIcon} alt="Save Wallet" />
          <p className="flex text-[16px] md:text-[18px] text-tycheDarkBlue">
            Save Wallet
          </p>
        </div>
      </div>
    </button>
  );
}

function AddOrEditWallet({ wallet, onSave, onCancel }) {
  const [address, setAddress] = useState(wallet ? wallet.address : "");
  const [tag, setTag] = useState(wallet ? wallet.tag : "");
  const [newNetwork, setNewNetwork] = useState(
    wallet ? wallet.network : getSupportedNetworks()[0]
  );

  const tagInputRef = useRef(null);
  const walletInputRef = useRef(null);

  useEffect(() => {
    if (wallet && tagInputRef.current) {
      tagInputRef.current.focus();
    } else if (walletInputRef.current) {
      walletInputRef.current.focus();
    }
  }, [wallet]);

  const handleSubmit = async () => {
    if (!address || !tag) {
      alert("Please fill in all fields");
      return;
    }
    const updatedWallet = {
      id: wallet ? wallet.id : Date.now(),
      address,
      tag,
      network: newNetwork,
    };
    onSave(updatedWallet);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full rounded-[25px] p-4 md:px-6 bg-tycheDarkGray">
      <div className="flex flex-col w-full md:w-[200px] gap-1">
        <span className="text-[14px] font-bold md:hidden">Address:</span>
        <input
          type="text"
          ref={walletInputRef}
          placeholder="Wallet"
          className="text-[14px] md:text-[16px] w-full rounded-[16px] border-dashed border-tycheDarkGray border-[2px] focus:outline-none focus:border-tychePrimary p-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onCancel();
          }}
        />
      </div>

      <div className="flex flex-col w-full md:w-[200px] gap-1">
        <span className="text-[14px] font-bold md:hidden">Tag:</span>
        <input
          type="text"
          ref={tagInputRef}
          placeholder="Tag"
          className="text-[14px] md:text-[16px] w-full rounded-[16px] border-dashed border-tycheDarkGray border-[2px] focus:outline-none focus:border-tychePrimary p-2"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onCancel();
          }}
        />
      </div>

      <div className="flex flex-col w-full md:w-[200px] gap-1">
        <span className="text-[14px] font-bold md:hidden">Network:</span>
        <select
          id="network"
          name="network"
          className="text-[14px] md:text-[16px] w-full rounded-[16px] border-dashed border-tycheDarkGray border-[2px] focus:outline-none focus:border-tychePrimary p-2 bg-white"
          onChange={(e) => setNewNetwork(e.target.value)}
          value={newNetwork}
        >
          {getSupportedNetworks().map((network) => (
            <option key={network} value={network}>
              {network}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row gap-4 w-full md:w-[100px] justify-end mt-2 md:mt-0">
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={handleSubmit}
        >
          <img
            src={tagConfirmIcon}
            alt="Confirm"
            className="w-5 h-5 md:w-6 md:h-6"
          />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={onCancel}
        >
          <img
            src={tagCancelIcon}
            alt="Cancel"
            className="w-5 h-5 md:w-6 md:h-6"
          />
        </button>
      </div>
    </div>
  );
}

function PopupTabs(activeTab, setActiveTab, onClose) {
  return (
    <div className="flex w-full justify-between items-center h-[70px] md:h-[85px]">
      <button
        className={`${
          activeTab === "settings"
            ? "bg-tycheLightGray text-black"
            : "bg-tychePrimary text-white"
        } p-1 rounded-tl-[30px] w-full h-full flex items-center justify-center`}
        onClick={() => setActiveTab("settings")}
      >
        <div className="flex items-center justify-center gap-2 p-2 w-full h-full font-bold text-[16px] md:text-[20px]">
          General Settings
        </div>
      </button>
      <button
        className={`${
          activeTab === "savedWallets"
            ? "bg-tycheLightGray text-black"
            : "bg-tychePrimary text-white"
        } p-1 w-full h-full flex items-center justify-center`}
        onClick={() => setActiveTab("savedWallets")}
      >
        <div className="flex items-center justify-center gap-2 p-2 w-full h-full font-bold text-[16px] md:text-[20px]">
          Saved Wallets
        </div>
      </button>
      <button
        onClick={onClose}
        className="bg-tycheRed p-1 rounded-tr-[30px] flex min-w-[70px] md:min-w-[100px] h-full items-center justify-center"
      >
        <img src={popupCloseIcon} alt="Close" className="w-6 md:w-8" />
      </button>
    </div>
  );
}

export default SettingsPopup;
