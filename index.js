
//variables
let IR = 0
let contribution = 0
let startingValue = 0
let limit = 10
let requiredIncome = 0

let contributionAnnual = contribution * 12
let values = [startingValue]
let comparatorValues = [startingValue]
let reqWealth = []

let labels = []

function SetParams() {
    let ir = document.getElementById("IR").value
    let contr = document.getElementById("contribution").value
    let startingVal = document.getElementById("startingValue").value
    let lim = document.getElementById("limit").value
    let req = document.getElementById("reqIncome").value

    IR = ir*0.01
    contribution = parseInt(contr)
    startingValue = parseInt(startingVal)
    limit = parseInt(lim)
    requiredIncome = req
    reqWealth = []

    contributionAnnual = contribution * 12
    values = [startingValue]
    comparatorValues = [startingValue]
    labels = []
}

//generate labels for graph up until limit year
function labelGen(limit) {
    let i = 0
    while (i <= limit) {
        labels.push(i)
        reqWealth.push(requiredIncome/IR)
        i++
    }
}
// function for compounded investment return
function returnPlot(acc, x) {
    if (x == limit) {
        values.push(acc*(1+IR)+contributionAnnual)
        return
    } 
    acc = (acc + contributionAnnual)*(1+IR)
    console.log(acc)
    values.push(acc)
    returnPlot(acc,x+1)
}

// comparison plot if money was never invested
function comparator() {
    let i = 1
    let compAcca = startingValue
    while (i <= limit) {
        compAcca = compAcca + contributionAnnual
        comparatorValues.push(compAcca)
        console.log("comp" + " " + compAcca)
        i++
    }
}

//displays years to financial freedom if you will reach it before limit
function didIhitGoal(text) {
    for (let i = 0; i < values.length; i++) {
        if (values[i] > reqWealth[0]) {
            text.innerHTML = `You will reach financial freedom in ${i} years!`
            return
        }
    }
}

// USD number formatter.
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });


window.onload=function(){
    let button = document.getElementById("submitForm")
    let text = document.getElementById("goal")
    button.onclick = () => {
        SetParams()
        labelGen(limit)
        returnPlot(startingValue, 1)
        comparator()
        didIhitGoal(text)
        var ctx = document.getElementById("myChart");
        var data = {
           labels: labels,
            datasets: [{
                label: "Compound Investing Balance",
                borderColor: "rgba(75, 192, 192, 1)",
                data: values,
                fill: true
            },
            {
                label: "Contributions",
                data: comparatorValues,
                borderColor: "rgba(153, 102, 255, 1)",
                fill: true
            },
            {
                label: "Required Wealth",
                data: reqWealth,
                borderColor: "rgba(237, 43, 43, 1)",
                fill: false
            }
        ]
        };
        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return formatter.format(value);
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, chart){
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ": " + formatter.format(tooltipItem.yLabel, 2);
                        }
                    }
                }
            }
        });
    }

        }
    
