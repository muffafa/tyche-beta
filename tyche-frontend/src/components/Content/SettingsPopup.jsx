import popupCloseIcon from "./../../assets/images/icons/popupCloseIcon.svg";
import tagEditIcon from "./../../assets/images/icons/tagEditIcon.svg";
import tagDeleteIcon from "./../../assets/images/icons/tagDeleteIcon.svg";
import tagConfirmIcon from "./../../assets/images/icons/tagConfirmIcon.svg";
import tagCancelIcon from "./../../assets/images/icons/tagCancelIcon.svg";
import saveWalletIcon from "./../../assets/images/icons/saveWalletIcon.svg";
import { useEffect, useRef, useState } from "react";
import { getSupportedNetworkPairs } from "../../utils/NetworkManager";
import { useSelector } from "react-redux";
import { updateSettings } from "../../redux/slices/settingsSlice";
import { useDispatch } from "react-redux";
import {
  addAddress,
  deleteAddress,
  updateAddress,
} from "../../redux/slices/walletSlice";
import CustomSelector from "./CustomSelector";
import shortenAddress from "../../utils/shortenAddress";
import useCustomAxios from "../../hooks/useCustomAxios";

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

  const handleCurrencyChange = (e) => {
    dispatch(
      updateSettings({
        currency: e.target.value,
        timezone: generalSettings.timezone,
      })
    );
  }

  const handleTimezoneChange = (e) => {
    dispatch(
      updateSettings({
        currency: generalSettings.currency,
        timezone: e.target.value,
      })
    );
  }
  return (
    <div className="flex flex-col gap-6 md:gap-[45px]">
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <p className="flex font-medium text-[16px] md:text-[18px]">Currency:</p>
        <CustomSelector
          items={[{ USD: "USD" }, { EUR: "EUR" }, { GBP: "GBP" }]}
          selected={generalSettings.currency}
          onChange={handleCurrencyChange}
        />
      </div>
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <p className="flex font-medium text-[16px] md:text-[18px] whitespace-nowrap">
          Timezone:
        </p>
        <CustomSelector
          items={[
            { "Pacific/Honolulu": "Pacific/Honolulu (HST)" },
            { "America/Anchorage": "America/Anchorage (AKST)" },
            { "America/Los_Angeles": "America/Los Angeles (PST)" },
            { "America/Denver": "America/Denver (MST)" },
            { "America/Chicago": "America/Chicago (CST)" },
            { "America/New_York": "America/New York (EST)" },
            { "Europe/London": "Europe/London (GMT+0)" },
            { "Europe/Paris": "Europe/Paris (CET)" },
            { "Europe/Berlin": "Europe/Berlin (CET)" },
            { "Europe/Istanbul": "Europe/Istanbul (TRT)" },
            { "Europe/Moscow": "Europe/Moscow (MSK)" },
            { "Asia/Dubai": "Asia/Dubai (GST)" },
            { "Asia/Tokyo": "Asia/Tokyo (JST)" },
            { "Australia/Sydney": "Australia/Sydney (AEST)" },
          ]}
          selected={generalSettings.timezone}
          onChange={handleTimezoneChange}
        />
      </div>
    </div>
  );
}



