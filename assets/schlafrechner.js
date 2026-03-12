/* =============================================
   Schlafrechner WordPress Plugin – JavaScript
   ============================================= */

var srActiveBox = null;

function srSwitchTab(tab) {
  document.querySelectorAll('.sr-tab-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', (i === 0 && tab === 'wakeup') || (i === 1 && tab === 'bedtime'));
  });
  document.querySelectorAll('.sr-panel').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('sr-tab-' + tab).classList.add('active');
  srCloseDropdown();
}

/* ---- TIME PICKER ---- */
function srFocusTime(boxId) {
  if (srActiveBox === boxId) { srCloseDropdown(); return; }
  srCloseDropdown();
  srActiveBox = boxId;

  var suffix = boxId === 'sr-wu-sleep-box' ? 'wu' : 'bt';
  var box    = document.getElementById(boxId);
  var dd     = document.getElementById('sr-dropdown-' + suffix);
  var colH   = document.getElementById('sr-col-h-' + suffix);
  var colM   = document.getElementById('sr-col-m-' + suffix);
  var parts  = box.querySelector('input[type=hidden]').value.split(':');
  var curH   = parseInt(parts[0]);
  var curM   = parseInt(parts[1]);

  colH.innerHTML = '';
  colM.innerHTML = '';

  for (var h = 0; h < 24; h++) {
    (function(hh) {
      var el = document.createElement('div');
      el.className = 'sr-dd-item' + (hh === curH ? ' active' : '');
      el.textContent = String(hh).padStart(2, '0');
      el.onclick = function(e) {
        e.stopPropagation();
        colH.querySelectorAll('.sr-dd-item').forEach(function(i){ i.classList.remove('active'); });
        el.classList.add('active');
        srUpdateTime(boxId, suffix);
      };
      colH.appendChild(el);
    })(h);
  }

  for (var m = 0; m < 60; m++) {
    (function(mm) {
      var el = document.createElement('div');
      el.className = 'sr-dd-item' + (mm === curM ? ' active' : '');
      el.textContent = String(mm).padStart(2, '0');
      el.onclick = function(e) {
        e.stopPropagation();
        colM.querySelectorAll('.sr-dd-item').forEach(function(i){ i.classList.remove('active'); });
        el.classList.add('active');
        srUpdateTime(boxId, suffix);
      };
      colM.appendChild(el);
    })(m);
  }

  dd.style.display = 'block';
  box.classList.add('sr-timebox-open');

  setTimeout(function() {
    var ah = colH.querySelector('.active');
    var am = colM.querySelector('.active');
    if (ah) ah.scrollIntoView({ block: 'center' });
    if (am) am.scrollIntoView({ block: 'center' });
  }, 10);
}

function srUpdateTime(boxId, suffix) {
  var colH = document.getElementById('sr-col-h-' + suffix);
  var colM = document.getElementById('sr-col-m-' + suffix);
  var ah = colH.querySelector('.active');
  var am = colM.querySelector('.active');
  if (!ah || !am) return;
  var box = document.getElementById(boxId);
  box.querySelector('.sr-th').textContent = ah.textContent;
  box.querySelector('.sr-tm').textContent = am.textContent;
  box.querySelector('input[type=hidden]').value = ah.textContent + ':' + am.textContent;

  // Auto-recalc if results already visible
  var results = document.getElementById('sr-' + suffix + '-results');
  if (results && results.style.display !== 'none') {
    if (suffix === 'wu') srCalcWakeUp(); else srCalcBedTime();
  }
}

function srCloseDropdown() {
  document.querySelectorAll('.sr-dropdown').forEach(function(dd) { dd.style.display = 'none'; });
  document.querySelectorAll('.sr-timebox').forEach(function(b) { b.classList.remove('sr-timebox-open'); });
  srActiveBox = null;
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.sr-timebox')) srCloseDropdown();
});

/* ---- CALCULATIONS ---- */
function srGetRecommendedHours(age) {
  if (age <= 1)  return [12, 16];
  if (age <= 2)  return [11, 14];
  if (age <= 5)  return [10, 13];
  if (age <= 12) return [9, 12];
  if (age <= 17) return [8, 10];
  if (age <= 64) return [7, 9];
  return [7, 8];
}

function srAddMinutes(timeStr, minutes) {
  var parts = timeStr.split(':').map(Number);
  var totalMins = (parts[0] * 60 + parts[1] + minutes) % 1440;
  return String(Math.floor(totalMins / 60)).padStart(2, '0') + ':' + String(totalMins % 60).padStart(2, '0');
}

function srSubtractMinutes(timeStr, minutes) {
  var parts = timeStr.split(':').map(Number);
  var totalMins = ((parts[0] * 60 + parts[1] - minutes) % 1440 + 1440) % 1440;
  return String(Math.floor(totalMins / 60)).padStart(2, '0') + ':' + String(totalMins % 60).padStart(2, '0');
}

function srMinutesToStr(mins) {
  var h = Math.floor(mins / 60);
  var m = mins % 60;
  return m === 0 ? h + 'h' : h + 'h ' + m + 'min';
}

