import { useState, useEffect, useMemo } from "react";
import { prisma } from "../../../lib/prisma";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { useTable } from "react-table";

const Order = ({ orders, countsByDate, totalIncome }) => {
  const selectOptions = ["Tomorrow", "All Time", "Last 7 Day", "Last Month"];
  const [select, setselect] = useState(selectOptions[0]);

  const [ordersState, setOrdersState] = useState(orders);
  const [countsByDateState, setCountsByDateState] = useState(countsByDate);
  const [newIncome, setNewIncome] = useState(totalIncome);
  const [planCount, setPlanCount] = useState({ mainDish: 0, noMainDish: 0 });

  useEffect(() => {
    // calculate plans count
    const planCounts = calculatePlanCounts();
    console.log(planCounts);
    setPlanCount({
      mainDish: planCounts.mainDish,
      noMainDish: planCounts.noMainDish,
    });
    // calculate total income
    const totalIncome = ordersState.reduce((acc, order) => {
      if (order.Dish_id === 2) {
        return acc + 50;
      } else {
        return acc + 90;
      }
    }, 0);
    setNewIncome(totalIncome);
  }, [ordersState]);

  // loop through the order data to get the total revenue and get plans count

  const calculatePlanCounts = () => {
    let mainDishCount = 0;
    let noMainDishCount = 0;
    ordersState.forEach((order) => {
      if (order.Dish_id === 2) {
        noMainDishCount += 1;
      } else {
        mainDishCount += 1;
      }
    });
    return { mainDish: mainDishCount, noMainDish: noMainDishCount };
  };

  // when select option change, update the data
  useEffect(() => {
    if (select === "Tomorrow") {
      const today = new Date();
      // get date of tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowOrders = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate.getDate() === tomorrow.getDate();
      });
      const tomorrowCounts = Object.keys(countsByDate).filter((date) => {
        const orderDate = new Date(date);
        return orderDate.getDate() === tomorrow.getDate();
      });

      const tomorrowCountsObj = {};
      tomorrowCounts.forEach((date) => {
        tomorrowCountsObj[date] = countsByDateState[date];
      });
      setCountsByDateState(tomorrowCountsObj);
      setOrdersState(tomorrowOrders);
    }
    if (select === "All Time") {
      setCountsByDateState(countsByDate);
      setOrdersState(orders);
    }
    if (select === "Last 7 Day") {
      // filter orders to only show last 7 days to another useEffect
      const last7Days = orders.filter((order) => {
        const orderDate = new Date(order.date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });
      // filter countsByDate to only show last 7 days for line chart
      const last7DaysCounts = Object.keys(countsByDate).filter((date) => {
        const orderDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      console.log(last7DaysCounts);
      const last7DaysCountsObj = {};
      last7DaysCounts.forEach((date) => {
        last7DaysCountsObj[date] = countsByDateState[date];
      });
      setCountsByDateState(last7DaysCountsObj);
      setOrdersState(last7Days);
    }
    if (select === "Last Month") {
      // filter orders to only show last month to another useEffect
      const lastMonth = orders.filter((order) => {
        const orderDate = new Date(order.date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
      // filter countsByDate to only show last month for line chart
      const lastMonthCounts = Object.keys(countsByDate).filter((date) => {
        const orderDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
      const lastMonthCountsObj = {};
      lastMonthCounts.forEach((date) => {
        lastMonthCountsObj[date] = countsByDateState[date];
      });
      setCountsByDateState(lastMonthCountsObj);
      setOrdersState(lastMonth);
    }
  }, [select]);

  // line chart
  const data = {
    labels: Object.keys(countsByDateState),
    datasets: [
      {
        label: "Order",
        data: Object.values(countsByDateState),
        fill: false,
        backgroundColor: "#e879f999",
        borderColor: "#e879f9",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  // generate pie chart using plans
  const labels = ["Main Dish", "No Main Dish"];

  const data2 = {
    labels,
    datasets: [
      {
        label: "Plans",
        data: [planCount.mainDish, planCount.noMainDish],
        backgroundColor: ["#2dd4bf99", "#fbbf2499"],
        borderColor: ["#2dd4bf", "#fbbf24"],
        borderWidth: 1,
      },
    ],
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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

  // table config

  const tableData = useMemo(() => {
    return ordersState.map((order) => {
      return {
        id: order.User.studentId,
        name: order.Dish.name,
        date: order.date,
      };
    });
  }, [ordersState]);

  const columns = useMemo(() => {
    return [
      {
        Header: "Student ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Date",
        accessor: "date",
      },
    ];
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  return (
    <>
      <div className="mt-16 grid w-full grid-cols-2 gap-3 p-4 lg:mt-0 lg:pt-20">
        <div className="col-span-2 flex items-center">
          <h2 className="mr-auto text-5xl font-bold">Order Stats</h2>
          <select
            className="select-bordered select-accent select max-w-md"
            defaultValue={select}
            onChange={(e) => {
              setselect(e.target.value);
            }}
          >
            {selectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="stats bg-primary text-white shadow">
          <div className="stat">
            <div className="stat-title">Total Order</div>
            <div className="stat-value">{ordersState.length}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats bg-primary text-white shadow">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">${newIncome}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-start justify-start">
          <div className="my-16 w-full">
            <h2 className="mb-4 text-5xl font-bold">Order List</h2>
            <div className="max-h-96 w-full overflow-y-scroll">
              <table {...getTableProps()} className="w-full border-2">
                <thead>
                  {headerGroups.map((headerGroup, index) => (
                    <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          {...column.getHeaderProps()}
                          className="border-b-2 border-r-2"
                          key={index}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={index}>
                        {row.cells.map((cell, index) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="border-b-2 border-r-2 text-center"
                              key={index}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-16 h-[50vh] w-[80vw] md:w-[60vw]">
            <div className="mb-4 flex items-center">
              <h3 className="mr-auto text-3xl font-bold">Order Count</h3>
            </div>
            <Line data={data} options={options} />
          </div>
          <div className="my-16 h-[50vh] w-[80vw] md:w-[60vw]">
            <div className="mb-4 flex items-center">
              <h3 className="mr-auto text-3xl font-bold">Plan Distribution</h3>
            </div>
            <Bar data={data2} options={options2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;

export async function getServerSideProps() {
  // get all orders and the dish name
  const orders = await prisma.order.findMany({
    select: {
      date: true,
      Dish_id: true,
      Dish: {
        select: {
          name: true,
        },
      },
      User: {
        select: {
          studentId: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  // group the order by date and count the number of order
  const result = await prisma.order.findMany({
    select: {
      date: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  const countsByDate = result.reduce((counts, record) => {
    const date = record.date;
    counts[date] = (counts[date] || 0) + 1;
    return counts;
  }, {});

  const totalIncome = orders.reduce((acc, order) => {
    if (order.Dish_id === 2) {
      return acc + 50;
    } else {
      return acc + 90;
    }
  }, 0);

  return {
    props: { orders, countsByDate, totalIncome },
  };
}