function SavedWallets({ newWallet, walletToEdit, onClose }) {
  const supportedNetworks = getSupportedNetworkPairs();
  const networks = [{allNetworks: "All Networks"}, ...supportedNetworks];
  const [selectedNetwork, setSelectedNetwork] = useState("allNetworks");
  const [saveWalletButtonClicked, setSaveWalletButtonClicked] = useState(false);
  const [editWalletId, setEditWalletId] = useState(null);
  const addresses = useSelector((state) => state.wallet.addresses);
  const dispatch = useDispatch();
  const customAxios = useCustomAxios();

  const handleNetworkChange = (event) => {
    //console.log("Selected network:", event.target.value);
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

    //TODO: backend 400 dönüyor, network sol, bsc, eth gibi olmalı bence
    customAxios.post("/api/v1/wallets", {
      address: updatedWallet.address,
      network: supportedNetworks.find(([key,]) => key === updatedWallet.network)?.[1],
      nickname: updatedWallet.tag,
    }).then((response) => {
      console.log("Wallet saved successfully:", response.data);
    }).catch((error) => {
      console.error("Wallet save failed:", error);
    });


    //düzenleme kısmı wallet informationdan açıldıysa kaydedildikten sonra popupu kapatır
    if (walletToEdit || newWallet) {
      onClose();
    }
  };

  const handleDeleteWallet = (walletId) => {
    dispatch(deleteAddress(walletId));
    //TODO: Backend'e kaydetme işlemi yapılacak

  };

  const handleAddressClick = (wallet) => (e) => {
    e.stopPropagation();
    window.location.href = `/${wallet.network.toLowerCase()}/address/${
      wallet.address
    }`;
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
        <CustomSelector
          onChange={handleNetworkChange}
          items={networks}
          selected={selectedNetwork}
        />
        {/* Table header and content */}
        <div className="flex flex-col flex-grow min-h-0 mt-4">
          {addresses.filter(
            (wallet) =>
              selectedNetwork === "allNetworks" || wallet.network === selectedNetwork
          ).length === 0 ? (
            <p className="flex font-bold text-[16px] md:text-[20px] w-full justify-center">
              There is no saved address!
            </p>
          ) : (
            <div className="hidden md:flex flex-row gap-4 items-center w-full px-6 mb-4">
              <p className="flex font-bold text-[16px] md:text-[18px] w-full">
                Address
              </p>
              <p className="flex font-bold text-[16px] md:text-[18px] w-full">
                Tag
              </p>
              <p className="flex font-bold text-[16px] md:text-[18px] w-full">
                Network
              </p>
              <p className="flex font-bold text-[16px] md:text-[18px] w-full justify-end">
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
                    selectedNetwork === "allNetworks" ||
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
                      <div className="flex flex-col w-full">
                        <span className="text-[14px] font-bold md:hidden">
                          Address:
                        </span>
                        <span
                          className="text-[14px] md:text-[16px] text-tycheDarkBlue break-words md:truncate cursor-pointer hover:underline"
                          onClick={handleAddressClick(wallet)}
                        >
                          {shortenAddress(wallet.address)}
                        </span>
                      </div>

                      <div className="flex flex-col w-full">
                        <span className="text-[14px] font-bold md:hidden">
                          Tag:
                        </span>
                        <span className="text-[14px] md:text-[16px] break-words md:truncate">
                          {wallet.tag}
                        </span>
                      </div>

                      <div className="flex flex-col w-full">
                        <span className="text-[14px] font-bold md:hidden">
                          Network:
                        </span>
                        <span className="text-[14px] md:text-[16px]">
                          {supportedNetworks.find(
                            ([key,]) => key === wallet.network
                          )?.[1]}
                        </span>
                      </div>

                      <div className="flex flex-row gap-4 w-full justify-end md:justify-end mt-2 md:mt-0">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={() => handleEditWallet(wallet)}
                        >
                          <img
                            src={tagEditIcon}
                            alt="Edit"
                            className="max-w-5 max-h-5 min-w-5 min-h-5 md:max-w-6 md:max-h-6 md:min-w-6 md:min-h-6"
                          />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={() => handleDeleteWallet(wallet.id)}
                        >
                          <img
                            src={tagDeleteIcon}
                            alt="Delete"
                            className="max-w-5 max-h-5 min-w-5 min-h-5 md:max-w-6 md:max-h-6 md:min-w-6 md:min-h-6"
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
  const supportedNetworks = getSupportedNetworkPairs();
  const [address, setAddress] = useState(wallet ? wallet.address : "");
  const [tag, setTag] = useState(wallet ? wallet.tag : "");
  const [newNetwork, setNewNetwork] = useState(
    wallet ? wallet.network : "eth"
  );
  const addresses = useSelector((state) => state.wallet.addresses);

  const tagInputRef = useRef(null);
  const walletInputRef = useRef(null);

  useEffect(() => {
    if (wallet && tagInputRef.current) {
      tagInputRef.current.focus();
    } else if (walletInputRef.current) {
      walletInputRef.current.focus();
    }
  }, [wallet]);

  const validateWallet = () => {
    // Check for empty fields
    if (!address || !tag) {
      alert("Please fill in all fields");
      return false;
    }

    // Check tag length
    if (tag.length > 16) {
      alert("Tag cannot be longer than 16 characters");
      return false;
    }

    // Filter out the current wallet if we're editing
    const otherAddresses = addresses.filter(w => !wallet || w.id !== wallet.id);

    // Rule 1: Same address with different tags in same network
    const sameAddressInNetwork = otherAddresses.find(
      w => w.address.toLowerCase() === address.toLowerCase() && 
          w.network === newNetwork
    );
    if (sameAddressInNetwork) {
      alert("This address is already saved in this network");
      return false;
    }

    // Rule 2: Different addresses with same tag in same network
    const sameTagInNetwork = otherAddresses.find(
      w => w.tag.toLowerCase() === tag.toLowerCase() && 
          w.network === newNetwork
    );
    if (sameTagInNetwork) {
      alert("This tag is already used in this network");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateWallet()) return;

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
          placeholder="Tag (max 16 characters)"
          maxLength={16}
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
          onChange={(e) => {
            console.log("New network:", e.target.value);
            setNewNetwork(e.target.value);
          }}
          value={newNetwork}
        >
          {supportedNetworks.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
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
            className="max-w-5 max-h-5 min-w-5 min-h-5 md:max-w-6 md:max-h-6 md:min-w-6 md:min-h-6"
          />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={onCancel}
        >
          <img
            src={tagCancelIcon}
            alt="Cancel"
            className="max-w-5 max-h-5 min-w-5 min-h-5 md:max-w-6 md:max-h-6 md:min-w-6 md:min-h-6"
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
