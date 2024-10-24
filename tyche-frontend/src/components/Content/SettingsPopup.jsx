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
import { addAddress, deleteAddress, updateAddress } from "../../redux/slices/walletSlice";

function SettingsPopup({ onClose, preferredTab, newWallet, walletToEdit }) {
  const [activeTab, setActiveTab] = useState(preferredTab || "settings");
  //get settings from redux
  console.log("NEW WALLET");
  console.log(newWallet);
  console.log("WALLET TO EDIT");
  console.log(walletToEdit);
  return (
    <>
      <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
        <div className="fixed bg-tycheLightGray rounded-[40px] w-[50%] h-[80%] items-center">
          {PopupTabs(activeTab, setActiveTab, onClose)}
          <div className="flex flex-col w-full justify-top p-8">
            {activeTab === "settings" ? <GeneralSettings /> : <SavedWallets newWallet={newWallet} walletToEdit={walletToEdit} onClose={onClose}/>}
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
    <div className="flex flex-col gap-[45px]">
      <div className="flex flex-row gap-4 items-center">
        <p className="flex font-medium text-[20px]">Currency:</p>
        <select
          id="currency"
          name="currency"
          className="flex items-center bg-tychePrimary text-white text-[20px] px-6 py-1 h-[50px] rounded-full w-fit focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
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
      <div className="flex flex-row gap-4 items-center">
        <p className="flex font-medium text-[20px]">Timezone:</p>
        <select
          id="timezone"
          name="timezone"
          className="flex items-center bg-tychePrimary text-white text-[20px] px-6 py-1 h-[50px] w-fit rounded-full focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
          onChange={(e) =>
            dispatch(
              updateSettings({
                currency: generalSettings.currency,
                timezone: e.target.value,
              })
            )
          }
        >
          <option selected={generalSettings.timezone === "Europe/Berlin (CET)"}>
            Europe/Berlin
          </option>
          <option selected={generalSettings.timezone === "Europe/London (GMT)"}>
            Europe/London
          </option>
          <option selected={generalSettings.timezone === "Europe/Moscow (MSK)"}>
            Europe/Moscow
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
  }
  , [newWallet, walletToEdit]);

  return (
    <>
      <div className="flex flex-col gap-[35px] w-full">
        <select
          id="currency"
          name="currency"
          className="flex items-center bg-tychePrimary text-white text-[20px] py-[13px] w-fit px-[20px] h-[50px] rounded-full focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
          onChange={handleNetworkChange}
        >
          <option>All Networks</option>
          {networks.map((network) => (
            <option key={network} value={network}>
              {network}
            </option>
          ))}
        </select>
        <div className="flex flex-col gap-[20px] w-full">
          {/* Burası değişecek */}
          { addresses.length === 0 ? <p className="flex font-bold text-[20px] w-full justify-center">There is no saved address!</p>:
            <div className="flex flex-row gap-4 items-center justify-between w-full px-[29px]">
            <p className="flex font-bold text-[20px] w-[130px]">Address</p>
            <p className="flex font-bold text-[20px] w-[130px]">Tag</p>
            <p className="flex font-bold text-[20px] w-[130px]">Network</p>
            <p className="flex font-bold text-[20px] w-[130px] justify-end">
              Operations
            </p>
          </div>
          }
          <div className="flex flex-col gap-[20px] overflow-y-auto max-h-[250px]">
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
                    className="flex flex-row gap-4 items-center justify-between w-full min-h-[70px] max-h-[70px] rounded-[25px] px-[29px] bg-white"
                  >
                    <p className="text-[20px] w-[130px] overflow-hidden whitespace-nowrap text-ellipsis text-tycheDarkBlue">
                      {wallet.address}
                    </p>
                    <p className="text-[20px] w-[130px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {wallet.tag}
                    </p>
                    <p className="text-[20px] w-[130px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {wallet.network}
                    </p>
                    <div className="flex flex-row gap-4 w-[130px] overflow-hidden whitespace-nowrap text-ellipsis justify-end">
                      <button
                        className="flex items-center justify-center"
                        onClick={() => handleEditWallet(wallet)}
                      >
                        <img src={tagEditIcon} alt="Edit" />
                      </button>
                      <button
                        className="flex items-center justify-center"
                        onClick={() => handleDeleteWallet(wallet.id)}
                      >
                        <img src={tagDeleteIcon} alt="Delete" />
                      </button>
                    </div>
                  </div>
                )
              )}
          </div>
          {/* Save Wallet Button */}
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
    </>
  );
}

