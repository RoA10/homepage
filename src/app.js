import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ctx = document.getElementById('myChart').getContext('2d');

// データをまとめたオブジェクト
const CHART_DATA = {
  data1: {
    labels: ['10代', '20代', '30代', '40代', '50代', '60代'],
    datasets: [
      {
        label: '年代分布',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(135,193,255,0.7)',
      },
    ],
  },
  data2: {
    labels: ['30代', '40代', '50代'],
    datasets: [
      {
        label: '男',
        data: [1, 2, 3],
        backgroundColor: 'rgb(147, 194, 255)',
      },
      {
        label: '女',
        data: [2, 3, 4],
        backgroundColor: 'rgb(255, 165, 165)',
      },
    ],
  },
};

let myChart;

// チャートを作成または再作成する関数
function renderChart(configKey) {
  const configData = CHART_DATA[configKey];
  if (myChart) {
    myChart.destroy(); // 古いチャートを削除
  }
  myChart = new Chart(ctx, {
    type: 'bar',
    data: configData,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true } },
        x: { title: { display: true } },
      },
    },
  });
}

// 初期表示
renderChart('data1');

// ボタンクリックイベント
document
  .getElementById('data1')
  .addEventListener('click', () => renderChart('data1'));
document
  .getElementById('data2')
  .addEventListener('click', () => renderChart('data2'));
