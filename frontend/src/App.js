import React, { useState, useEffect } from "react";
import "./App.css";
import data from "./data.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {
  const [range, setRange] = useState("7d");
  const [filteredData, setFilteredData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    filterData(range);
  }, [range]);

  function filterData(selectedRange) {
    const now = new Date(data[data.length - 1].Date);

    let days = 7;
    if (selectedRange === "1d") days = 1;
    if (selectedRange === "30d") days = 30;

    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);

    const result = data
      .filter((item) => new Date(item.Date) >= cutoff)
      .sort((a, b) => new Date(a.Date) - new Date(b.Date)); // 🔥 FIX

    setFilteredData(result);
  }

  function getStats() {
    if (filteredData.length === 0) return { max: 0, min: 0, avg: 0 };

    const values = filteredData.map((d) => d.GHI);

    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg =
      values.reduce((sum, val) => sum + val, 0) / values.length;

    return { max, min, avg: avg.toFixed(2) };
  }

  const stats = getStats();

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <h1>GHI Dashboard</h1>

      <div className="controls">
        <button 
        className={range === "1d" ? "active" : ""} 
        onClick={() => setRange("1d")}>
          1D 
          </button>
          <button 
          className={range === "7d" ? "active" : ""} 
          onClick={() => setRange("7d")}>
            7D
        </button>
        <button 
        className={range === "30d" ? "active" : ""} 
        onClick={() => setRange("30d")}> 30D
        </button>

        <button onClick={() => setDarkMode(!darkMode)}>
          Toggle Theme
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <XAxis
            dataKey="Date"
            tickFormatter={(date) => date.slice(5)}
            minTickGap={30}
          />
          <YAxis />
          <Tooltip 
           formatter={(value)=>value.toFixed(2)}
          />
          <Line 
            type="monotone" 
            dataKey="GHI" 
            stroke="#8884d8"
            dot={false}
         />
        </LineChart>
      </ResponsiveContainer>

      <div className="stats">
        <p>Max: {stats.max}</p>
        <p>Min: {stats.min}</p>
        <p>Avg: {stats.avg}</p>
      </div>
    </div>
  );
}

export default App;
