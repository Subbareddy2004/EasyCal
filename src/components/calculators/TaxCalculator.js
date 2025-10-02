'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function TaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState(1200000)
  const [taxRegime, setTaxRegime] = useState('new')
  const [deductions80C, setDeductions80C] = useState(150000)
  const [hra, setHra] = useState(0)
  const [homeLoanInterest, setHomeLoanInterest] = useState(0)
  const [results, setResults] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // Tax slabs for FY 2024-25
  const oldRegimeSlabs = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 5 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 }
  ]

  const newRegimeSlabs = [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 600000, rate: 5 },
    { min: 600000, max: 900000, rate: 10 },
    { min: 900000, max: 1200000, rate: 15 },
    { min: 1200000, max: 1500000, rate: 20 },
    { min: 1500000, max: Infinity, rate: 30 }
  ]

  const calculateTax = () => {
    const slabs = taxRegime === 'new' ? newRegimeSlabs : oldRegimeSlabs
    let taxableIncome = annualIncome
    let totalDeductions = 0

    // Apply deductions only for old regime
    if (taxRegime === 'old') {
      totalDeductions = Math.min(deductions80C, 150000) + hra + Math.min(homeLoanInterest, 200000)
      taxableIncome = Math.max(0, annualIncome - totalDeductions)
    }

    // Calculate tax
    let tax = 0
    const taxBreakdown = []

    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min
        const taxInThisSlab = (taxableInThisSlab * slab.rate) / 100
        tax += taxInThisSlab

        if (taxableInThisSlab > 0) {
          taxBreakdown.push({
            range: slab.max === Infinity ? `₹${slab.min.toLocaleString('en-IN')}+` : 
                   `₹${slab.min.toLocaleString('en-IN')} - ₹${slab.max.toLocaleString('en-IN')}`,
            rate: slab.rate,
            taxableAmount: taxableInThisSlab,
            tax: taxInThisSlab
          })
        }
      }
    }

    // Add cess (4% on tax)
    const cess = tax * 0.04
    const totalTax = tax + cess

    // Calculate monthly and effective tax rate
    const monthlyTax = totalTax / 12
    const effectiveRate = (totalTax / annualIncome) * 100
    const takeHome = annualIncome - totalTax

    setResults({
      taxableIncome: Math.round(taxableIncome),
      totalDeductions: Math.round(totalDeductions),
      incomeTax: Math.round(tax),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
      monthlyTax: Math.round(monthlyTax),
      effectiveRate: effectiveRate.toFixed(2),
      takeHome: Math.round(takeHome),
      taxBreakdown
    })
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      calculateTax()
    }
  }, [annualIncome, taxRegime, deductions80C, hra, homeLoanInterest, isClient])

  const pieData = results ? [
    { name: 'Take Home', value: results.takeHome, color: '#10B981' },
    { name: 'Income Tax', value: results.incomeTax, color: '#EF4444' },
    { name: 'Cess', value: results.cess, color: '#F59E0B' }
  ] : []

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income & Tax Details</CardTitle>
            <div className="flex gap-2">
              <Badge variant={taxRegime === 'new' ? 'default' : 'secondary'}>
                {taxRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">Annual Income (₹)</Label>
              <Input
                id="income"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="regime">Tax Regime</Label>
              <Select value={taxRegime} onValueChange={setTaxRegime}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Tax Regime (No Deductions)</SelectItem>
                  <SelectItem value="old">Old Tax Regime (With Deductions)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {taxRegime === 'old' && (
              <>
                <div>
                  <Label htmlFor="deductions">80C Deductions (₹)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={deductions80C}
                    onChange={(e) => setDeductions80C(Number(e.target.value))}
                    className="mt-1"
                    max={150000}
                  />
                  <p className="text-sm text-gray-500 mt-1">Max: ₹1,50,000</p>
                </div>
                <div>
                  <Label htmlFor="hra">HRA Exemption (₹)</Label>
                  <Input
                    id="hra"
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="homeLoan">Home Loan Interest (₹)</Label>
                  <Input
                    id="homeLoan"
                    type="number"
                    value={homeLoanInterest}
                    onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Max: ₹2,00,000</p>
                </div>
              </>
            )}
            
            <Button onClick={calculateTax} className="w-full">
              Calculate Tax
            </Button>
          </CardContent>
        </Card>

        {isClient && results && (
          <Card>
            <CardHeader>
              <CardTitle>Tax Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Taxable Income:</span>
                  <span className="font-bold text-blue-600">₹{results.taxableIncome.toLocaleString('en-IN')}</span>
                </div>
                {taxRegime === 'old' && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total Deductions:</span>
                    <span className="font-bold text-green-600">₹{results.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Income Tax:</span>
                  <span className="font-bold text-red-600">₹{results.incomeTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Cess (4%):</span>
                  <span className="font-bold text-yellow-600">₹{results.cess.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Total Tax:</span>
                  <span className="font-bold text-purple-600 text-xl">₹{results.totalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">Monthly Tax:</span>
                  <span className="font-bold text-indigo-600">₹{results.monthlyTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Effective Tax Rate:</span>
                  <span className="font-bold text-gray-600">{results.effectiveRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                  <span className="font-medium">Take Home:</span>
                  <span className="font-bold text-green-700 text-xl">₹{results.takeHome.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isClient && results && results.taxBreakdown.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Slab Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.taxBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rate" tickFormatter={(value) => `${value}%`} />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Tax Amount']}
                    labelFormatter={(rate) => `Tax Rate: ${rate}%`}
                  />
                  <Bar dataKey="tax" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income Distribution</CardTitle>
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