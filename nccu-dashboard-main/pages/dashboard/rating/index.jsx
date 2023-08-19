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
const Rating = ({ ratingForEachDish, likesCount, dislikesCount }) => {
  const likes = ratingForEachDish.map((record) => parseInt(record.likes));
  const dislikes = ratingForEachDish.map((record) => parseInt(record.dislikes));
  const names = ratingForEachDish.map((record) => record.name);

  const options = {
    indexAxis: "x",
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
        position: "top",
        text: "Rating for each Dish",
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

  const data = {
    labels: names,
    datasets: [
      {
        label: "Likes",
        data: likes,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dislikes",
        data: dislikes,
        borderColor: "#2dd4bf99",
        backgroundColor: "#2dd4bf",
      },
    ],
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 w-full p-4 lg:py-20 lg:mt-0 mt-16">
        <h2 className="text-5xl font-bold col-span-2 lg:col-span-3">
          Rating Stats
        </h2>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title font-bold text-xl">Total Rating</div>
            <div className="stat-value">{likesCount + dislikesCount}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title font-bold text-xl">Likes</div>
            <div className="stat-value"> {likesCount}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title font-bold text-xl">Dislikes</div>
            <div className="stat-value">{dislikesCount}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-center">
          <div className="md:w-[70vw] w-[80vw] h-[50vh]">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Rating;

export async function getServerSideProps() {
  const likesCount = await prisma.rating.count({
    where: {
      rating: 1,
    },
  });
  const dislikesCount = await prisma.rating.count({
    where: {
      rating: 0,
    },
  });

  const ratingForEachDish = await prisma.$queryRaw`SELECT d.name,
  CAST(SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) as CHAR) as likes,
  CAST(SUM(CASE WHEN r.rating = 0 THEN 1 ELSE 0 END) as CHAR) as dislikes
    FROM railway.Rating r
    JOIN railway.Dish d ON r.Dish_id = d.id
    GROUP BY d.id;`;

  return {
    props: {
      likesCount,
      dislikesCount,
      ratingForEachDish,
    },
  };
}
