'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [currentExpenses, setCurrentExpenses] = useState(50000)
  const [inflationRate, setInflationRate] = useState(6)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge
    const retirementYears = 25 // Assuming 25 years post retirement
    
    // Calculate future monthly expenses at retirement
    const futureMonthlyExpenses = currentExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement)
    
    // Calculate required corpus at retirement (considering inflation during retirement)
    const requiredCorpus = futureMonthlyExpenses * 12 * 
      ((Math.pow(1 + inflationRate/100, retirementYears) - 1) / (inflationRate/100))
    
    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn/100, yearsToRetirement)
    
    // Calculate additional corpus needed
    const additionalCorpusNeeded = Math.max(0, requiredCorpus - futureValueCurrentSavings)
    
    // Calculate required monthly SIP
    const monthlyRate = expectedReturn / 100 / 12
    const months = yearsToRetirement * 12
    const requiredMonthlySIP = additionalCorpusNeeded * monthlyRate / 
      (Math.pow(1 + monthlyRate, months) - 1)
    
    // Generate year-wise projection
    const projection = []
    let currentCorpus = currentSavings
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      const annualSIP = requiredMonthlySIP * 12
      currentCorpus = (currentCorpus + annualSIP) * (1 + expectedReturn/100)
      const ageAtYear = currentAge + year
      const expensesAtYear = currentExpenses * Math.pow(1 + inflationRate/100, year)
      
      projection.push({
        year,
        age: ageAtYear,
        corpus: Math.round(currentCorpus),
        expenses: Math.round(expensesAtYear),
        sipInvested: Math.round(annualSIP * year)
      })
    }
    
    setResults({
      yearsToRetirement,
      futureMonthlyExpenses: Math.round(futureMonthlyExpenses),
      requiredCorpus: Math.round(requiredCorpus),
      futureValueCurrentSavings: Math.round(futureValueCurrentSavings),
      additionalCorpusNeeded: Math.round(additionalCorpusNeeded),
      requiredMonthlySIP: Math.round(requiredMonthlySIP),
      totalSIPInvestment: Math.round(requiredMonthlySIP * months),
      corpusMultiple: Math.round(requiredCorpus / (currentExpenses * 12))
    })
    setChartData(projection)
  }

  useEffect(() => {
    if (retirementAge > currentAge) {
      calculateRetirement()
    }
  }, [currentAge, retirementAge, currentExpenses, inflationRate, expectedReturn, currentSavings])

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retirement Planning Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expenses">Current Monthly Expenses (₹)</Label>
              <Input
                id="expenses"
                type="number"
                value={currentExpenses}
                onChange={(e) => setCurrentExpenses(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="savings">Current Savings (₹)</Label>
              <Input
                id="savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inflation">Inflation Rate (%)</Label>
                <Input
                  id="inflation"
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="return">Expected Return (%)</Label>
                <Input
                  id="return"
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={calculateRetirement} className="w-full">
              Calculate Retirement Plan
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Retirement Plan Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Years to Retirement:</span>
                  <span className="font-bold text-blue-600">{results.yearsToRetirement} years</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Future Monthly Expenses:</span>
                  <span className="font-bold text-yellow-600">₹{results.futureMonthlyExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Required Corpus:</span>
                  <span className="font-bold text-purple-600 text-xl">₹{results.requiredCorpus.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Current Savings Growth:</span>
                  <span className="font-bold text-green-600">₹{results.futureValueCurrentSavings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Additional Needed:</span>
                  <span className="font-bold text-red-600">₹{results.additionalCorpusNeeded.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">Required Monthly SIP:</span>
                  <span className="font-bold text-indigo-600 text-xl">₹{results.requiredMonthlySIP.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Corpus Multiple:</span>
                  <span className="font-bold text-gray-600">{results.corpusMultiple}x annual expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="grid md:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Corpus Growth Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis tickFormatter={(value) => `₹${(value/10000000).toFixed(1)}Cr`} />
                  <Tooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    labelFormatter={(age) => `Age: ${age} years`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sipInvested" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    name="SIP Invested"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="corpus" 
                    stackId="2" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    name="Total Corpus"
                    fillOpacity={0.8}
                  />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Annual Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Retirement Planning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Good Practices:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Start investing early to benefit from compounding</li>
                  <li>• Diversify across equity, debt, and real estate</li>
                  <li>• Consider inflation-protected instruments</li>
                  <li>• Review and adjust your plan annually</li>
                  <li>• Build an emergency fund separately</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Investment Options:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Equity Mutual Funds (SIP)</li>
                  <li>• PPF (15-year lock-in)</li>
                  <li>• EPF (Employee Provident Fund)</li>
                  <li>• NPS (National Pension System)</li>
                  <li>• Real Estate Investment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}