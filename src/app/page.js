import FinancialCalculators from '@/components/FinancialCalculatorsNew'
import ClientOnly from '@/components/ui/client-only'

export default function Home() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            EasyCal
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Loading your financial calculators...</p>
        </div>
      </div>
    }>
      <FinancialCalculators />
    </ClientOnly>
  )
}