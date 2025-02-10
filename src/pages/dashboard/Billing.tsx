import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetCallAnalytics } from "@/query/billing.queries"
import { PhoneIcon, ClockIcon, DollarSignIcon, SmileIcon } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import Spinner from "@/components/Spinner"

const Billing = () => {
  const { data: analyticsResponse, isLoading, error } = useGetCallAnalytics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">Error loading analytics data</div>
    )
  }

  if (!analyticsResponse?.data) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">No data available</div>
  }

  const data = {
    totalCalls: analyticsResponse.data.totalCalls || 0,
    totalMinutes: analyticsResponse.data.totalMinutes || 0,
    totalSecondsUsed: analyticsResponse.data.totalSecondsUsed || 0,
    averageCallDuration: analyticsResponse.data.averageCallDuration || 0,
    averageCostPerCall: analyticsResponse.data.averageCostPerCall || 0,
    totalCost: analyticsResponse.data.totalCost || 0,
    sentimentAnalysis: {
      positive: analyticsResponse.data.sentimentAnalysis.positive || 0,
      neutral: analyticsResponse.data.sentimentAnalysis.neutral || 0,
      negative: analyticsResponse.data.sentimentAnalysis.negative || 0,
    },
  }

  const sentimentData = [
    { name: "Positive", value: data.sentimentAnalysis.positive, color: "#8B5CF6" },
    { name: "Neutral", value: data.sentimentAnalysis.neutral, color: "#6D28D9" },
    { name: "Negative", value: data.sentimentAnalysis.negative, color: "#4C1D95" },
  ].filter((item) => item.value > 0)

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize="12">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-purple-900 border border-purple-800 p-2 rounded-lg shadow-lg">
          <p className="text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  const barData = [
    { name: "Total Calls", value: data.totalCalls },
    { name: "Total Minutes", value: Number(data.totalMinutes.toFixed(2)) },
    { name: "Avg Duration (s)", value: Number(data.averageCallDuration.toFixed(2)) },
  ]

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-white">Billing & Usage</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-purple-900/30 border-purple-800 transition-all duration-300 hover:bg-purple-800/50 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Calls</CardTitle>
            <PhoneIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalCalls}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/30 border-purple-800 transition-all duration-300 hover:bg-purple-800/50 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Minutes</CardTitle>
            <ClockIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalMinutes.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/30 border-purple-800 transition-all duration-300 hover:bg-purple-800/50 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg. Cost per Call</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${data.averageCostPerCall.toFixed(3)}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/30 border-purple-800 transition-all duration-300 hover:bg-purple-800/50 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg. Duration</CardTitle>
            <SmileIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.floor(data.averageCallDuration / 60)}m {Math.round(data.averageCallDuration % 60)}s
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-purple-900/30 border-purple-800">
          <CardHeader>
            <CardTitle className="text-white">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/30 border-purple-800">
          <CardHeader>
            <CardTitle className="text-white">Usage Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#ffffff" tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff" tickLine={false} axisLine={false} tickCount={5} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6D28D9" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Billing

