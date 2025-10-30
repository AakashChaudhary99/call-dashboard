import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const CallDuration = () => {
    type CallDurationData = Record<string, number>;
    const [data, setData] = useState<CallDurationData>({
        "Agent A": 3.5,
        "Agent B": 4.8,
        "Agent C": 2.9,
        "Agent D": 5.2,
        "Agent E": 4.1,
        "Agent F": 5.8,
        "Agent G": 2.4
    })

    const [showEmailPrompt, setShowEmailPrompt] = useState(false);
    const [tempData, setTempData] = useState<CallDurationData>({ ...data });
    const [email, setEmail] = useState<string>("");

    const handleTempChange = (agent: string, value: string) => {
        const num = parseFloat(value);
        setTempData((prev) => ({ ...prev, [agent]: isNaN(num) ? 0 : num }));
    };

    const handleApplyChanges = () => {
        setShowEmailPrompt(true)
    };

    const handleSave = async () => {
        if (!email) {
            alert("Please enter your email!");
            return;
        }

        const { data: existing, error } = await supabase
            .from("call_durations")
            .select("data")
            .eq("email", email)
            .single();

        if (error) {
            console.error("Error checking existing data:", error);
            return
        }

        if (existing) {
            const confirmUpdate = confirm(
                `You already have saved data:\n${JSON.stringify(existing.data, null, 2)}\n\nDo you want to overwrite it?`
            );
            if (!confirmUpdate) {
                setShowEmailPrompt(false);
                return;
            }

            const { error: updateError } = await supabase
                .from("call_durations")
                .update({ data: tempData, updated_at: new Date() })
                .eq("email", email);

            if (updateError) {
                console.error("Error updating data:", updateError);
            } else {
                setData({ ...tempData });
                alert("Data updated successfully!");
            }
        } else {
            const { error: insertError } = await supabase
                .from("call_durations")
                .insert([{ email, data: tempData }]);

            if (insertError) {
                console.error("Error inserting data:", insertError);
            } else {
                setData({ ...tempData });
                alert("Data saved successfully!");
            }
        }

        setShowEmailPrompt(false);
    };

    const options: Highcharts.Options = {
        chart: {
            type: "spline",
            backgroundColor: "transparent",
            height: "50%",
        },
        title: {
            text: "Average Call Duration per Voice Agent",
            style: { color: "#fff" },
        },
        xAxis: {
            categories: Object.keys(data),
            title: { text: "Voice Agents", style: { color: "#fff" } },
            labels: { style: { color: "#fff" } },
        },
        yAxis: {
            title: { text: "Duration (minutes)", style: { color: "#fff" } },
            labels: { style: { color: "#fff" } },
            gridLineColor: "#555",
            gridLineWidth: 0.8,
        },
        legend: { itemStyle: { color: "#fff" } },
        tooltip: {
            valueSuffix: " mins",
        },
        series: [{
            name: "Average Call Duration (mins)",
            data: Object.values(data),
            color: "#00bcd4",
        }] as Highcharts.SeriesOptionsType[],
        credits: { enabled: false }
    };

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex"
        }}>
            <div style={{ width: '85%' }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>

            <div className="flex-1 space-y-4 items-center justify-center">
                <h2 className="text-xl font-bold">Edit Call Durations</h2>
                {Object.entries(tempData).map(([agent, duration]) => (
                    <div key={agent} className="flex gap-3 justify-center items-center">
                        <label>{agent}</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => handleTempChange(agent, e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded p-2 w-24 text-center text-white"
                        />
                    </div>
                ))}

                <button
                    onClick={handleApplyChanges}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
                >
                    Submit
                </button>

                {showEmailPrompt && (
                    <div className="mt-4 space-y-3 bg-gray-800 p-4 rounded-lg">
                        <label className="block">Enter your email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-gray-900 border border-gray-700 rounded p-2 w-full text-white"
                        />
                        <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default CallDuration;
