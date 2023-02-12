import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./Charts.scss";
const { tooltipMessage } = require("./chartsHelpers/chartsHelpers");

const RentGrowthRateVsMarket = (props) => {
  const data = [];
  const prices = props.prices;
  const properties = props.properties;
  const currentPropertyPrices = props.currentPropertyPrices;
  const averageIncreasePerYear = {
    2015: [],
    2016: [],
    2017: [],
    2018: [],
    2019: [],
    2020: [],
    2021: [],
    2022: [],
    2023: [],
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label tooltip-text">{`Year: ${label}`}</p>
          <p className="tooltip-text">{`${tooltipMessage(
            payload[0].value
          )}.`}</p>
        </div>
      );
    }
    return null;
  };

  const addPricesToData = () => {
    for (let price of currentPropertyPrices) {
      if (price.admin_status === "approved") {
        data.push({
          date: parseInt(price.date.substring(0, 4)),
          price: parseInt(price.price),
        });
      }
    }
    getRentIncreaseAverages(prices, properties, data);
  };

  const getRentIncreaseAverages = (prices, properties, data) => {
    const priceObject = {};
    const allIncreasesPerYear = {
      2014: [],
      2015: [],
      2016: [],
      2017: [],
      2018: [],
      2019: [],
      2020: [],
      2021: [],
      2022: [],
      2023: [],
    };

    // Add an array to the priceObject, for each property. The key is that property's ID
    for (const property of properties) {
      priceObject[property.id] = [];
    }

    // Push the price data for each property into the correct array
    for (const price of prices) {
      priceObject[price.property_id].push(price);
    }

    // Loop through each property to get an integer for querying the priceObject object
    for (let i = 1; i < properties.length + 1; i++) {
      // Another loop for getting the index of the array inside of each priceObject index (priceObject is an object full of arrays)
      for (let j = 1; j < priceObject[i].length; j++) {
        // Compare the current year's price with last year's price, and push the difference as a percentage to the increasePerYear object
        allIncreasesPerYear[priceObject[i][j].date.substring(0, 4)].push(
          Math.round(
            ((parseInt(priceObject[i][j].price) -
              parseInt(priceObject[i][j - 1].price)) /
              parseInt(priceObject[i][j - 1].price)) *
              100 *
              10
          ) / 10
        );
      }
    }

    // now we have an allIncreasesPerYear object, that contains an array with the percentage increase for each property, for each year
    // Loop through that data to get the average increase per year, and push that to our data array
    for (let i = 2015; i <= 2023; i++) {
      let sum = 0;
      for (const indexValue of allIncreasesPerYear[i]) {
        sum += indexValue;
      }
      averageIncreasePerYear[i] =
        Math.round((sum / allIncreasesPerYear[i].length) * 100) / 100;
    }
    showPricesBasedOnAverages();
  };

  // Multiplies the initial property price by the average rent increase percentage, to compare
  // what it would be like if this property followed the market trend exactly
  const showPricesBasedOnAverages = () => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].date === 2014) {
        data[i].compare_at_price = data[i].price;
      }
      if (data[i].date === 2015 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2015] / 100)
        );
      }
      if (data[i].date === 2016 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2016] / 100)
        );
      }
      if (data[i].date === 2017 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2017] / 100)
        );
      }
      if (data[i].date === 2018 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2018] / 100)
        );
      }
      if (data[i].date === 2019 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2019] / 100)
        );
      }
      if (data[i].date === 2020 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2020] / 100)
        );
      }
      if (data[i].date === 2021 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2021] / 100)
        );
      }
      if (data[i].date === 2022 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2022] / 100)
        );
      }
      if (data[i].date === 2023 && data[i - 1] !== undefined) {
        data[i].compare_at_price = Math.round(
          data[i - 1].compare_at_price +
            data[i - 1].compare_at_price * (averageIncreasePerYear[2023] / 100)
        );
      }
    }
    percentIncreaseVsMarketAverage();
  };

  // convert the price difference into a percentage, comparing how much higher or lower the current
  // property's price is vs market trends. Above 0 is above market value, below 0 is below market
  // value. So below 0 means you're getting a better deal

  const percentIncreaseVsMarketAverage = () => {
    for (const d of data) {
      d.price_difference_percentage =
        Math.round((d.price / d.compare_at_price - 1) * 100 * 10) / 10;
    }
  };

  // Call function to populate the data
  addPricesToData();

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.price_difference_percentage));
    const dataMin = Math.min(...data.map((i) => i.price_difference_percentage));

    if (dataMax <= 0) {
      return 0;
    } else if (dataMin >= 0) {
      return 1;
    } else {
      return dataMax / (dataMax - dataMin);
    }
  };

  const off = gradientOffset();

  return (
    <div>
      <div className="chart-title">
        Cumulative rent difference difference vs market:
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="#EA7979" stopOpacity={0.75} />
              <stop offset={off} stopColor="#A7DBB5" stopOpacity={0.75} />
            </linearGradient>
          </defs>

          <Area
            dataKey="price_difference_percentage"
            stroke="black"
            fill="url(#splitColor)"
            radius={[0, 5, 5, 0]}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.75} />
          <XAxis dataKey="date" />
          <YAxis
            dataKey="price_difference_percentage"
            domain={[-15, 15]}
            tickFormatter={(percent) => `${percent}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ outline: "none" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RentGrowthRateVsMarket;
