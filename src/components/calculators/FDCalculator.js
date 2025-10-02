'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [tenure, setTenure] = useState(5)
  const [compoundingFreq, setCompoundingFreq] = useState('quarterly')
  const [bankType, setBankType] = useState('sbi')
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])
  const [isClient, setIsClient] = useState(false)

  const bankRates = {
    sbi: { name: 'State Bank of India', rate: 6.5 },
    hdfc: { name: 'HDFC Bank', rate: 7.0 },
    icici: { name: 'ICICI Bank', rate: 6.8 },
    axis: { name: 'Axis Bank', rate: 6.9 },
    pnb: { name: 'Punjab National Bank', rate: 6.3 },
    postoffice: { name: 'Post Office', rate: 6.7 }
  }

  const compoundingOptions = {
    annually: { name: 'Annually', freq: 1 },
    quarterly: { name: 'Quarterly', freq: 4 },
    monthly: { name: 'Monthly', freq: 12 }
  }

  const calculateFD = () => {
    const rate = interestRate / 100
    const freq = compoundingOptions[compoundingFreq].freq
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + rate/freq, freq * tenure)
    const totalInterest = maturityAmount - principal
    
    // Calculate tax on interest (assuming 30% tax bracket for interest > 10,000)
    const taxableInterest = Math.max(0, totalInterest - 10000)
    const tds = taxableInterest * 0.1 // 10% TDS
    const taxOnInterest = taxableInterest * 0.3 // 30% tax
    const postTaxReturns = totalInterest - taxOnInterest
    const postTaxMaturity = principal + postTaxReturns
    
    // Generate yearly data
    const yearly = []
    for (let year = 1; year <= tenure; year++) {
      const amount = principal * Math.pow(1 + rate/freq, freq * year)
      const interest = amount - principal
      
      yearly.push({
        year,
        amount: Math.round(amount),
        interest: Math.round(interest),
        principal: principal
      })
    }
    
    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalInterest: Math.round(totalInterest),
      tds: Math.round(tds),
      taxOnInterest: Math.round(taxOnInterest),
      postTaxReturns: Math.round(postTaxReturns),
      postTaxMaturity: Math.round(postTaxMaturity),
      effectiveRate: ((postTaxMaturity / principal) ** (1/tenure) - 1) * 100
    })
    setChartData(yearly)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      calculateFD()
    }
  }, [principal, interestRate, tenure, compoundingFreq, isClient])

  useEffect(() => {
    if (isClient) {
      setInterestRate(bankRates[bankType].rate)
    }
  }, [bankType, isClient])

  const pieData = results ? [
    { name: 'Principal', value: principal, color: '#3B82F6' },
    { name: 'Interest Earned', value: results.totalInterest, color: '#10B981' },
    { name: 'Tax on Interest', value: results.taxOnInterest, color: '#EF4444' }
  ] : []

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fixed Deposit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bank">Bank/Institution</Label>
              <Select value={bankType} onValueChange={setBankType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bankRates).map(([key, bank]) => (
                    <SelectItem key={key} value={key}>
                      {bank.name} ({bank.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="principal">Principal Amount (₹)</Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rate">Interest Rate (% per annum)</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tenure">Tenure (Years)</Label>
              <Input
                id="tenure"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="compounding">Compounding Frequency</Label>
              <Select value={compoundingFreq} onValueChange={setCompoundingFreq}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(compoundingOptions).map(([key, option]) => (
                    <SelectItem key={key} value={key}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={calculateFD} className="w-full">
              Calculate FD Returns
            </Button>
          </CardContent>
        </Card>

        {isClient && results && (
          <Card>
            <CardHeader>
              <CardTitle>FD Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Principal Amount:</span>
                  <span className="font-bold text-blue-600">₹{principal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Interest Earned:</span>
                  <span className="font-bold text-green-600">₹{results.totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Maturity Amount:</span>
                  <span className="font-bold text-purple-600 text-xl">₹{results.maturityAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">TDS (10%):</span>
                  <span className="font-bold text-yellow-600">₹{results.tds.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Tax on Interest:</span>
                  <span className="font-bold text-red-600">₹{results.taxOnInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">Post-Tax Maturity:</span>
                  <span className="font-bold text-indigo-600">₹{results.postTaxMaturity.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Effective Rate:</span>
                  <span className="font-bold text-gray-600">{results.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isClient && chartData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>FD Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Line type="monotone" dataKey="principal" stroke="#3B82F6" name="Principal" />
                  <Line type="monotone" dataKey="amount" stroke="#10B981" name="FD Value" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amount Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}