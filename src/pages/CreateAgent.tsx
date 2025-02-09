import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom"; // For redirecting users

// Declare global window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}

const AGENT_FACTORY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Replace with deployed contract address
const AGENT_FACTORY_ABI = [
  "function connectUserToAgent(address userAddress, address agentAddressReceived) public",
  "function getAgent(address userAddress) public view returns (address)",
];

export default function CreateAgent() {
  const [agentAddress, setAgentAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [inputAgentAddress, setInputAgentAddress] = useState(""); // User input
  const [account, setAccount] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.ethereum) {
      setError("❌ MetaMask is required to use this feature.");
      return;
    }
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      setError(null);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) throw new Error("❌ No accounts found.");
      setAccount(accounts[0]);
      fetchAgentAddress(accounts[0]);
    } catch (err: any) {
      setError(err.message || "❌ Failed to connect wallet.");
    }
  };

  const fetchAgentAddress = async (userAddress: string) => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        AGENT_FACTORY_ADDRESS,
        AGENT_FACTORY_ABI,
        provider
      );

      const agent = await contract.getAgent(userAddress);
      console.log("Fetched Agent Address:", agent);

      if (agent.toString() === ethers.constants.AddressZero.toString()) {
        setAgentAddress(null);
        setError("You don't have an assigned agent. Please connect one.");
        return;
      }

      setAgentAddress(agent);
      navigate("/chatbot");
    } catch (error: any) {
      console.error("Error fetching agent address:", error);
      setError("Failed to fetch agent address. Try again later.");
    }
  };

  const connectAgent = async () => {
    try {
      setLoading(true);
      setError(""); // Reset error
      setSuccessMessage(""); // Reset success message

      if (!window.ethereum) {
        throw new Error("MetaMask is required to use this feature.");
      }

      if (!ethers.utils.isAddress(inputAgentAddress)) {
        throw new Error("❌ Invalid Ethereum address.");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        AGENT_FACTORY_ADDRESS,
        AGENT_FACTORY_ABI,
        signer
      );

      // Call `connectUserToAgent`
      const tx = await contract.connectUserToAgent(account, inputAgentAddress);
      await tx.wait(); // Wait for transaction confirmation
      console.log("Agent Connected:", inputAgentAddress);

      setAgentAddress(inputAgentAddress);
      setSuccessMessage("🎉 Agent successfully connected!");
    } catch (err: any) {
      console.error("Error connecting agent:", err);
      setError(err.message || "❌ Failed to connect agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-900 text-white">
      <h2 className="text-4xl font-bold">Connect Your Agent</h2>

      {!account && (
        <button
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      {account && (
        <>
          <p className="mt-4 text-lg">
            Connected Wallet:{" "}
            <span className="font-mono text-green-400">{account}</span>
          </p>

          {!agentAddress ? (
            <>
              <input
                type="text"
                placeholder="Enter Agent Address"
                value={inputAgentAddress}
                onChange={(e) => setInputAgentAddress(e.target.value)}
                className="mt-4 px-4 py-2 text-black rounded-lg"
              />

              <button
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={connectAgent}
                disabled={loading}
              >
                {loading ? "Connecting..." : "Connect Agent"}
              </button>
            </>
          ) : (
            <p className="mt-4 text-lg">
              ✅ Agent Address:{" "}
              <span className="font-mono text-green-400">{agentAddress}</span>
            </p>
          )}
        </>
      )}
      {error && <p className="mt-4 text-red-400">{error}</p>}
      {successMessage && !error && (
        <p className="mt-4 text-green-400">{successMessage}</p>
      )}
    </div>
  );
}
