import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { injected } from 'wagmi/connectors';

const CONTRACT_ADDRESS = '0xF7Aa71aF0f4FBDEd0F81565F55E85518907F69A6' as const;
const FXRP_ADDRESS = '0x0b6A3645c240605887a5532109323A3E12273dc7' as const;

const CONTRACT_ABI = [
  { inputs: [{ name: 'amount', type: 'uint256' }], name: 'depositFXRP', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'getFLRPrice', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'assets', type: 'uint256' }], name: 'depositFirelight', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'assets', type: 'uint256' }], name: 'depositUpshift', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'user', type: 'address' }], name: 'getFXRPBalance', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'user', type: 'address' }], name: 'getFirelightShares', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'user', type: 'address' }], name: 'getUpshiftShares', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

const FXRP_ABI = [
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
] as const;

type PendingAction = 'deposit' | 'firelight' | 'upshift' | null;

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: writeData, isPending } = useWriteContract();
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash: writeData });

  const [depositAmount, setDepositAmount] = useState<string>('');
  const [firelightAmount, setFirelightAmount] = useState<string>('');
  const [upshiftAmount, setUpshiftAmount] = useState<string>('');
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [status, setStatus] = useState<string>('');

  // ---- Read Contract with refetch ----
  const { data: price, refetch: refetchPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFLRPrice',
  });

  const { data: fxrpBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFXRPBalance',
    args: address ? [address] : undefined,
  });

  const { data: firelightShares, refetch: refetchFirelight } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFirelightShares',
    args: address ? [address] : undefined,
  });

  const { data: upshiftShares, refetch: refetchUpshift } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUpshiftShares',
    args: address ? [address] : undefined,
  });

  // ---- Refresh all data ----
  const refreshAllData = () => {
    refetchBalance();
    refetchFirelight();
    refetchUpshift();
    refetchPrice();
    setStatus('🔄 Refreshing...');
    setTimeout(() => setStatus(''), 2000);
  };

  // ---- Auto-refresh after transaction ----
  useEffect(() => {
    if (isSuccess) {
      refreshAllData();
      setStatus('✅ Transaction successful!');
      setTimeout(() => setStatus(''), 5000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess && isApproving && pendingAction === 'deposit') {
      const amount = parseEther(depositAmount);
      setStatus('⏳ Depositing FXRP...');
      setIsApproving(false);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'depositFXRP',
        args: [amount],
      });
      setPendingAction(null);
      setDepositAmount('');
    }
  }, [isSuccess, isApproving, pendingAction]);

  // ---- Handlers ----
  const handleDeposit = () => {
    if (!depositAmount) return;
    const amount = parseEther(depositAmount);
    setStatus('⏳ Approving FXRP...');
    setPendingAction('deposit');
    setIsApproving(true);
    
    writeContract({
      address: FXRP_ADDRESS,
      abi: FXRP_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, amount],
    });
  };

  const handleFirelightDeposit = () => {
    if (!firelightAmount) return;
    const amount = parseEther(firelightAmount);
    setStatus('⏳ Depositing to Firelight...');
    setPendingAction('firelight');
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'depositFirelight',
      args: [amount],
    });
  };

  const handleUpshiftDeposit = () => {
    if (!upshiftAmount) return;
    const amount = parseEther(upshiftAmount);
    setStatus('⏳ Depositing to Upshift...');
    setPendingAction('upshift');
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'depositUpshift',
      args: [amount],
    });
  };

  const isLoading = isPending || isWaiting;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4 animate-fade-in">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,165,0,0.3)] animate-glow">
              🚀 FXRP DeFi Hub
            </h1>
            <p className="text-gray-300 text-sm mt-1">Flare Summer Signal Hackathon 2026</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {isConnected && (
              <button
                onClick={refreshAllData}
                className="bg-blue-600/20 hover:bg-blue-600/40 px-4 py-2 rounded-lg transition text-sm text-blue-400 hover:text-blue-300"
              >
                🔄 Refresh
              </button>
            )}
            {!isConnected ? (
              <button
                onClick={() => connect({ connector: injected() })}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-2.5 rounded-lg transition font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
              >
                🔗 Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-[#1a1a24] px-4 py-2 rounded-lg border border-gray-700 animate-slide-in">
                <span className="text-sm text-gray-200">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="bg-red-600/20 hover:bg-red-600/40 px-4 py-1.5 rounded-lg transition text-sm text-red-400 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className="mb-4 p-3 bg-[#1a1a24] rounded-lg border border-gray-700 text-center text-sm text-gray-200 animate-fade-in">
            {status}
          </div>
        )}

        {/* Stats Cards */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1a1a24] rounded-xl p-4 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <p className="text-sm text-gray-300">FXRP Balance</p>
              <p className="text-xl font-bold text-orange-400">{fxrpBalance ? Number(formatEther(fxrpBalance)).toFixed(4) : '0'} FXRP</p>
            </div>
            <div className="bg-[#1a1a24] rounded-xl p-4 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <p className="text-sm text-gray-300">Firelight Shares</p>
              <p className="text-xl font-bold text-emerald-400">{firelightShares ? Number(formatEther(firelightShares)).toFixed(4) : '0'}</p>
            </div>
            <div className="bg-[#1a1a24] rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <p className="text-sm text-gray-300">Upshift Shares</p>
              <p className="text-xl font-bold text-blue-400">{upshiftShares ? Number(formatEther(upshiftShares)).toFixed(4) : '0'}</p>
            </div>
          </div>
        )}

        {/* FLR Price */}
        {price && (
          <div className="bg-[#1a1a24] rounded-xl p-4 mb-8 border border-gray-700 flex justify-between items-center">
            <span className="text-gray-300">FLR Price</span>
            <span className="text-xl font-bold text-green-400">${Number(formatEther(price)).toFixed(4)}</span>
          </div>
        )}

        {/* Deposit FXRP */}
        <div className="bg-[#1a1a24] rounded-xl p-6 mb-6 border border-gray-700 hover:border-orange-500/30 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <span>💰</span> Deposit FXRP
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in FXRP"
              className="flex-1 min-w-[200px] bg-[#0f0f1a] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 text-white placeholder-gray-400 transition-all duration-300 focus:scale-105"
            />
            <button
              onClick={handleDeposit}
              disabled={!isConnected || !depositAmount || isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-2.5 rounded-lg transition disabled:opacity-50 font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                'Deposit'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">First deposit: 2 transactions (Approve + Deposit)</p>
        </div>

        {/* Firelight Vault */}
        <div className="bg-[#1a1a24] rounded-xl p-6 mb-6 border border-gray-700 hover:border-emerald-500/30 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <span>🔥</span> Firelight Vault <span className="text-sm text-emerald-400 font-semibold">(Yield)</span>
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              value={firelightAmount}
              onChange={(e) => setFirelightAmount(e.target.value)}
              placeholder="Amount in FXRP"
              className="flex-1 min-w-[200px] bg-[#0f0f1a] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 text-white placeholder-gray-400 transition-all duration-300 focus:scale-105"
            />
            <button
              onClick={handleFirelightDeposit}
              disabled={!isConnected || !firelightAmount || isLoading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8 py-2.5 rounded-lg transition disabled:opacity-50 font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
            >
              {isLoading && pendingAction === 'firelight' ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                'Deposit'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Earn yield through FAssets system. Deposits processed at specific intervals.</p>
        </div>

        {/* Upshift Vault */}
        <div className="bg-[#1a1a24] rounded-xl p-6 mb-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <span>⬆️</span> Upshift Vault <span className="text-sm text-blue-400 font-semibold">(Yield + Flexible)</span>
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              value={upshiftAmount}
              onChange={(e) => setUpshiftAmount(e.target.value)}
              placeholder="Amount in FXRP"
              className="flex-1 min-w-[200px] bg-[#0f0f1a] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 text-white placeholder-gray-400 transition-all duration-300 focus:scale-105"
            />
            <button
              onClick={handleUpshiftDeposit}
              disabled={!isConnected || !upshiftAmount || isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-2.5 rounded-lg transition disabled:opacity-50 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
            >
              {isLoading && pendingAction === 'upshift' ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                'Deposit'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Instant or requested redemptions. Lower fees for requested redemptions after lag period.</p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-6 animate-fade-in">
          <p>Deployed on <span className="text-orange-400">Coston2</span> | Contract: <span className="font-mono">{CONTRACT_ADDRESS.slice(0, 12)}...{CONTRACT_ADDRESS.slice(-8)}</span></p>
          <p className="mt-1">🏆 Flare Summer Signal Hackathon 2026</p>
        </div>
      </div>
    </div>
  );
}

export default App;