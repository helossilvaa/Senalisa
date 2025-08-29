"use client";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

export default function CategoriasChamados({ data = [] }) {
  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#A020F0"];

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="total"
        nameKey="categoria"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}