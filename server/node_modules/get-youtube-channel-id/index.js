const r2 = require('r2');
var key = 'AIzaSyAAZ8g0P_60CEzx1gbx0Xfx4h-CeEkh_z8';

module.exports = async function getYoutubeChannelId(url) {
  var id = '';
  var username = false;
  var error = false;
  url = url.replace(/(>|<)/gi, '').split(/(\/channel\/|\/user\/)/);
  if (url[2] !== undefined) {
    id = url[2].split(/[^0-9a-z_-]/i);
    id = id[0];
  }
  if (/\/user\//.test(url)) { username = id; }
  if (!id) { return false; }

  if (username) {
    var url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${username}&key=${key}`;
    var body = await r2.get(url).json;
    if (body && body.items && body.items.length) {
      id = body.items[0].id;
    } else {
      error = true;
    }
  }
  return { id, username, error };
}
