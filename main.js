let s = 0;
let m = 0;
let h = 0;
let ms = 0;
let laps = [];
let lapCount = 0;
let lastLapTime = 0;

function formatLap(msTotal) {
  let h = Math.floor(msTotal / 360000);
  let m = Math.floor((msTotal % 360000) / 6000);
  let s = Math.floor((msTotal % 6000) / 100);
  let ms = msTotal % 100;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(2,'0')}`;
}

function getTotalMs() {
  return (h * 360000) + (m * 6000) + (s * 100) + ms;
}

$('#stop').hide(0);
$('#reset').hide(0);
$('#checkpoint').hide(0);
$('#laps').hide(0);

let timerId;
$('#start').click(function(){
    $('#start').hide(0);
    $('#stop').show(0);
    $('#reset').hide(0);
    $('#checkpoint').show(0);

    timerId = setInterval(() => {
        ms++;

        if(ms === 100){
            ms = 0;
            s++;
        }
        if(s === 60){
            s = 0;
            m++;
        }
        if(m === 60){
            m = 0;
            h++;
        }

        // форматування з нулями
        $('.hour').text(String(h).padStart(2, '0'));
        $('.minute').text(String(m).padStart(2, '0'));
        $('.second').text(String(s).padStart(2, '0'));
        $('.milsecond').text(String(ms).padStart(2, '0'));
    }, 10);
});

$('#stop').click(function(){
    clearInterval(timerId);
    $('#stop').hide(0);
    $('#start').show(0);
    $('#reset').show(0);
    $('#checkpoint').hide(0);
});

$('#reset').click(function(){
    clearInterval(timerId);
    s = 0;
    m = 0;
    h = 0;
    ms = 0;
    laps = [];
    lapCount = 0;
    $('.hour').text("00");
    $('.minute').text("00");
    $('.second').text("00");
    $('.milsecond').text("00");
    $('#laps tbody').html("");
    $('#reset').hide(0);
    $('#start').show(0);
    $('#stop').hide(0);
    $('#checkpoint').hide(0);
    $('#laps').hide(0);
    $('#laps tbody').html("");
});

$('#checkpoint').click(function(){
  $('#laps').show(0);
  lapCount++;
  let totalMs = getTotalMs();
  let lapMs = totalMs - lastLapTime;
  lastLapTime = totalMs;
  laps.push(lapMs);

  let fastestIndex = laps.indexOf(Math.min(...laps));
  let slowestIndex = laps.indexOf(Math.max(...laps));

  let tbody = $('#laps tbody');
  tbody.html(""); // перезаписуємо таблицю з правильними позначками

  laps.forEach((lap, i) => {
    let lapTime = formatLap(lap);
    // сума всіх кіл від першого до поточного
    let sumMs = laps.slice(0, i + 1).reduce((a, b) => a + b, 0);

    // форматований накопичений час
    let totalTime = formatLap(sumMs);

    let status = "-";
    if (i === fastestIndex) status = "Fastest";
    if (i === slowestIndex) status = "Slowest";

    let row = `
      <tr>
        <td>${i + 1}</td>
        <td>${status}</td>
        <td>${lapTime}</td>
        <td>${totalTime}</td>
      </tr>
    `;
    tbody.prepend(row);
  });
});