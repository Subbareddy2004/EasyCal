'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(2500000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [loanTenure, setLoanTenure] = useState(20)
  const [loanType, setLoanType] = useState('home')
  const [results, setResults] = useState(null)
  const [yearlyData, setYearlyData] = useState([])
  const [isClient, setIsClient] = useState(false)

  const loanTypes = {
    home: { name: 'Home Loan', rate: 8.5 },
    car: { name: 'Car Loan', rate: 9.5 },
    personal: { name: 'Personal Loan', rate: 12.0 },
    education: { name: 'Education Loan', rate: 10.0 }
  }

  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12
    const months = loanTenure * 12
    
    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1)
    
    const totalAmount = emi * months
    const totalInterest = totalAmount - loanAmount
    
    // Generate yearly breakdown
    let balance = loanAmount
    const yearly = []
    
    for (let year = 1; year <= loanTenure; year++) {
      let yearlyInterest = 0
      let yearlyPrincipal = 0
      
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = balance * monthlyRate
        const monthlyPrincipal = emi - monthlyInterest
        
        yearlyInterest += monthlyInterest
        yearlyPrincipal += monthlyPrincipal
        balance -= monthlyPrincipal
        
        if (balance <= 0) break
      }
      
      yearly.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(Math.max(0, balance))
      })
      
      if (balance <= 0) break
    }
    
    setResults({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest)
    })
    setYearlyData(yearly)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      calculateEMI()
    }
  }, [loanAmount, interestRate, loanTenure, isClient])

  useEffect(() => {
    if (isClient) {
      setInterestRate(loanTypes[loanType].rate)
    }
  }, [loanType, isClient])

  const pieData = results ? [
    { name: 'Principal Amount', value: loanAmount, color: '#3B82F6' },
    { name: 'Total Interest', value: results.totalInterest, color: '#EF4444' }
  ] : []

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loanType">Loan Type</Label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(loanTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.name} ({type.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Loan Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
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
              <Label htmlFor="tenure">Loan Tenure (Years)</Label>
              <Input
                id="tenure"
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <Button onClick={calculateEMI} className="w-full">
              Calculate EMI
            </Button>
          </CardContent>
        </Card>

        {isClient && results && (
          <Card>
            <CardHeader>
              <CardTitle>EMI Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Monthly EMI:</span>
                  <span className="font-bold text-blue-600 text-xl">₹{results.emi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Principal Amount:</span>
                  <span className="font-bold text-green-600">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Total Interest:</span>
                  <span className="font-bold text-red-600">₹{results.totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-purple-600">₹{results.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isClient && yearlyData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Principal vs Interest (Yearly)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                  <Tooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Bar dataKey="principal" stackId="a" fill="#3B82F6" name="Principal" />
                  <Bar dataKey="interest" stackId="a" fill="#EF4444" name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Breakdown</CardTitle>
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