function AddWalletButton({ setSaveWalletButtonClicked }) {
  return (
    <button onClick={() => setSaveWalletButtonClicked(true)}>
      <div className="flex flex-row gap-4 items-center justify-center w-full rounded-[25px] px-[29px] border-dashed border-tycheDarkBlue h-[49px] border-[2px]">
        <div className="flex flex-row items-center justify-center gap-[11px]">
          <img src={saveWalletIcon} alt="Save Wallet" />
          <p className="flex text-[20px] text-tycheDarkBlue">Save Wallet</p>
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

  // Ref for tag input field
  const tagInputRef = useRef(null);
  const walletInputRef = useRef(null);

  // Focus on tag input when component is mounted
  useEffect(() => {
    if (wallet && tagInputRef.current) {
      tagInputRef.current.focus();
    }
    else if (walletInputRef.current) {
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
    <div className="flex flex-row gap-4 items-center justify-between w-full min-h-[70px] max-h-[70px] rounded-[25px] px-[29px] bg-tycheDarkGray">
      <input
        type="text"
        ref={walletInputRef}
        placeholder="Wallet"
        className="text-[20px] w-[130px] rounded-[16px] border-dashed border-tycheDarkGray border-[2px] focus:outline-none focus:border-tychePrimary px-1"
        defaultValue={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }
        }
      />
      <input
        type="text"
        ref={tagInputRef}
        placeholder="Tag"
        className="text-[20px] w-[130px] rounded-[16px] border-dashed border-tycheDarkGray border-[2px] focus:outline-none focus:border-tychePrimary px-1"
        defaultValue={tag}
        onChange={(e) => setTag(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }
        }
      />
      <select
        id="network"
        name="network"
        className="flex items-center bg-tycheLightGray text-black text-[20px] py-1 border-dashed border-tycheDarkGray border-[2px] w-[130px] rounded-full focus:outline-none focus:border-tychePrimary"
        onChange={(e) => setNewNetwork(e.target.value)}
        value={newNetwork}
      >
        {getSupportedNetworks().map((network) => (
          <option
            key={network}
            value={network}
            defaultValue={network === newNetwork}
          >
            {network}
          </option>
        ))}
      </select>

      <div className="flex flex-row gap-4 w-[130px] overflow-hidden whitespace-nowrap text-ellipsis justify-end">
        <button
          className="flex items-center justify-center"
          onClick={handleSubmit}
        >
          <img src={tagConfirmIcon} alt="Confirm" />
        </button>
        <button className="flex items-center justify-center" onClick={onCancel}>
          <img src={tagCancelIcon} alt="Cancel" />
        </button>
      </div>
    </div>
  );
}

function PopupTabs(activeTab, setActiveTab, onClose) {
  return (
    <div className="flex flex-grow justify-between items-center h-[85px]">
      <button
        className={`${
          activeTab === "settings"
            ? "bg-tycheLightGray text-black"
            : "bg-tychePrimary text-white"
        } p-1 rounded-tl-[40px] w-full h-full flex items-center justify-center`}
        onClick={() => setActiveTab("settings")}
      >
        <div className="flex items-center justify-center gap-2 p-2 w-full h-full font-bold text-[24px]">
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
        <div className="flex items-center justify-center gap-2 p-2 w-full h-full font-bold text-[24px]">
          Saved Wallets
        </div>
      </button>
      <button
        onClick={onClose}
        className="bg-tycheRed p-1 rounded-tr-[40px] flex min-w-[100px] h-full items-center justify-center"
      >
        <img src={popupCloseIcon} alt="Close" />
      </button>
    </div>
  );
}

export default SettingsPopup;
