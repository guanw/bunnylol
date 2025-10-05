chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getLocation') {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendResponse({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        sendResponse(null);
      }
    );
    return true; // keeps message channel open
  }
});
