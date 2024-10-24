import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface IHistoricalData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface CharProps {
  coinId: string;
}

function Chart() {
  const { coinId } = useOutletContext<CharProps>();
  const { isLoading, data } = useQuery<IHistoricalData[]>({
    queryKey: ["ohlcv", coinId],
    queryFn: () => fetchCoinHistory(coinId),
    refetchInterval: 10000,
  });
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price) => parseFloat(price.close)) ?? [],
            },
          ]}
          options={{
            theme: { mode: "dark" },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: { show: false },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: { show: false },
            xaxis: {
              labels: { show: false },
              type: "datetime",
              axisTicks: { show: false },
              axisBorder: { show: false },
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toUTCString()
              ),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            // tooltip: { y: { formatter: (value) => `${value.toFixed(2)}` } },
          }}
        />
      )}
    </div>
  );
}
export default Chart;
