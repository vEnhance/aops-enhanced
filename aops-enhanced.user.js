// ==UserScript==
// @name        AoPS Enhanced (WIP Rewrite)
// @namespace   https://gitlab.com/epiccakeking
// @match       https://artofproblemsolving.com/*
// @grant       none
// @version     5.99.7
// @author      epiccakeking
// @description Work in progress AoPS Enhanced rewrite
// @license     MIT
// ==/UserScript==

const QUOTE_SCHEMES = {
  enhanced: function () { this.topic.appendToReply("[quote name=\"" + this.model.get("username") + "\" url=\"/community/p" + this.model.get("post_id") + "\"]\n" + this.model.get("post_canonical").trim() + "\n[/quote]\n\n") },
  link: function () { this.topic.appendToReply(`@[url=https://aops.com/community/p${this.model.get("post_id")}]${this.model.get("username")} (#${this.model.get("post_number")}):[/url]`); },
  hide: function () {
    this.topic.appendToReply(`[hide=Post #${this.model.get("post_number")} by ${this.model.get("username")}]
[url=https://aops.com/user/${this.model.get("poster_id")}]${this.model.get('username')}[/url] [url=https://aops.com/community/p${this.model.get("post_id")}](view original)[/url]
${this.model.get('post_canonical').trim()}
[/hide]

`);
  },
};

function get_enhanced_setting(setting) {
  let ENHANCED_DEFAULTS = {
    enhanced_notifications: true,
    enhanced_post_links: true,
    enhanced_quote: 'enhanced',
  };
  let value = localStorage.getItem(setting);
  if (value === null) return ENHANCED_DEFAULTS[setting];
  return JSON.parse(value);
}

function set_enhanced_setting(setting, value) {
  localStorage.setItem(setting, JSON.stringify(value))
}

function show_enhanced_configurator() {
  // AoPS already has a decent HTML popup system, why reinvent the wheel.
  alert(`<form id='enhanced_settings'>
<label><input name='enhanced_notifications' type='checkbox'> Notifications</label><br>
<label><input name='enhanced_post_links' type='checkbox'> Easy post links</label><br>
<label>Quote mode <select name='enhanced_quote'>
<option value='aops'>AoPS Default/option>
<option value='enhanced'>Enhanced</option>
<option value='link'>Link</option>
<option value='hide'>Hide</option>
</select></label><br>
</form>`);
  for (element of document.getElementById('enhanced_settings').querySelectorAll('[name^=enhanced_]')) {
    if (element.nodeName == 'INPUT' && element.getAttribute('type') == 'checkbox') {
      element.checked = get_enhanced_setting(element.getAttribute('name'));
      element.addEventListener('change', e => set_enhanced_setting(e.target.getAttribute('name'), e.target.checked));
    } else {
      element.value = get_enhanced_setting(element.getAttribute('name'));
      element.addEventListener('change', e => set_enhanced_setting(e.target.getAttribute('name'), e.target.value));
    }
  }
}

(el => {
  if (el === null) return;
  let enhanced_settings_element = document.createElement('a');
  enhanced_settings_element.classList.add('menu-item');
  enhanced_settings_element.innerText = 'Enhanced';
  enhanced_settings_element.addEventListener('click', e => { e.preventDefault(); show_enhanced_configurator(); });
  el.appendChild(enhanced_settings_element);
})(document.querySelector('.login-dropdown-content'));

// Prevent errors when trying to modify AoPS Community on pages where it doesn't exist
if (AoPS.Community) {
  // Quotes
  (quote_scheme => {
    if (quote_scheme != 'aops') AoPS.Community.Views.Post.prototype.onClickQuote = QUOTE_SCHEMES[quote_scheme];
  })(get_enhanced_setting('enhanced_quote'));

  // Notifications
  if (get_enhanced_setting('enhanced_notifications')) {
    if (Notification.permission == 'granted') {
      AoPS.Ui.Flyout.display = a => {
        var textextract = document.createElement("div");
        textextract.innerHTML = a.replace('<br>', '\n');
        var y = $(textextract).text()
        var notification = new Notification("AoPS Enhanced", { body: y, icon: 'https://artofproblemsolving.com/online-favicon.ico', tag: y });
        setTimeout(notification.close.bind(notification), 5000);
      }
    } else {
      setTimeout(() => alert("Please grant permission to send notifications or turn off notifications at https://artofproblemsolving.com/enhancedsettings"), 1000)
      document.onclick = () => Notification.requestPermission();
    }
  }

  // Direct linking
  if (get_enhanced_setting('enhanced_post_links')) {
    AoPS.Community.Views.Post.prototype.onClickDirectLink = function (e) {
      let url = 'https://aops.com/community/p' + this.model.get("post_id");
      navigator.clipboard.writeText(url);
      AoPS.Ui.Flyout.display(`Url copied (${url})`);
    }
  }
}