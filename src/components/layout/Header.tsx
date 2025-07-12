'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NAVIGATION_ITEMS, APP_CONFIG, UI } from '@/lib/constants'
import { Button } from '@/components/ui'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className={`bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 ${UI.Z_INDEX.header}`}>
        <nav className={`mx-auto flex ${UI.MAX_WIDTH} items-center justify-between p-6 lg:px-8`} aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link 
              href="/" 
              className="-m-1.5 p-1.5 flex items-center space-x-2"
              aria-label={`${APP_CONFIG.name} home`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg" aria-hidden="true">
                  V
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {APP_CONFIG.name.split('.')[0]}
              </span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="rounded-md p-2.5"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:gap-x-12" role="navigation" aria-label="Main navigation">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Desktop connect button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <ConnectButton 
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className={`fixed inset-0 ${UI.Z_INDEX.modal} lg:hidden`}
          role="dialog" 
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Menu panel */}
          <div className={`fixed inset-y-0 right-0 ${UI.Z_INDEX.modal} w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm border-l border-gray-200 ${UI.SHADOWS.xl}`}>
            {/* Header */}
            <header className="flex items-center justify-between">
              <Link 
                href="/" 
                className="-m-1.5 p-1.5 flex items-center space-x-2"
                onClick={closeMobileMenu}
                aria-label={`${APP_CONFIG.name} home`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg" aria-hidden="true">
                    V
                  </span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {APP_CONFIG.name.split('.')[0]}
                </span>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="rounded-md p-2.5"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </header>
            
            {/* Navigation */}
            <nav className="mt-6 flow-root" role="navigation" aria-labelledby="mobile-menu-title">
              <h2 id="mobile-menu-title" className="sr-only">Main menu</h2>
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {NAVIGATION_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {/* Connect wallet button */}
                <div className="py-6">
                  <div className="flex justify-center">
                    <ConnectButton 
                      chainStatus="icon"
                      accountStatus="full"
                      showBalance={false}
                    />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header