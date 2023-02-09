import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./PropertyRentChart.scss";

const PropertyRentChart = (props) => {
  const data = [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label tooltip-text">{`${label}`}</p>
          <p className="tooltip-text">{`price: $${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  for (let price of props.prices) {
    if (price.admin_status === "approved") {
      data.push({
        date: price.date.substring(0, 4),
        price: price.price,
      });
    }
  }

  return (
    <div>
      <div className="chart-title">Price History:</div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#008631" stopOpacity={0.65} />
              <stop offset="75%" stopColor="#008631" stopOpacity={0.15} />
            </linearGradient>
          </defs>

          <Area dataKey="price" stroke="#008631" fill="url(#color)" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            ticks={["2014", "2016", "2018", "2020", "2022", "2024"]}
          />
          <YAxis
            dataKey="price"
            domain={[
              parseInt(data[0].price) - 500,
              parseInt(data[data.length - 1].price) + 200,
            ]}
            tickCount={6}
            tickFormatter={(price) => `$${price}`}
          />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ outline: "none" }}
          />
        </AreaChart>
        {/* <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis
            dataKey="price"
            domain={[
              parseInt(data[0].price) - 500,
              parseInt(data[data.length - 1].price) + 500,
            ]}
          />
          <Tooltip />
        </LineChart> */}
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyRentChart;
