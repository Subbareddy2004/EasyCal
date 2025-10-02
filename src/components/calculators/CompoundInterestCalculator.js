'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(10)
  const [time, setTime] = useState(10)
  const [compoundingFreq, setCompoundingFreq] = useState('annually')
  const [additionalInvestment, setAdditionalInvestment] = useState(0)
  const [investmentFreq, setInvestmentFreq] = useState('annually')
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])

  const compoundingOptions = {
    annually: { name: 'Annually', freq: 1 },
    semiannually: { name: 'Semi-Annually', freq: 2 },
    quarterly: { name: 'Quarterly', freq: 4 },
    monthly: { name: 'Monthly', freq: 12 },
    daily: { name: 'Daily', freq: 365 }
  }

  const calculateCompoundInterest = () => {
    const r = rate / 100
    const n = compoundingOptions[compoundingFreq].freq
    const t = time
    
    // Basic compound interest: A = P(1 + r/n)^(nt)
    const basicAmount = principal * Math.pow(1 + r/n, n * t)
    const basicInterest = basicAmount - principal
    
    // With additional investments
    let totalAmount = principal
    let totalInvested = principal
    const yearlyData = []
    
    for (let year = 1; year <= time; year++) {
      // Compound existing amount
      totalAmount = totalAmount * Math.pow(1 + r/n, n)
      
      // Add additional investment
      if (additionalInvestment > 0) {
        const additionalPerYear = investmentFreq === 'monthly' ? 
          additionalInvestment * 12 : additionalInvestment
        totalAmount += additionalPerYear
        totalInvested += additionalPerYear
      }
      
      yearlyData.push({
        year,
        amount: Math.round(totalAmount),
        invested: Math.round(totalInvested),
        interest: Math.round(totalAmount - totalInvested)
      })
    }
    
    const finalInterest = totalAmount - totalInvested
    const effectiveRate = ((totalAmount / totalInvested) ** (1/time) - 1) * 100
    
    // Calculate simple interest for comparison
    const simpleInterest = principal * r * t
    const simpleAmount = principal + simpleInterest
    
    setResults({
      basicAmount: Math.round(basicAmount),
      basicInterest: Math.round(basicInterest),
      totalAmount: Math.round(totalAmount),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(finalInterest),
      effectiveRate: effectiveRate.toFixed(2),
      simpleAmount: Math.round(simpleAmount),
      simpleInterest: Math.round(simpleInterest),
      compoundAdvantage: Math.round(basicInterest - simpleInterest)
    })
    setChartData(yearlyData)
  }

  useEffect(() => {
    calculateCompoundInterest()
  }, [principal, rate, time, compoundingFreq, additionalInvestment, investmentFreq])

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="principal">Initial Investment (₹)</Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="time">Time Period (Years)</Label>
              <Input
                id="time"
                type="number"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
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
            <div>
              <Label htmlFor="additional">Additional Investment (₹)</Label>
              <Input
                id="additional"
                type="number"
                value={additionalInvestment}
                onChange={(e) => setAdditionalInvestment(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="investFreq">Investment Frequency</Label>
              <Select value={investmentFreq} onValueChange={setInvestmentFreq}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={calculateCompoundInterest} className="w-full">
              Calculate Returns
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Compound Interest Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Total Invested:</span>
                  <span className="font-bold text-blue-600">₹{results.totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Total Interest:</span>
                  <span className="font-bold text-green-600">₹{results.totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Final Amount:</span>
                  <span className="font-bold text-purple-600 text-xl">₹{results.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">Effective Rate:</span>
                  <span className="font-bold text-indigo-600">{results.effectiveRate}% p.a.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Compound vs Simple Interest Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Compound Interest</p>
                <p className="font-bold text-green-600 text-lg">₹{results.basicInterest.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">Final: ₹{results.basicAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Simple Interest</p>
                <p className="font-bold text-red-600 text-lg">₹{results.simpleInterest.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">Final: ₹{results.simpleAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Compound Advantage</p>
                <p className="font-bold text-yellow-600 text-lg">₹{results.compoundAdvantage.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">Extra earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Investment Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <Tooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  name="Total Invested"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="interest" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  name="Interest Earned"
                  fillOpacity={0.8}
                />
                <Line type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2} name="Total Amount" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>The Power of Compounding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Key Benefits:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Exponential growth over time</li>
                <li>• Higher returns with longer investment periods</li>
                <li>• More frequent compounding = better returns</li>
                <li>• Regular investments amplify the effect</li>
                <li>• Time is your biggest advantage</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Einstein's Quote:</h4>
              <blockquote className="italic text-gray-600 border-l-4 border-blue-200 pl-4">
                "Compound interest is the eighth wonder of the world. 
                He who understands it, earns it; he who doesn't, pays it."
              </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}