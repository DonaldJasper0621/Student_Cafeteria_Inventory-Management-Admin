import React from "react";
import { prisma } from "../../../lib/prisma";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const Dish = ({ top3, records }) => {
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Order Distribution",
        color: "#a5adba",
        font: {
          size: 20,
        },
      },
      labels: {
        color: "#a5adba",
      },
    },
    scales: {
      y: {
        // not 'yAxes: [{' anymore (not an array anymore)
        ticks: {
          color: "#a5adba", // not 'fontColor:' anymore
          beginAtZero: true,
        },
      },
      x: {
        // not 'xAxes: [{' anymore (not an array anymore)
        ticks: {
          color: "#a5adba", // not 'fontColor:' anymore

          beginAtZero: true,
        },
      },
    },
  };

  const labels = records.map((record) => record.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: records.map((record) => parseInt(record.num_orders)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <>
      <div className="mt-16 grid w-full grid-cols-2 gap-3 p-4 lg:mt-0 lg:grid-cols-3 lg:py-20">
        <h2 className="col-span-2 text-5xl font-bold lg:col-span-3">
          Top Sellers
        </h2>
        <div className="stats bg-primary text-white shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">1st</div>
            <div className="stat-value">{top3[0].name}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats bg-primary text-white shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">2nd</div>
            <div className="stat-value"> {top3[1].name}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats bg-primary text-white shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">3rd</div>
            <div className="stat-value">{top3[2].name}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-center">
          <div className="h-[50vh] w-[80vw] md:w-[70vw]">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dish;

export async function getServerSideProps() {
  // get top3 selling dishes
  const records =
    await prisma.$queryRaw`SELECT d.name, CAST(COUNT(*) as CHAR) as num_orders FROM railway.Order o JOIN railway.Dish d ON o.Dish_id = d.id GROUP BY o.Dish_id ORDER BY num_orders DESC;`;

  // change num_orders to int
  records.forEach((record) => {
    record.num_orders = parseInt(record.num_orders);
  });
  // order the records by num_orders
  records.sort((a, b) => b.num_orders - a.num_orders);
  // get top 3
  const top3 = records.slice(0, 3);
  return {
    props: {
      top3,
      records,
    },
  };
}
