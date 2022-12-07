import React, { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";

const DoughnutChart = ({
  labels = [],
  label = "",
  data = [],
  backgroundColor = [
    "#57b8ff",
    "#F05365",
    "#7F2CCB",
    "#FABC2A",
    "#00A676",
    "#29E7CD",
    "#FB5012",
    "#BFB1C1",
    "#F0C808",
    "#071108",
    "#FFFD82",
  ],
  unique_id_for_legend = "js-legend",
  center = {
    text: "Amount Spent",
    amount: 8888888,
  },
  headerText = "",
  subHeaderText = "",
  clickHandler = (category) => {},
}) => {
  const chartRef = useRef();
  const legendRef = useRef();

  const htmlLegendPlugin = {
    id: "htmlLegend",
    afterUpdate(chart) {
      const items = chart.options.plugins.legend.labels.generateLabels(chart);
      const ul = document.createElement("ul");
      ul.className = "legendClass";

      items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = item.text;
        const boxSpan = document.createElement("div");
        boxSpan.style.background = item.fillStyle;
        li.appendChild(boxSpan);
        li.appendChild(
          document.createTextNode(
            `${item.text} ${
              chart.data.datasets[0].data.length > 0 &&
              "( " +
                (
                  (chart.data.datasets[0].data[index] /
                    chart.data.datasets[0].data.reduce(
                      (partialSum, a) => partialSum + a,
                      0
                    )) *
                  100
                ).toFixed(2) +
                "% )"
            }`
          )
        );
        ul.appendChild(li);
      });
      const jsLegend = document.getElementById(unique_id_for_legend);
      jsLegend.replaceChildren(ul);
    },
  };
  const onClick = (event) => {
    const items = getElementAtEvent(chartRef.current, event);
    if (items.length > 0) {
      clickHandler(labels[items[0].index]);
    }
  };
  useEffect(() => {
    const callme = (e) => {
      if (e.srcElement.tagName === "LI") {
        clickHandler(e.srcElement.className);
      }
    };
    if (legendRef.current) {
      legendRef.current.addEventListener("click", callme);
    }
    return () => {
      if (legendRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        legendRef.current.removeEventListener("click", callme);
      }
    };
  }, [clickHandler]);
  return (
    <div style={{ width: "100%" }}>
      {(headerText || subHeaderText) && (
        <div style={{ marginTop: 10 }}>
          {headerText && (
            <div
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 20 }}
            >
              {headerText}
            </div>
          )}
          {subHeaderText && (
            <div
              style={{
                fontWeight: "lighter",
                textAlign: "center",
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              {subHeaderText}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: 10,
          gap: 10,
        }}
      >
        <Doughnut
          ref={chartRef}
          onClick={onClick}
          plugins={[htmlLegendPlugin]}
          data={{
            labels: labels,
            datasets: [
              {
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                hoverOffset: 5,
              },
            ],
          }}
          options={{
            cutout: "70%",
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display: false,
              },
            },
          }}
        />
        <div className="centermebro">
          <div className="title">{center.text}</div>
          <div className="amount">
            {center.amount.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "INR",
            })}
          </div>
        </div>
      </div>
      <div
        ref={legendRef}
        id={unique_id_for_legend}
        style={{ display: "flex" }}
      ></div>
    </div>
  );
};

export default DoughnutChart;