function srRenderResults(containerId, times, recommended, label) {
  var container = document.getElementById(containerId);
  var minMins = recommended[0] * 60;
  var maxMins = recommended[1] * 60;
  var html = '<div class="sr-results-title">Empfohlene ' + label + '</div><div class="sr-results-grid">';
  times.forEach(function(item) {
    var isBest = item.totalMins >= minMins && item.totalMins <= maxMins;
    html += '<div class="sr-result-card' + (isBest ? ' sr-best' : '') + '">';
    html += '<div class="sr-result-time">' + item.time + '</div>';
    html += '<div class="sr-result-cycles">' + item.cycles + ' Zyklen</div>';
    html += '<div class="sr-result-cycles">' + srMinutesToStr(item.totalMins) + '</div>';
    if (isBest) html += '<div class="sr-best-label">⭐ Ideal</div>';
    html += '</div>';
  });
  html += '</div><p class="sr-tip">💡 Ein Schlafzyklus dauert ca. 90 Minuten. <br>Empfohlen für dein Alter: ' + recommended[0] + '–' + recommended[1] + ' Stunden Schlaf.</p>';
  container.innerHTML = html;
  container.style.display = 'block';
  var suffix = containerId === 'sr-wu-results' ? 'wu' : 'bt';
  var resetBtn = document.getElementById('sr-' + suffix + '-reset');
  if (resetBtn) resetBtn.style.display = 'block';
}


function srReset(suffix) {
  // Hide results and reset button
  var results = document.getElementById('sr-' + suffix + '-results');
  var resetBtn = document.getElementById('sr-' + suffix + '-reset');
  if (results)  { results.style.display = 'none'; results.innerHTML = ''; }
  if (resetBtn) resetBtn.style.display = 'none';

  // Reset age
  var ageInput = document.getElementById('sr-' + suffix + '-age');
  if (ageInput) { ageInput.value = ''; }

  // Reset timebox
  var boxId   = suffix === 'wu' ? 'sr-wu-sleep-box' : 'sr-bt-wake-box';
  var hId     = suffix === 'wu' ? 'sr-wu-h'         : 'sr-bt-h';
  var mId     = suffix === 'wu' ? 'sr-wu-m'         : 'sr-bt-m';
  var hiddenId= suffix === 'wu' ? 'sr-wu-sleep'      : 'sr-bt-wake';
  var defTime = suffix === 'wu' ? '22:00'            : '08:00';

  document.getElementById(hId).textContent      = defTime.split(':')[0];
  document.getElementById(mId).textContent      = defTime.split(':')[1];
  document.getElementById(hiddenId).value       = defTime;

  // Reset offset checkbox and number
  var offsetBox = document.getElementById('sr-' + suffix + '-offset');
  var offsetMin = document.getElementById('sr-' + suffix + '-offset-min');
  if (offsetBox) offsetBox.checked = false;
  if (offsetMin) offsetMin.value = 14;

  srCloseDropdown();
}


function srSetNow() {
  var now  = new Date();
  var hh   = String(now.getHours()).padStart(2, '0');
  var mm   = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('sr-wu-h').textContent     = hh;
  document.getElementById('sr-wu-m').textContent     = mm;
  document.getElementById('sr-wu-sleep').value       = hh + ':' + mm;

  // Auto-recalc if results already visible
  var results = document.getElementById('sr-wu-results');
  if (results && results.style.display !== 'none') srCalcWakeUp();
}

function srCalcWakeUp() {
  var age = parseInt(document.getElementById('sr-wu-age').value) || 22;
  var sleepTime = document.getElementById('sr-wu-sleep').value;
  var offsetMin = parseInt(document.getElementById('sr-wu-offset-min') && document.getElementById('sr-wu-offset-min').value) || 14;
  var offset = document.getElementById('sr-wu-offset') && document.getElementById('sr-wu-offset').checked ? offsetMin : 0;
  var recommended = srGetRecommendedHours(age);
  var times = [];
  for (var cycles = 3; cycles <= 6; cycles++) {
    var totalMins = cycles * 90;
    times.push({ time: srAddMinutes(sleepTime, totalMins + offset), cycles: cycles, totalMins: totalMins });
  }
  srRenderResults('sr-wu-results', times, recommended, 'Aufwachzeiten');
}

function srCalcBedTime() {
  var age = parseInt(document.getElementById('sr-bt-age').value) || 22;
  var wakeTime = document.getElementById('sr-bt-wake').value;
  var offsetMin = parseInt(document.getElementById('sr-bt-offset-min') && document.getElementById('sr-bt-offset-min').value) || 14;
  var offset = document.getElementById('sr-bt-offset') && document.getElementById('sr-bt-offset').checked ? offsetMin : 0;
  var recommended = srGetRecommendedHours(age);
  var times = [];
  for (var cycles = 3; cycles <= 6; cycles++) {
    var totalMins = cycles * 90;
    times.push({ time: srSubtractMinutes(wakeTime, totalMins + offset), cycles: cycles, totalMins: totalMins });
  }
  srRenderResults('sr-bt-results', times.reverse(), recommended, 'Schlafenszeiten');
}

// Auto-recalculate when offset checkbox changes
document.addEventListener('DOMContentLoaded', function() {
  var wuOffset = document.getElementById('sr-wu-offset');
  var btOffset = document.getElementById('sr-bt-offset');
  if (wuOffset) wuOffset.addEventListener('change', function() {
    var results = document.getElementById('sr-wu-results');
    if (results && results.style.display !== 'none') srCalcWakeUp();
  });
  if (btOffset) btOffset.addEventListener('change', function() {
    var results = document.getElementById('sr-bt-results');
    if (results && results.style.display !== 'none') srCalcBedTime();
  });
  var wuOffsetMin = document.getElementById('sr-wu-offset-min');
  var btOffsetMin = document.getElementById('sr-bt-offset-min');
  if (wuOffsetMin) wuOffsetMin.addEventListener('input', function() {
    var results = document.getElementById('sr-wu-results');
    if (results && results.style.display !== 'none' && document.getElementById('sr-wu-offset').checked) srCalcWakeUp();
  });
  if (btOffsetMin) btOffsetMin.addEventListener('input', function() {
    var results = document.getElementById('sr-bt-results');
    if (results && results.style.display !== 'none' && document.getElementById('sr-bt-offset').checked) srCalcBedTime();
  });
});
