import { GOOGLE, WEATHER, CHAT, RESTAURANT } from './keywords.js';

interface Location {
  lat: number;
  lng: number;
}

function getLocation(callback: (loc: Location | null) => void): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) {
      callback(null);
      return;
    }
    chrome.tabs.sendMessage(
      tabs[0].id!,
      { type: 'getLocation' },
      (response: Location | null) => callback(response)
    );
  });
}

function openUrl(url: string): void {
  chrome.tabs.create({ url });
}

chrome.omnibox.onInputEntered.addListener((text) => {
  if (text.startsWith(GOOGLE + ' ')) {
    const query = text.substring(2);
    openUrl('https://www.google.com/search?q=' + encodeURIComponent(query));
  } else if (text.toLowerCase() === RESTAURANT) {
    getLocation((loc) => {
      if (loc) {
        openUrl(`https://www.google.com/maps/search/restaurants/@${loc.lat},${loc.lng},14z`);
      } else {
        openUrl('https://www.google.com/maps/search/restaurants+near+me');
      }
    });
  } else if (text.toLowerCase() === WEATHER) {
    getLocation((loc) => {
      if (loc) {
        openUrl(`https://weather.com/weather/today/l/${loc.lat},${loc.lng}`);
      } else {
        openUrl('https://weather.com/weather/today/');
      }
    });
  } else if (text.startsWith(CHAT + ' ')) {
    const query = text.substring(5).trim();
    const chatUrl = 'https://chat.openai.com/?q=' + encodeURIComponent(query);
    openUrl(chatUrl);
  } else {
    openUrl('https://www.google.com/search?q=' + encodeURIComponent(text));
  }
});
