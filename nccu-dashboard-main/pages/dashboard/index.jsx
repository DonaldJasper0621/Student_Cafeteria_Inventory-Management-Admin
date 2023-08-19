import React from "react";
import Navbar from "../../components/Navbar";
import { prisma } from "../../lib/prisma";

// use Pie chart to show the gender ratio
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ user, order }) => {
  // count the number of gender in user data
  const genderCounts = {
    male: 0,
    female: 0,
    other: 0,
  };
  const occupationCounts = {
    student: 0,
    teacher: 0,
  };
  user.forEach((user) => {
    if (user.gender === "male") {
      genderCounts.male++;
    } else if (user.gender === "female") {
      genderCounts.female++;
    } else if (user.gender === "other") {
      genderCounts.other++;
    }
    if (user.occupation === "student") {
      occupationCounts.student++;
    } else if (user.occupation === "teacher") {
      occupationCounts.teacher++;
    }
  });

  const data = {
    labels: ["male", "female", "other"],
    datasets: [
      {
        label: "Gender ratio",
        data: [genderCounts.male, genderCounts.female, genderCounts.other],
        backgroundColor: ["#2dd4bf99", "#fbbf2499", "#f8717199"],
        borderColor: ["#2dd4bf", "#fbbf24", "#f87171"],
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
  const data2 = {
    labels: ["student", "teacher"],
    datasets: [
      {
        label: "Occupation ratio",
        data: [occupationCounts.student, occupationCounts.teacher],
        backgroundColor: ["#e879f999", "#60a5fa99"],
        borderColor: ["#e879f9", "#60a5fa"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 w-full p-4 lg:pt-20 lg:mt-0 mt-16">
        <h2 className="text-5xl font-bold col-span-2">User Stats</h2>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total User</div>
            <div className="stat-value">{user.length}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Monthly User</div>
            <div className="stat-value">{user.length}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid lg:grid-cols-2 gap-4 w-full">
          <div className="max-w-screen">
            <Pie
              data={data}
              height="350px"
              width="350px"
              options={{
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Gender distribution",
                    color: "#a5adba",
                    font: {
                      size: 20,
                    },
                  },
                },
              }}
            />
          </div>
          <div>
            <Pie
              data={data2}
              height="350px"
              width="350px"
              options={{
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Occupation distribution",
                    color: "#a5adba",
                    font: {
                      size: 20,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

export async function getServerSideProps() {
  // count how many users and order are in the database
  const user = await prisma.user.findMany();
  const order = await prisma.order.findMany();
  return {
    props: {
      user,
      order,
    },
  };
}
