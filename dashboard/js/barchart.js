window.addEventListener("load", init)

function init(e) {
    /* Just in case if a pie chart / doughnut chart is needed
    (async function () {
        new Chart(
            document.querySelector("#doughnut-members").getContext("2d"),
            {
                type: "doughnut",
                data: {
                    labels: [
                        "Active Members",
                        "Inactive Members"
                    ],
                    datasets: [{
                        label: "Total Members",
                        data: [200, 21],
                        backgroundColor: [
                            'rbga(5, 136, 243, 0.8)',
                            `rgba(5, 136, 243, 0.37)`
                        ],
                        hoverOffset: 4,
                    }]
                }
            }
        )
    })();
    */
    (async function () {
        const data = [
            { day: "Monday", count: 5 },
            { day: "Tuesday", count: 10 },
            { day: "Wednesday", count: 23 },
            { day: "Thursday", count: 20 },
            { day: "Friday", count: 4 },
            { day: "Saturday", count: 10 },
            { day: "Sunday", count: 14 },
        ];

        new Chart(
            document.querySelector('.barchart').getContext("2d"),
            {
                type: 'bar',
                data: {
                    labels: data.map(row => row.day),
                    datasets: [
                        {
                            label: 'Generated Plans By Week',
                            data: data.map(row => row.count),

                            barPercentage: 1,
                            barThickness: 25,
                            maxBarThickness: 40,
                            minBarLength: 1,
                            
                            backgroundColor: 'rgba(5, 136, 243, 0.37)',
                            hoverBackgroundColor: `rgba(5, 136, 243, 0.8)`,
                            borderColor: 'rgba(255, 255, 255, 0.93)',
                            borderWidth: 0.5,
                            borderRadius: 4,
                        }
                    ],
                }, 
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: "white",
                            },
                        },
                    },
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.32)',
                            },
                            ticks: {
                                color: 'white',
                            },
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.32)',
                            },
                            ticks: {
                                color: 'white',
                                maxRotation: 20
                            },
                        },
                    },
                }
            }
        );
    })();
}


