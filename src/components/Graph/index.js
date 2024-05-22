import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Graph({ capMax, capOcup }) {
  const data = {
    labels: ["Cap. Ocupada", "Cap. Libre"],
    datasets: [
      {
        data: [capOcup, capMax - capOcup],
        backgroundColor:
          (capOcup / capMax) * 100 >= 100 ? 
            ["red", "#5dc460"] 
          : (capOcup / capMax) * 100 >= 70 ?
            ["#ffc107", "#5dc460"]
          : ["#FE7F29", "#5dc460"],
/*         hoverBackgroundColor:
        (capOcup / capMax) * 100 >= 100 ? ["red", "#5dc460"] : ["#FE7F29", "#5dc460"], */
        //hoverBackgroundColor: ["#FF6294", "#36A2EB"],
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
    width: 10,
    height: 10,
  };

  return (
    <div className="h-100 pt-2">
      <Doughnut data={data} options={options} />
      <p
        className="text-end m-0"
      >
        <strong className="text-dark">Ocupación: <span className={
          (capOcup / capMax) * 100 >= 100 ? "text-danger" :
          (capOcup / capMax) * 100 >= 70 ? "text-warning" : null
        }>{((capOcup / capMax) * 100).toFixed(2)}%</span></strong>
      </p>
    </div>
  );
}

export default Graph;
