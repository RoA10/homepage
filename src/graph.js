const TEST_URL = '/test.bin?n=' + Date.now();
const FILE_SIZE_BYTES = 1 * 1024 * 1024;

const ctx = document.getElementById('speedChart').getContext('2d');
const startBtn = document.getElementById('start');
const statusEl = document.getElementById('status');

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Mbps',
      data: [],
      borderColor: 'blue',
      fill: false,
      tension: 0.1,
      pointRadius: 3 
    }]
  },
  options: {
    animation: { duration: 100 },
    responsive: true,
    scales: {
      x: { title: { display: true, text: '回数' }},
      y: { title: { display: true, text: 'Mbps' }, beginAtZero: true } }
  }
});

let intervalId = null;
let counter = 0;
let running = false;

async function measureSpeed() {
  const start = performance.now();
  await fetch(TEST_URL, { cache: 'no-store' }).then(r => r.blob());
  const end = performance.now();
  return parseFloat(((FILE_SIZE_BYTES * 8) / ((end - start) / 1000) / (1024 * 1024)).toFixed(2));
}

async function runOnce() {
  if (running) return;
  running = true;
  counter++;
  statusEl.textContent = `試行 ${counter}: 計測中…`;

  try {
    const speed = await measureSpeed();
    chart.data.labels.push(counter);
    chart.data.datasets[0].data.push(speed);

    if (chart.data.labels.length > 5) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update('none');
    statusEl.textContent = `試行${counter} : ${speed}Mbps`;
  } catch (e) {
    console.error(e);
    statusEl.textContent = `試行 ${counter} : エラー`;
  } finally {
    running = false;
  }
}

startBtn.addEventListener('click', () => {
  if (intervalId === null) {
    intervalId = setInterval(runOnce, 1000);
    startBtn.textContent = '停止';
    statusEl.textContent = '自動計測中…';
  } else {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.textContent = '計測開始';
    statusEl.textContent = '計測停止中';
  }
});
