"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"

const data = [
  { day: "DAY 1", value: 1420, label: "1,420", active: false },
  { day: "DAY 2 (TODAY)", value: 1743, label: "1,743", active: true },
  { day: "DAY 3", value: 0, label: "--", active: false },
]

export function CheckInsChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => {
              const item = data.find((d) => d.day === payload.value)
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill={item?.active ? "#16A34A" : "#6B7280"}
                    fontSize={12}
                    fontWeight={item?.active ? 600 : 400}
                  >
                    {payload.value}
                  </text>
                  <text
                    x={0}
                    y={0}
                    dy={34}
                    textAnchor="middle"
                    fill={item?.active ? "#16A34A" : "#111827"}
                    fontSize={14}
                    fontWeight={600}
                  >
                    {item?.label}
                  </text>
                </g>
              )
            }}
            height={60}
          />
          <YAxis hide />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            maxBarSize={80}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.active ? "#16A34A" : entry.value > 0 ? "#E5E7EB" : "#F3F4F6"}
                stroke={entry.active ? "#16A34A" : entry.value > 0 ? "#D1D5DB" : "#E5E7EB"}
                strokeWidth={entry.active ? 0 : 1}
                strokeDasharray={entry.value === 0 ? "4 4" : "0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
