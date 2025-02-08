import { useState, useEffect } from "react";
import { ethers } from "ethers";
import governorJson from "../utils/AiDaoGovernor.json"; // Replace with actual ABI file
import tokenJson from "../utils/AiDaoToken.json"; // Replace with actual ABI file

const governorABI = governorJson.abi;
const tokenABI = tokenJson.abi;

const governorAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ChatbotGovernance = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [governor, setGovernor] = useState<ethers.Contract | null>(null);
  const [token, setToken] = useState<ethers.Contract | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [proposals, setProposals] = useState<any[]>([]);
  const [newProposal, setNewProposal] = useState({
    description: "",
    targets: [],
    values: [],
    calldatas: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Signer = web3Provider.getSigner();
      const userAccount = await web3Signer.getAddress();

      const governorContract = new ethers.Contract(
        governorAddress,
        governorABI,
        web3Signer
      );
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenABI,
        web3Signer
      );

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(userAccount);
      setGovernor(governorContract);
      setToken(tokenContract);

      const balance = await tokenContract.balanceOf(userAccount);
      setTokenBalance(ethers.utils.formatEther(balance));

      fetchProposals(governorContract);
    };

    initWeb3();
  }, []);

  const fetchProposals = async (govContract: ethers.Contract) => {
    try {
      const filter = govContract.filters.ProposalCreated();
      const events = await govContract.queryFilter(filter);

      const proposalsArray = events.map((event) => ({
        id: event.args ? event.args.proposalId.toString() : "undefined",
        description: event.args ? event.args.description : "No description",
      }));

      setProposals(proposalsArray);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const createProposal = async () => {
    if (!governor || !signer) return;

    setLoading(true);
    try {
      const tx = await governor.propose(
        newProposal.targets,
        newProposal.values,
        newProposal.calldatas,
        newProposal.description
      );
      await tx.wait();
      alert("Proposal created!");
      fetchProposals(governor);
    } catch (error) {
      console.error("Error creating proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  const voteOnProposal = async (proposalId: string, support: boolean) => {
    if (!governor || !signer) return;

    setLoading(true);
    try {
      const tx = await governor.castVote(
        ethers.BigNumber.from(proposalId),
        support ? 1 : 0
      );
      await tx.wait();
      alert("Vote submitted!");
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Chatbot Governance</h1>
      <div className="bg-gray-800 p-4 rounded-md w-full max-w-lg">
        <p>
          <strong>Connected Account:</strong> {account}
        </p>
        <p>
          <strong>Your Token Balance:</strong> {tokenBalance} ADT
        </p>
      </div>

      {/* Create Proposal */}
      <div className="bg-gray-800 p-4 rounded-md w-full max-w-lg mt-6">
        <h2 className="text-xl font-semibold">Create Proposal</h2>
        <input
          type="text"
          placeholder="Proposal Description"
          className="p-2 bg-gray-700 rounded w-full mt-2"
          onChange={(e) =>
            setNewProposal({ ...newProposal, description: e.target.value })
          }
          disabled={loading}
        />
        <button
          className={`mt-3 px-4 py-2 rounded w-full ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={createProposal}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>

      {/* Active Proposals */}
      <div className="bg-gray-800 p-4 rounded-md w-full max-w-lg mt-6">
        <h2 className="text-xl font-semibold">Active Proposals</h2>
        {proposals.length === 0 ? (
          <p className="text-gray-400">No active proposals.</p>
        ) : (
          <ul>
            {proposals.map((proposal) => (
              <li key={proposal.id} className="bg-gray-700 p-4 rounded my-2">
                <p>
                  <strong>{proposal.description}</strong>
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className={`px-3 py-1 rounded ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => voteOnProposal(proposal.id, true)}
                    disabled={loading}
                  >
                    {loading ? "Voting..." : "Vote Yes"}
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    onClick={() => voteOnProposal(proposal.id, false)}
                    disabled={loading}
                  >
                    {loading ? "Voting..." : "Vote No"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatbotGovernance;
