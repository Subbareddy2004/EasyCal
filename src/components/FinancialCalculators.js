'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Home, 
  PiggyBank, 
  Shield, 
  Calculator, 
  Heart, 
  Car, 
  Percent,
  Sparkles,
  BarChart3
} from 'lucide-react'

// Import calculator components
import SIPCalculator from './calculators/SIPCalculator'
import EMICalculator from './calculators/EMICalculator'
import PPFCalculator from './calculators/PPFCalculator'
import FDCalculator from './calculators/FDCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import RetirementCalculator from './calculators/RetirementCalculator'
import LoanCalculator from './calculators/LoanCalculator'
import CompoundInterestCalculator from './calculators/CompoundInterestCalculator'

export default function FinancialCalculators() {
  const [activeTab, setActiveTab] = useState('sip')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const calculators = [
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate returns on Systematic Investment Plans',
      icon: TrendingUp,
      component: SIPCalculator,
      color: '#356935',
      category: 'Investment'
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate loan EMIs for home, car, personal loans',
      icon: Home,
      component: EMICalculator,
      color: '#356935',
      category: 'Loans'
    },
    {
      id: 'ppf',
      title: 'PPF Calculator',
      description: 'Calculate Public Provident Fund returns',
      icon: PiggyBank,
      component: PPFCalculator,
      color: '#356935',
      category: 'Savings'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate Fixed Deposit returns',
      icon: Shield,
      component: FDCalculator,
      color: '#356935',
      category: 'Deposits'
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Calculate income tax as per Indian tax slabs',
      icon: Calculator,
      component: TaxCalculator,
      color: '#356935',
      category: 'Tax'
    },
    {
      id: 'retirement',
      title: 'Retirement Calculator',
      description: 'Plan your retirement corpus',
      icon: Heart,
      component: RetirementCalculator,
      color: '#356935',
      category: 'Planning'
    },
    {
      id: 'loan',
      title: 'Loan Calculator',
      description: 'Compare different loan options',
      icon: Car,
      component: LoanCalculator,
      color: '#356935',
      category: 'Loans'
    },
    {
      id: 'compound',
      title: 'Compound Interest',
      description: 'Calculate compound interest growth',
      icon: Percent,
      component: CompoundInterestCalculator,
      color: '#356935',
      category: 'Investment'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161616' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl shadow-2xl" style={{ backgroundColor: '#356935' }}>
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              FinanceCalc
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: '#E5E5E5' }}>
              Professional financial planning tools designed for Indian investors, taxpayers, and financial advisors
            </p>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#7E7E7E' }}>
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 10,000+ users</span>
              <span>•</span>
              <span>100% Free</span>
              <span>•</span>
              <span>No Registration Required</span>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {calculators.map((calc, index) => {
              const Icon = calc.icon
              return (
                <button
                  key={calc.id}
                  onClick={() => setActiveTab(calc.id)}
                  className={`relative p-6 rounded-2xl border transition-all duration-200 group hover:scale-105 ${
                    activeTab === calc.id 
                      ? 'shadow-xl border-white/20' 
                      : 'hover:shadow-xl border-white/10 hover:border-white/20'
                  }`}
                  style={{ 
                    backgroundColor: activeTab === calc.id ? '#FBF1E2' : '#4B4B4B',
                    color: activeTab === calc.id ? '#161616' : '#FFFFFF'
                  }}
                >
                  <div 
                    className="inline-flex p-3 rounded-xl shadow-lg mb-4 group-hover:scale-105 transition-transform duration-200"
                    style={{ backgroundColor: calc.color }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-left">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-left leading-relaxed opacity-80">
                    {calc.description}
                  </p>
                  <div className="absolute top-4 right-4">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(53, 105, 53, 0.1)',
                        color: calc.color
                      }}
                    >
                      {calc.category}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="container mx-auto px-4 pb-16">
        {calculators.map((calc) => {
          if (calc.id !== activeTab) return null
          const Component = calc.component
          return (
            <div key={calc.id} className="transition-opacity duration-300">
              <Card 
                className="border-0 shadow-2xl backdrop-blur-xl"
                style={{ backgroundColor: '#FBF1E2' }}
              >
                <CardHeader className="border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-4 rounded-2xl shadow-lg"
                      style={{ backgroundColor: calc.color }}
                    >
                      <calc.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold" style={{ color: '#161616' }}>
                        {calc.title}
                      </CardTitle>
                      <CardDescription className="text-lg" style={{ color: '#4B4B4B' }}>
                        {calc.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {isClient ? <Component /> : (
                    <div className="flex items-center justify-center h-64">
                      <div className="relative">
                        <div 
                          className="animate-spin rounded-full h-12 w-12 border-4"
                          style={{ borderColor: '#E5E5E5' }}
                        ></div>
                        <div 
                          className="animate-spin rounded-full h-12 w-12 border-4 border-transparent absolute top-0 left-0"
                          style={{ borderTopColor: '#356935' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}