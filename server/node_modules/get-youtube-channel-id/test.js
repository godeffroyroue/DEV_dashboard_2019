const getYoutubeChannelId = require('./index');

(async () => {
  let url = ''
  url = 'https://www.youtube.com/channel/UCVfTp0vAXnuDL8SSI8tPYGA'
  console.log(await getYoutubeChannelId(url))

  url = 'https://www.youtube.com/user/JustaTeeMusic'
  console.log(await getYoutubeChannelId(url))

  url = 'https://google.com'
  console.log(await getYoutubeChannelId(url))
})()
