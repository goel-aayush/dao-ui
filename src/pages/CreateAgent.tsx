import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const AGENT_FACTORY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Update with actual contract address
const AGENT_FACTORY_ABI = [
  "function connectUserToAgent(address userAddress, address agentAddressReceived) public",
  "function getAgent(address userAddress) public view returns (address)",
];

export default function CreateAgent() {
  const [agentAddress, setAgentAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [inputAgentAddress, setInputAgentAddress] = useState("");
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) connectWallet();
    else setError("❌ MetaMask is required to use this feature.");
  }, []);

  const connectWallet = async () => {
    try {
      setError(null);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (!accounts.length) throw new Error("❌ No accounts found.");
      setAccount(accounts[0]);
      fetchAgentAddress(accounts[0]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "❌ Failed to connect wallet.");
      } else {
        setError("❌ Failed to connect wallet.");
      }
    }
  };

  interface AgentFactoryContract {
    connectUserToAgent(
      userAddress: string,
      agentAddressReceived: string
    ): Promise<void>;
    getAgent(userAddress: string): Promise<string>;
  }

  const fetchAgentAddress = async (userAddress: string): Promise<void> => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        AGENT_FACTORY_ADDRESS,
        AGENT_FACTORY_ABI,
        provider
      ) as unknown as AgentFactoryContract;
      const agent = await contract.getAgent(userAddress);
      if (agent === ethers.constants.AddressZero) {
        setAgentAddress(null);
        return;
      }
      setAgentAddress(agent);
      navigate("/chatbot");
    } catch (err) {
      setError("Failed to fetch agent address. Try again later.");
    }
  };

  const connectAgent = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is required.");
      if (!ethers.utils.isAddress(inputAgentAddress))
        throw new Error("❌ Invalid Ethereum address.");
      if (agentAddress) throw new Error("❌ Agent already assigned!");

      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        AGENT_FACTORY_ADDRESS,
        AGENT_FACTORY_ABI,
        signer
      );
      const tx = await contract.connectUserToAgent(account, inputAgentAddress);
      await tx.wait();

      setAgentAddress(inputAgentAddress);
      setSuccessMessage("🎉 Agent successfully connected!");
      navigate("/chatbot");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "❌ Failed to connect agent.");
      } else {
        setError("❌ Failed to connect agent.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-900 text-white p-6">
      <h2 className="text-4xl font-bold">Connect Your Agent</h2>
      {!account ? (
        <button
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
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
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-600"
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
