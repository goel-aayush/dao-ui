import { useState, useEffect } from "react";
import { ethers } from "ethers";
import governorAbi from "../utils/AiDaoGovernor.json";
import tokenAbi from "../utils/AiDaoToken.json";
import "tailwindcss/tailwind.css";

const GOVERNOR_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ChatbotGovernace = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
    null
  );
  const [governorContract, setGovernorContract] =
    useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState("0");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposals, setProposals] = useState<
    { id: string; description: string }[]
  >([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!provider) return alert("Install MetaMask");
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const signer = provider.getSigner();
      const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi.abi, signer);
      const governor = new ethers.Contract(
        GOVERNOR_ADDRESS,
        governorAbi.abi,
        signer
      );
      setTokenContract(token);
      setGovernorContract(governor);
      const balance = await token.balanceOf(accounts[0]);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const delegateVotes = async () => {
    try {
      if (!tokenContract) return;
      setIsButtonDisabled(true);
      const tx = await tokenContract.delegate(account);
      await tx.wait();
      alert("Votes Delegated");
    } catch (error) {
      console.error("Delegation error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const createProposal = async () => {
    try {
      if (!governorContract) return;
      setIsButtonDisabled(true);
      const tx = await governorContract.propose(
        [],
        [],
        [],
        proposalDescription
      );
      await tx.wait();
      alert("Proposal Created");
    } catch (error) {
      console.error("Proposal creation error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const fetchProposals = async () => {
    try {
      if (!governorContract) return;
      setIsButtonDisabled(true);
      const filter = governorContract.filters.ProposalCreated();
      const events = await governorContract.queryFilter(filter);
      const proposalsArray = events.map((event) => ({
        id: event.args?.proposalId.toString() || "N/A",
        description: event.args?.description || "No description",
      }));
      setProposals(proposalsArray);
    } catch (error) {
      console.error("Fetching proposals error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 text-center">
      <h1 className="text-3xl font-bold mb-5">AI DAO Governance</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-500 text-white p-3 rounded shadow-lg hover:bg-blue-600 transition"
      >
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
      {account && (
        <div className="mt-5">
          <p className="text-lg">
            Your ADT Balance: <span className="font-semibold">{balance}</span>
          </p>
          <button
            onClick={delegateVotes}
            className={`p-3 rounded mt-3 shadow-lg transition ${
              isButtonDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isButtonDisabled}
          >
            Delegate Votes
          </button>
          <div className="mt-5 flex justify-center gap-3">
            <input
              type="text"
              placeholder="Proposal Description"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              className="border p-3 w-1/2 text-black rounded"
            />
            <button
              onClick={createProposal}
              className={`p-3 rounded shadow-lg transition ${
                isButtonDisabled
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
              disabled={isButtonDisabled}
            >
              Create Proposal
            </button>
          </div>
          <button
            onClick={fetchProposals}
            className={`p-3 rounded mt-5 shadow-lg transition ${
              isButtonDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={isButtonDisabled}
          >
            Fetch Proposals
          </button>
          <ul className="mt-5 space-y-3">
            {proposals.map((proposal, index) => (
              <li key={index} className="p-4 border rounded-lg bg-gray-800">
                <p>
                  <span className="font-semibold">Proposal ID:</span>{" "}
                  {proposal.id}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {proposal.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatbotGovernace;
