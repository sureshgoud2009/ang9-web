import {Injectable, ElementRef} from '@angular/core';
import {Chart} from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public pieChart: Chart;

  constructor() {}

  generateChart(pieCanvas: ElementRef, dataValues: number[], labelValues: string[], typeOfChart: string, label: string) {
    const data = [
      {
        label,
        data: dataValues,
        backgroundColor: typeOfChart === 'line' ? '#3486eb' : this.generateColors(dataValues.length),
        hoverBackgroundColor: this.generateColors(dataValues.length)
      }
    ];

    const chartOptions = {
      responsive: true,
      tooltips: {
        enabled: true
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };

    return new Chart(pieCanvas.nativeElement, {
      type: typeOfChart,
      data: {
        labels: labelValues,
        datasets: data
      },
      options: chartOptions
    });
  }

  removeData(chart) {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }

//   updateData(chart, data) {

//   //  chart.data.datasets.data = [];
//    // chart.update();
//   //  console.log('Update chart Init data: ', data);
//     this.removeData(chart);
//     this.removeData(chart);
//     console.log('After remove data chart: ', chart.data);
//     this.addData(chart, data);
//     console.log('After Updating data chart: ', chart.data);

//     return chart;
//   }

//   addData(chart, data) {
//     // chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//   //  chart.data.datasets.data = data;
//     chart.update();
// }

  // generateBarChart(barCanvas: ElementRef){
  //   return new Chart(barCanvas.nativeElement, {
  //     type: "bar",
  //     data: {
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //       datasets: [
  //         {
  //           label: "Months",
  //           data: [42, 9, 3, 5, 2, 3],
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.2)",
  //             "rgba(54, 162, 235, 0.2)",
  //             "rgba(255, 206, 86, 0.2)",
  //             "rgba(75, 192, 192, 0.2)",
  //             "rgba(153, 102, 255, 0.2)",
  //             "rgba(255, 159, 64, 0.2)"
  //           ],
  //           borderColor: [
  //             "rgba(255,99,132,1)",
  //             "rgba(54, 162, 235, 1)",
  //             "rgba(255, 206, 86, 1)",
  //             "rgba(75, 192, 192, 1)",
  //             "rgba(153, 102, 255, 1)",
  //             "rgba(255, 159, 64, 1)"
  //           ],
  //           borderWidth: 1
  //         }
  //       ]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [
  //           {
  //             ticks: {
  //               beginAtZero: true
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   });
  // }

  generateColors(countOfColors) {
    let colors = ['#0066ff',
      '#ff0000',
      '#ff9900',
      '#6600ff',
      '#009900',
      '#003366']
    ;

    let selectedColors: string[] = [];
    for (let i = 0; i < countOfColors; i++) {
      selectedColors.push(colors[i]);
    }

    return selectedColors;
  }

}
