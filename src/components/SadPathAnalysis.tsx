import HighchartsReact from 'highcharts-react-official';
import React, { useState } from 'react'
import Highcharts from "highcharts";

type SadData = Record<string, number>
const SadPathAnalysis = () => {

    const [data, setData] = useState<SadData>({
        "Verbal Agresion": 10,
        "Customer Hospitality": 5,
        "Assistant did not speak French": 2,
        "Unsupported Language": 30,
        "Assistant did not speak Spanish": 9,
        "User refused to connfirm identity": 10,
        "Caller Identification": 9,
        "Incorrect caller identity": 10

    })

    const pieData = Object.entries(data).map(([name, value]) => ({
        name,
        y: value,
    }));

    const options: Highcharts.Options = {
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            height: "50%",
        },
        title: {
            text: "Call Issues Breakdown",
            style: { color: "#fff", fontSize: "18px" },
        },
        tooltip: {
            pointFormat: "<b>{point.y}</b> cases ({point.percentage:.1f}%)",
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                borderColor: "#111",
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f}%",
                    style: { color: "#00bba7", textOutline: "none" },
                },
            },
        },
        legend: {
            itemStyle: { color: "#fff" }
        },
        series: [
            {
                type: "pie",
                name: "Issue Count",
                data: pieData
            }
        ],
        credits: { enabled: false }
    };

    return (
        <div className="w-full h-full bg-gray-900 p-4 rounded-xl shadow-md">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default SadPathAnalysis