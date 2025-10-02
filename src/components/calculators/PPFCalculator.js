'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function PPFCalculator() {
  const [annualInvestment, setAnnualInvestment] = useState(150000)
  const [currentAge, setCurrentAge] = useState(30)
  const [results, setResults] = useState(null)
  const [yearlyData, setYearlyData] = useState([])
  const [isClient, setIsClient] = useState(false)

  const PPF_RATE = 7.1 // Current PPF rate
  const PPF_TENURE = 15 // PPF lock-in period
  const MAX_INVESTMENT = 150000 // Maximum annual investment

  const calculatePPF = () => {
    const investment = Math.min(annualInvestment, MAX_INVESTMENT)
    let balance = 0
    const yearly = []
    
    // Calculate for 15 years
    for (let year = 1; year <= PPF_TENURE; year++) {
      const interest = balance * (PPF_RATE / 100)
      balance = balance + investment + interest
      
      yearly.push({
        year,
        investment: investment,
        interest: Math.round(interest),
        balance: Math.round(balance),
        totalInvested: investment * year
      })
    }
    
    const totalInvestment = investment * PPF_TENURE
    const totalInterest = balance - totalInvestment
    const maturityAge = currentAge + PPF_TENURE
    
    // Calculate extension scenarios (5-year blocks)
    const extensionScenarios = []
    let extendedBalance = balance
    
    for (let extension = 1; extension <= 3; extension++) {
      const extensionYears = extension * 5
      let tempBalance = balance
      
      for (let year = 1; year <= extensionYears; year++) {
        const yearlyInterest = tempBalance * (PPF_RATE / 100)
        tempBalance = tempBalance + yearlyInterest
      }
      
      extensionScenarios.push({
        years: extensionYears,
        age: maturityAge + extensionYears,
        amount: Math.round(tempBalance)
      })
    }
    
    setResults({
      maturityAmount: Math.round(balance),
      totalInvestment,
      totalInterest: Math.round(totalInterest),
      maturityAge,
      extensionScenarios,
      taxSaved: Math.round(investment * 0.3) // Assuming 30% tax bracket
    })
    setYearlyData(yearly)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      calculatePPF()
    }
  }, [annualInvestment, currentAge, isClient])

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>PPF Details</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Rate: {PPF_RATE}%</Badge>
              <Badge variant="secondary">Tenure: {PPF_TENURE} years</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="investment">Annual Investment (₹)</Label>
              <Input
                id="investment"
                type="number"
                value={annualInvestment}
                onChange={(e) => setAnnualInvestment(Number(e.target.value))}
                className="mt-1"
                max={MAX_INVESTMENT}
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum: ₹{MAX_INVESTMENT.toLocaleString('en-IN')} per year
              </p>
            </div>
            <div>
              <Label htmlFor="age">Current Age</Label>
              <Input
                id="age"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <Button onClick={calculatePPF} className="w-full">
              Calculate PPF
            </Button>
          </CardContent>
        </Card>

        {isClient && results && (
          <Card>
            <CardHeader>
              <CardTitle>PPF Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Total Investment:</span>
                  <span className="font-bold text-blue-600">₹{results.totalInvestment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Total Interest:</span>
                  <span className="font-bold text-green-600">₹{results.totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Maturity Amount:</span>
                  <span className="font-bold text-purple-600 text-xl">₹{results.maturityAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Tax Saved (Annual):</span>
                  <span className="font-bold text-yellow-600">₹{results.taxSaved.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">Maturity Age:</span>
                  <span className="font-bold text-indigo-600">{results.maturityAge} years</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isClient && results && (
        <Card>
          <CardHeader>
            <CardTitle>Extension Scenarios (Without Additional Investment)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {results.extensionScenarios.map((scenario, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">+{scenario.years} Years Extension</h4>
                  <p className="text-sm text-gray-600">Age: {scenario.age} years</p>
                  <p className="font-bold text-lg text-green-600">
                    ₹{scenario.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isClient && yearlyData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>PPF Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                  <Tooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Line type="monotone" dataKey="totalInvested" stroke="#3B82F6" name="Total Invested" />
                  <Line type="monotone" dataKey="balance" stroke="#10B981" name="PPF Balance" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Annual Interest Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Interest Earned']}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Bar dataKey="interest" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}