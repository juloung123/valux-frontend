import Link from 'next/link'
import { ArrowRight, Zap, Shield, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Valux
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              The most user-friendly DeFi automation platform for seamless
              profit distribution and yield optimization.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/vaults"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Explore Vaults
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/rules"
                className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 transition-colors"
              >
                Create Rules
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Valux?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience DeFi like never before with our intuitive platform designed for everyone
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  Lightning Fast
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Execute trades in milliseconds with our optimized smart contracts and advanced routing algorithms.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  Bank-Grade Security
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Your funds are protected by audited smart contracts and industry-leading security practices.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  User-Friendly
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Intuitive interface designed for both beginners and experienced traders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Total Value Locked</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                $12.4M
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Active Users</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                8,400+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Average APY</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                12.5%
              </dd>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start earning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of users who are already maximizing their DeFi yields with Valux.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/vaults"
                className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
              >
                Get started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}