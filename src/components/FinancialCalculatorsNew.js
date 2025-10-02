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
  Percent
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
      color: 'bg-emerald-500',
      category: 'Investment'
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate loan EMIs for home, car, personal loans',
      icon: Home,
      component: EMICalculator,
      color: 'bg-blue-500',
      category: 'Loans'
    },
    {
      id: 'ppf',
      title: 'PPF Calculator',
      description: 'Calculate Public Provident Fund returns',
      icon: PiggyBank,
      component: PPFCalculator,
      color: 'bg-amber-500',
      category: 'Savings'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate Fixed Deposit returns',
      icon: Shield,
      component: FDCalculator,
      color: 'bg-purple-500',
      category: 'Deposits'
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Calculate income tax as per Indian tax slabs',
      icon: Calculator,
      component: TaxCalculator,
      color: 'bg-red-500',
      category: 'Tax'
    },
    {
      id: 'retirement',
      title: 'Retirement Calculator',
      description: 'Plan your retirement corpus',
      icon: Heart,
      component: RetirementCalculator,
      color: 'bg-indigo-500',
      category: 'Planning'
    },
    {
      id: 'loan',
      title: 'Loan Calculator',
      description: 'Compare different loan options',
      icon: Car,
      component: LoanCalculator,
      color: 'bg-orange-500',
      category: 'Loans'
    },
    {
      id: 'compound',
      title: 'Compound Interest',
      description: 'Calculate compound interest growth',
      icon: Percent,
      component: CompoundInterestCalculator,
      color: 'bg-teal-500',
      category: 'Investment'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EasyCal
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Financial calculators for Indians
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                Made with <span className="text-red-500 animate-pulse">❤️</span> in <span className="text-xl">🇮🇳</span>
              </p>
              <p className="text-lg text-gray-400 dark:text-gray-500 mt-1">
                by <span className="font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">skeslabs</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Navigation */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {calculators.map((calc) => {
            const Icon = calc.icon
            return (
              <button
                key={calc.id}
                onClick={() => setActiveTab(calc.id)}
                className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  activeTab === calc.id 
                    ? 'bg-white dark:bg-gray-800 shadow-lg border-blue-200 dark:border-blue-700' 
                    : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${calc.color} mb-2 mx-auto w-fit`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-white text-center">
                  {calc.title.split(' ')[0]}
                </h3>
              </button>
            )
          })}
        </div>

        {/* Calculator Content */}
        {calculators.map((calc) => {
          if (calc.id !== activeTab) return null
          const Component = calc.component
          return (
            <div key={calc.id}>
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${calc.color}`}>
                      <calc.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {calc.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {calc.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isClient ? <Component /> : (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
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