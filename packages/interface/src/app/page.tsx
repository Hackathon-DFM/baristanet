'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code,
  CreditCard,
  Database,
  DollarSign,
  Globe,
  Layers,
  Link2,
  Shield,
  Wallet,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/crossChainSwap/ui/button';

const scrollToBuilders = () => {
  const section = document.getElementById('builders') as HTMLElement | null;
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white">
      {/* BaristaNet Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="mb-4 flex items-center justify-center">
              <Image
                src="/baristaNet.png"
                alt="BaristaNet Logo"
                width={300}
                height={300}
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              BaristaNet
            </h1>
            <p className="mx-auto max-w-[900px] text-xl text-blue-400 md:text-2xl">
              {/* <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span> */}
              A Unified Liquidity Layer for ERC-7683 and Cross-Chain Intents
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/solver">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
                >
                  Launch App <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                onClick={scrollToBuilders}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Problem Section */}
      <section
        id="features"
        className="w-full bg-gray-900/70 py-12 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Cross-Chain Solving Is Still Broken
            </h2>
            <p className="max-w-[85%] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The current state of cross-chain solving presents significant
              challenges for solvers.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
              <Layers className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold">
                  Fragmented liquidity across chains
                </h3>
                <p className="text-gray-300">
                  Solvers must manage separate liquidity pools on each
                  blockchain.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
              <Link2 className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold">Constant rebalancing and bridging</h3>
                <p className="text-gray-300">
                  Moving assets between chains is time-consuming and expensive.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
              <Wallet className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold">Capital inefficiency</h3>
                <p className="text-gray-300">
                  Locked capital in multiple chains reduces overall efficiency.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-400 mt-1 shrink-0"
              >
                <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                <path d="M12 13v8" />
                <path d="M12 3v3" />
              </svg>
              <div>
                <h3 className="font-bold">High barrier for new solvers</h3>
                <p className="text-gray-300">
                  Complex infrastructure requirements prevent new participants
                  from entering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Solution Section */}
      <section id="solution" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              One Collateral. Borrow Anywhere.
            </h2>
            <p className="max-w-[85%] text-xl text-gray-300">
              Deposit once. Solve across chains. It&apos;s that simple.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold">Deposit once on BaristaNet</h3>
                    <p className="text-gray-300">
                      A single deposit unlocks solving capabilities across all
                      supported chains.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold">Borrow flexibly across chains</h3>
                    <p className="text-gray-300">
                      Use your collateral to borrow assets on any supported
                      blockchain.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold">No rebalancing required</h3>
                    <p className="text-gray-300">
                      Eliminate the need for constant bridging and rebalancing
                      of assets.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-blue-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold">Just solve</h3>
                    <p className="text-gray-300">
                      Focus on solving intents rather than managing complex
                      infrastructure.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50">
                <Image
                  src="/forVault.jpg"
                  width={450}
                  height={450}
                  alt="Unified vault illustration"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Use Cases Section */}
      <section className="w-full bg-gray-900/70 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Endless Cross-Chain Possibilities
            </h2>
            <p className="max-w-[85%] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              BaristaNet enables a wide range of cross-chain applications and
              use cases.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Cross-Chain Borrow Lending
              </h3>
              <p className="text-gray-300">
                Borrow assets on one chain using collateral from another,
                unlocking new DeFi possibilities.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Cross-Chain Token Minting
              </h3>
              <p className="text-gray-300">
                Mint tokens on multiple chains simultaneously with unified
                liquidity and management.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cross-Chain Payroll</h3>
              <p className="text-gray-300">
                Pay employees or contractors across different blockchains from a
                single source of funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BaristaNet CTA Section */}
      {/* <section className="w-full bg-gray-900/70 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to start solving?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join BaristaNet today and experience the future of cross-chain
                solving.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/solver">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
                >
                  Start Now <ChevronRight className="h-4 w-4" />
                </Button>
              </Link> */}
      {/* <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
              >
                Connect Wallet
              </Button> */}
      {/* </div>
          </div>
        </div>
      </section> */}

      {/* Builders Section */}
      <section id="builders" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-5xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-8 md:p-12 border border-blue-800/30">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <Code className="h-16 w-16 text-blue-400 mb-4" />
                {/* <h2 className="text-3xl font-bold tracking-tighter mb-4">
                  Build With Us
                </h2> */}
                <p className="text-gray-300 text-lg mb-6">
                  We are inviting builders to build on top of BaristaNet to
                  enable trustless, decentralized cross-chain apps. We build
                  together, we win together.
                </p>
                {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Join Our Ecosystem
                </Button> */}
              </div>
              <div className="md:w-1/2 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>Build With Us</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section Divider */}
      <div className="relative py-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0f172a] px-4 text-sm text-gray-400 uppercase tracking-widest">
            Featured Partner
          </span>
        </div>
      </div>
      {/* Solver Hero Section */}
      <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <Image
                src="/caramelSwap.png"
                alt="CaramelSwap Logo"
                width={300}
                height={300}
              />
            </div>
            <div className="mb-6 inline-block px-3 py-1 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium">
              Powered by BaristaNet
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block">Swap Tokens Instantly</span>
              <span className="block text-blue-500">Across Any Chain</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              The most efficient decentralized exchange aggregator, offering the
              best rates by discovering the most efficient swap routes across
              protocols.
            </p>
            <div className="mt-10 flex justify-center gap-5 sm:gap-20 flex-wrap">
              <Link href="/swap">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {/* <Link href="/solver">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-900/20 px-8 py-6 text-lg rounded-xl"
                >
                  View Solvers
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/70">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-500">
                $42B+
              </p>
              <p className="mt-2 text-gray-300">Total Volume</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-500">
                8.5M+
              </p>
              <p className="mt-2 text-gray-300">Total Trades</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-500">
                3.2M+
              </p>
              <p className="mt-2 text-gray-300">Total Users</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-500">
                15+
              </p>
              <p className="mt-2 text-gray-300">Supported Chains</p>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Lightning Fast Swaps
              </h3>
              <p className="text-gray-300">
                Execute trades in seconds with our optimized routing algorithm
                that finds the most efficient path for your swap.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Maximum Security</h3>
              <p className="text-gray-300">
                Your funds are always secure with non-custodial trading and
                smart contract audits by leading security firms.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cross-Chain Swaps</h3>
              <p className="text-gray-300">
                Seamlessly swap tokens across multiple blockchains without the
                complexity of traditional bridge solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solver CTA Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/70">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to start swapping?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of traders who are already enjoying the best rates
              and fastest swaps across multiple chains.
            </p>
            <Link href="/swap">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold">BaristaNet</span>
              <p className="text-gray-400 mt-2">© 2025 All rights reserved</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Docs
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
