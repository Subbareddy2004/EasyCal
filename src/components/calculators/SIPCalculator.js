'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, IndianRupee, Calendar, Target } from 'lucide-react'

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [timePeriod, setTimePeriod] = useState(10)
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])
  const [isClient, setIsClient] = useState(false)

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12
    const months = timePeriod * 12
    
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
    
    const totalInvestment = monthlyInvestment * months
    const totalReturns = futureValue - totalInvestment
    
    const yearlyData = []
    for (let year = 1; year <= timePeriod; year++) {
      const monthsElapsed = year * 12
      const valueAtYear = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate))
      const investedAtYear = monthlyInvestment * monthsElapsed
      
      yearlyData.push({
        year,
        invested: investedAtYear,
        value: valueAtYear,
        returns: valueAtYear - investedAtYear
      })
    }
    
    setResults({
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns)
    })
    setChartData(yearlyData)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      calculateSIP()
    }
  }, [monthlyInvestment, expectedReturn, timePeriod, isClient])

  const pieData = results ? [
    { name: 'Investment', value: results.totalInvestment, color: '#3B82F6' },
    { name: 'Returns', value: results.totalReturns, color: '#10B981' }
  ] : []

  return (
    <div className="space-y-8">
      {/* Input & Results Grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                SIP Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <IndianRupee className="h-4 w-4 text-gray-500" />
                  Monthly Investment
                </Label>
                <Input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="text-lg h-12"
                  placeholder="5,000"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-gray-500" />
                  Expected Return (% p.a.)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="text-lg h-12"
                  placeholder="12.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Time Period (Years)
                </Label>
                <Input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="text-lg h-12"
                  placeholder="10"
                />
              </div>
              
              <Button 
                onClick={calculateSIP} 
                className="w-full h-12 text-base font-medium"
              >
                Calculate SIP Returns
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
          {isClient && results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-fit">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Total Investment
                    </span>
                    <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    ₹{results.totalInvestment.toLocaleString('en-IN')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Total Returns
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    ₹{results.totalReturns.toLocaleString('en-IN')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Maturity Value
                    </span>
                    <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    ₹{results.futureValue.toLocaleString('en-IN')}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      {isClient && chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    labelFormatter={(year) => `Year ${year}`}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Invested Amount"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Portfolio Value"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}