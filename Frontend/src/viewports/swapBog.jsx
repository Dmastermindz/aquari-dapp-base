import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { useContext } from "react";
import { BlockchainContext } from "../pages/home";
import Dashboard from "../components/walletDashboardWidget";
import Footer from "../components/buyFooter";
import Modal from "../components/disclaimerModal";

//PancakeSwap Router Contract ABI and Address
import PANCAKESWAP_ROUTER_ABI from "../components/pancakeswapRouterABI.json";
const PANCAKESWAP_ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

// Aquari Token Address
import AQUARI_ABI from "../components/aquariABI.json";
const AQUARI_TOKEN_ADDRESS = "0x6500197a2488610aca288fd8e2dfe88ec99e596c";

const swapBog = ({ user }) => {
  const { privySigner, provider, embeddedWalletAddress, linkedWalletAddress, walletBalance } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(embeddedWalletAddress);
  const [inputValue, setInputValue] = useState("0.01");
  const [aquariInputValue, setAquariInputValue] = useState("1000000");
  const [recipientAddress, setRecipientAddress] = useState("");
  const privySignerAddress = privySigner;
  console.log("Captured Privy Signer", privySigner);
  console.log("Captured Privy Embedded Address", embeddedWalletAddress);
  console.log("Captured Privy Linked Address", linkedWalletAddress);
  console.log("Connected Wallet Address:", connectedWallet);

  const handleChangeRecipient = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleChange = (event) => {
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setInputValue(event.target.value);
    }
  };

  const handleAquariChange = (event) => {
    if (/^\d*\.?\d*$/.test(aquariInputValue)) {
      setAquariInputValue(event.target.value);
    }
  };

  //Regular Expression to Extract Reason from ErrorMessage String
  function extractReasonFromErrorMessage(errorMessage) {
    const reasonPattern = /reason="(.*?)"/;
    const match = reasonPattern.exec(errorMessage);

    if (match && match[1]) {
      return match[1];
    } else {
      return "Error: Please Check your Inputs. If the problem persists please notify Developers in Aquari Telegram";
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    swapBNBForAquari();
  };

  const handleSubmit2 = async (event, value) => {
    event.preventDefault();
    await approveAquari();
    console.log("Waiting for Approval to Complete");
    await swapAquariForBNB();
    console.log("Waiting for Swap to Complete");
    console.log("Handle Submit 2 Completed");
  };

  const approveAquari = async () => {
    try {
      console.log("Trying to Approve Aquari Tokens");
      const approveTx = await tokenContract.approve(PANCAKESWAP_ROUTER_ADDRESS, ethers.utils.parseUnits(aquariInputValue, 9));
      await approveTx.wait();
      console.log("Approval successful! Aquari Tokens:", ethers.utils.parseUnits(aquariInputValue, 9));
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  useEffect(() => {
    if (linkedWalletAddress != "") {
      setConnectedWallet(linkedWalletAddress);
    } else {
      setConnectedWallet(embeddedWalletAddress);
    }
  }, [linkedWalletAddress, embeddedWalletAddress]);

  const pancakeSwapRouterContract = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS, PANCAKESWAP_ROUTER_ABI, provider);
  const tokenContract = new ethers.Contract(AQUARI_TOKEN_ADDRESS, AQUARI_ABI, privySigner);

  const swapBNBForAquari = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if privySigner.address is defined
      if (!privySigner) {
        setError("User's wallet is not connected");
        return;
      }

      const routerContract = pancakeSwapRouterContract.connect(privySigner);

      const bnbAmount = ethers.utils.parseEther(inputValue);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time
      const tx = await routerContract.swapExactETHForTokens(ethers.utils.parseUnits("0", "wei"), ["0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", AQUARI_TOKEN_ADDRESS], connectedWallet, deadline, { value: bnbAmount });
      await tx.wait();
      console.log("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
      setError(extractReasonFromErrorMessage(error.message));
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const swapAquariForBNB = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if privySigner.address is defined
      if (!privySigner) {
        setError("User's wallet is not connected");
        return;
      }

      const routerContract = pancakeSwapRouterContract.connect(privySigner);

      const bnbAmount = ethers.utils.parseEther(inputValue);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time
      console.log("Trying to Initate Swap of Aquari Tokens:", aquariInputValue);
      const tx = await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(ethers.utils.parseUnits(aquariInputValue, "9"), ethers.utils.parseUnits("0", "18"), [AQUARI_TOKEN_ADDRESS, "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"], connectedWallet, deadline, { gasLimit: 500000 });
      await tx.wait();
      console.log("Swap successful! Aquari Tokens:", aquariInputValue);
    } catch (error) {
      console.error("Swap failed:", error);
      setError(extractReasonFromErrorMessage(error.message));
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendBNB = async (event) => {
    event.preventDefault();
    if (!privySigner) {
      setError("Wallet is not connected");
      return;
    }
    try {
      setLoading(true);
      const tx = await privySigner.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(inputValue),
      });
      await tx.wait();
      console.log(`BNB transfer successful: ${tx.hash}`);
      setError(null);
    } catch (err) {
      console.error("Error sending BNB:", err);
      setError(`Failed to send BNB: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="bg-[#090d18] full-height overflow-y-hidden map-container  rounded-b-none border-[#363a45] border-t-[2px] border-b-[3px]">
    //   <Trading />
    // </div>

    <div>
      <div className="bg-[#000000] overflow-y-auto bg-opacity-40  h-full full-height rounded-2xl rounded-b-none rounded-r-none py-8 px-5 md:px-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
          <h1 className="text-3xl mt-3 md:mt-4 lg:mt-4 font-semibold tracking-wider">{`My Wallet`}</h1>
          <p className="mt-2 text-sm text-white">{`BNB Chain Address: ${connectedWallet}`}</p>
          <Dashboard
            walletBalance={walletBalance}
            linkedWalletAddress={linkedWalletAddress}
            embeddedWalletAddress={embeddedWalletAddress}
          />
        </div>

        <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`1) Deposit Cash`}</h1>
          <button
            onClick={() => window.open(`https://buy.onramper.com/?apiKey=pk_prod_01GZXWJF7DNX8FSP2HK7W0KT53&onlyCryptos=bnb_bsc&mode=buy&onlyOnramps=guardarian&networkWallets=bsc:${connectedWallet}&defaultFiat=eur&defaultAmount=55&defaultPaymentMethod=creditcard#`)}
            disabled={loading}
            className="bg-[#232734] bg-opacity-70 shadowz mt-4 w-full h-[70px] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
            {"Purchase BNB using Debit Card / iDeal"}
          </button>
          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`2) Manage Wallet`}</h1>
          <form
            className="mt-6"
            onSubmit={handleSubmit}>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Aquari Currency Converter
            </label>
            <label
              for="email"
              class="block mb-2 mt-4 text-xs font-medium text-gray-900 dark:text-white">
              Convert BNB into Aquari
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={inputValue}
              onChange={handleChange}
              defaultValue={0.01}
            />
            <button
              className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
              type="submit">
              {loading ? "Swapping..." : "BNB -> Aquari"}
            </button>
          </form>

          <form
            className="mt-6"
            onSubmit={handleSubmit2}>
            <label
              for="email"
              class="block mb-2 text-xs font-medium text-gray-900 dark:text-white">
              Convert Aquari into BNB
            </label>

            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              defaultValue={0}
              value={aquariInputValue}
              onChange={handleAquariChange}
            />
            <p className="text-xs mt-3 font-semibold text-yellow-500">*This operation requires 2 transactions (Enter Amount of Aquari Tokens)</p>
            <button
              className="bg-[#232734] bg-opacity-90  mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
              type="submit"
              disabled={false}>
              {loading ? "Swapping..." : "Aquari -> BNB"}
            </button>
          </form>
          <form
            className="mt-12"
            onSubmit={sendBNB}>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Withdraw BNB to Exchange or External Wallet
            </label>
            <label
              for="email"
              class="block mb-2 mt-4 text-xs font-medium text-gray-900 dark:text-white">
              BNB Amount
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={inputValue}
              onChange={handleChange}
              defaultValue={0}
            />
            <label
              for="email"
              class="block mt-6 mb-2 text-xs font-medium text-gray-900 dark:text-white">
              BNB-Chain Wallet Address
            </label>
            <input
              className=" bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              // value={inputValue}
              onChange={handleChangeRecipient}
            />
            <div className="flex flex-row gap-2">
              <button
                className="bg-[#232734] bg-opacity-90  mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
                type="submit"
                disabled={false}>
                {"Cash Out BNB"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default swapBog;
