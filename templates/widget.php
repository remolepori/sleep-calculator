<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>

<div class="schlafrechner-wrap">
  <h2 class="schlafrechner-title">Ich möchte berechnen...</h2>

  <div class="sr-tabs">
    <button class="sr-tab-btn active" onclick="srSwitchTab('wakeup')">Aufwachzeit</button>
    <button class="sr-tab-btn" onclick="srSwitchTab('bedtime')">Schlafenszeit</button>
  </div>

  <div class="sr-card">

    <!-- AUFWACHZEIT -->
    <div class="sr-panel active" id="sr-tab-wakeup">
      <p class="sr-description">Berechne deine optimale Aufwachzeit anhand deines Alters und deiner geplanten Einschlafzeit.</p>

      <div class="sr-field">
        <label class="sr-label">
          Wie alt bist du?
          <span class="sr-info" data-tip="Das Alter beeinflusst den empfohlenen Schlafbedarf.">i</span>
        </label>
        <input type="number" id="sr-wu-age" class="sr-input" min="1" max="120" placeholder="25" value="">
      </div>

      <div class="sr-field">
        <label class="sr-label">Wann planst du einzuschlafen?</label>
        <div class="sr-time-row">
          <button class="sr-now-btn" onclick="srSetNow()" title="Aktuelle Zeit verwenden">Jetzt</button>
          <div class="sr-timebox" id="sr-wu-sleep-box" onclick="srFocusTime('sr-wu-sleep-box')">
            <span class="sr-th" id="sr-wu-h">22</span>
            <span class="sr-tsep">:</span>
            <span class="sr-tm" id="sr-wu-m">00</span>
            <input type="hidden" id="sr-wu-sleep" value="22:00">
            <div id="sr-dropdown-wu" class="sr-dropdown" style="display:none"><div class="sr-dropdown-cols"><div class="sr-dropdown-col" id="sr-col-h-wu"></div><div class="sr-dropdown-col" id="sr-col-m-wu"></div></div></div>
          </div>
        </div>
      </div>


      <div class="sr-field sr-offset-field">
        <label class="sr-checkbox-label">
          <input type="checkbox" id="sr-wu-offset" class="sr-checkbox">
          <span class="sr-checkmark"></span>
          <span class="sr-checkbox-text"><input type="number" id="sr-wu-offset-min" class="sr-offset-input" value="14" min="1" max="120"> Minuten Einschlafzeit einrechnen</span>
          <span class="sr-info" data-tip="Durchschnittlich dauert es 14 Minuten bis man einschläft.">i</span>
        </label>
      </div>
      <button class="sr-btn" onclick="srCalcWakeUp()">BERECHNEN</button>
      <div class="sr-results" id="sr-wu-results" style="display:none"></div>
      <button class="sr-reset-btn" id="sr-wu-reset" onclick="srReset('wu')" style="display:none">↺ Zurücksetzen</button>
    </div>

    <!-- SCHLAFENSZEIT -->
    <div class="sr-panel" id="sr-tab-bedtime">
      <p class="sr-description">Berechne deine optimale Schlafenszeit anhand deines Alters und deiner gewünschten Aufwachzeit.</p>

      <div class="sr-field">
        <label class="sr-label">
          Wie alt bist du?
          <span class="sr-info" data-tip="Das Alter beeinflusst den empfohlenen Schlafbedarf.">i</span>
        </label>
        <input type="number" id="sr-bt-age" class="sr-input" min="1" max="120" placeholder="25" value="">
      </div>

      <div class="sr-field">
        <label class="sr-label">Wann möchtest du aufwachen?</label>
        <div class="sr-timebox" id="sr-bt-wake-box" onclick="srFocusTime('sr-bt-wake-box')">
          <span class="sr-th" id="sr-bt-h">08</span>
          <span class="sr-tsep">:</span>
          <span class="sr-tm" id="sr-bt-m">00</span>
          <input type="hidden" id="sr-bt-wake" value="08:00">
          <div id="sr-dropdown-bt" class="sr-dropdown" style="display:none"><div class="sr-dropdown-cols"><div class="sr-dropdown-col" id="sr-col-h-bt"></div><div class="sr-dropdown-col" id="sr-col-m-bt"></div></div></div>
        </div>
      </div>


      <div class="sr-field sr-offset-field">
        <label class="sr-checkbox-label">
          <input type="checkbox" id="sr-bt-offset" class="sr-checkbox">
          <span class="sr-checkmark"></span>
          <span class="sr-checkbox-text"><input type="number" id="sr-bt-offset-min" class="sr-offset-input" value="14" min="1" max="120"> Minuten Einschlafzeit einrechnen</span>
          <span class="sr-info" data-tip="Durchschnittlich dauert es 14 Minuten bis man einschläft.">i</span>
        </label>
      </div>
      <button class="sr-btn" onclick="srCalcBedTime()">BERECHNEN</button>
      <div class="sr-results" id="sr-bt-results" style="display:none"></div>
      <button class="sr-reset-btn" id="sr-bt-reset" onclick="srReset('bt')" style="display:none">↺ Zurücksetzen</button>
    </div>

  </div>
</div>

