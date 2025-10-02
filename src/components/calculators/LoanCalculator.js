'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function LoanCalculator() {
  const [loans, setLoans] = useState([
    { id: 1, name: 'Home Loan', amount: 2500000, rate: 8.5, tenure: 20 },
    { id: 2, name: 'Car Loan', amount: 800000, rate: 9.5, tenure: 7 },
    { id: 3, name: 'Personal Loan', amount: 300000, rate: 12.0, tenure: 5 }
  ])
  const [newLoan, setNewLoan] = useState({ name: '', amount: '', rate: '', tenure: '' })
  const [results, setResults] = useState([])

  const calculateLoanEMI = (amount, rate, tenure) => {
    const monthlyRate = rate / 100 / 12
    const months = tenure * 12
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1)
    const totalAmount = emi * months
    const totalInterest = totalAmount - amount
    
    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest)
    }
  }

  const calculateAllLoans = () => {
    const loanResults = loans.map(loan => {
      const calculation = calculateLoanEMI(loan.amount, loan.rate, loan.tenure)
      return {
        ...loan,
        ...calculation
      }
    })
    setResults(loanResults)
  }

  const addLoan = () => {
    if (newLoan.name && newLoan.amount && newLoan.rate && newLoan.tenure) {
      const loan = {
        id: Date.now(),
        name: newLoan.name,
        amount: Number(newLoan.amount),
        rate: Number(newLoan.rate),
        tenure: Number(newLoan.tenure)
      }
      setLoans([...loans, loan])
      setNewLoan({ name: '', amount: '', rate: '', tenure: '' })
    }
  }

  const removeLoan = (id) => {
    setLoans(loans.filter(loan => loan.id !== id))
  }

  useEffect(() => {
    calculateAllLoans()
  }, [loans])

  const totalEMI = results.reduce((sum, loan) => sum + loan.emi, 0)
  const totalInterest = results.reduce((sum, loan) => sum + loan.totalInterest, 0)
  const totalAmount = results.reduce((sum, loan) => sum + loan.totalAmount, 0)

  const chartData = results.map(loan => ({
    name: loan.name,
    EMI: loan.emi,
    Interest: loan.totalInterest,
    Principal: loan.amount
  }))

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compare">Compare Loans</TabsTrigger>
          <TabsTrigger value="add">Add New Loan</TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="space-y-6">
          <div className="grid gap-4">
            {results.map((loan) => (
              <Card key={loan.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{loan.name}</CardTitle>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeLoan(loan.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="font-bold text-blue-600">₹{loan.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="font-bold text-green-600">₹{loan.emi.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Interest</p>
                      <p className="font-bold text-red-600">₹{loan.totalInterest.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-purple-600">₹{loan.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-semibold">{loan.rate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tenure:</span>
                      <span className="font-semibold">{loan.tenure} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Total Loan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Monthly EMI</p>
                    <p className="font-bold text-green-600 text-xl">₹{totalEMI.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="font-bold text-red-600 text-xl">₹{totalInterest.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-purple-600 text-xl">₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                    <Tooltip 
                      formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    />
                    <Bar dataKey="EMI" fill="#10B981" name="Monthly EMI" />
                    <Bar dataKey="Interest" fill="#EF4444" name="Total Interest" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Loan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loanName">Loan Name</Label>
                <Input
                  id="loanName"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({...newLoan, name: e.target.value})}
                  placeholder="e.g., Home Loan, Car Loan"
                  className="mt-1"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={newLoan.amount}
                    onChange={(e) => setNewLoan({...newLoan, amount: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="loanRate">Interest Rate (%)</Label>
                  <Input
                    id="loanRate"
                    type="number"
                    step="0.1"
                    value={newLoan.rate}
                    onChange={(e) => setNewLoan({...newLoan, rate: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="loanTenure">Tenure (Years)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    value={newLoan.tenure}
                    onChange={(e) => setNewLoan({...newLoan, tenure: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={addLoan} className="w-full">
                Add Loan to Comparison
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Comparison Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Consider These Factors:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Processing fees and charges</li>
                    <li>• Prepayment penalties</li>
                    <li>• Loan-to-value ratio</li>
                    <li>• Credit score requirements</li>
                    <li>• Flexible EMI options</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">Money-Saving Tips:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Make prepayments when possible</li>
                    <li>• Choose shorter tenure if affordable</li>
                    <li>• Compare rates across lenders</li>
                    <li>• Maintain good credit score</li>
                    <li>• Consider balance transfer options</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}