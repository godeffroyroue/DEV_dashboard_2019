# Get Youtube Channel Id

Get Youtube channel ID from Youtube's URL (async/await)

## Install

```
npm install get-youtube-channel-id
```

## Usage

### parameters

| Field |          | Description   |
|-------|----------|---------------|
|`url`  | Required | Youtube's URL |


```js
const getYoutubeChannelId = require('./index');

var url = 'https://www.youtube.com/user/JustaTeeMusic';
// or var url = 'https://www.youtube.com/channel/UCVfTp0vAXnuDL8SSI8tPYGA';


var result = false;

(async function() {
  result = await getYoutubeChannelId(url);
  console.log(result);
  
  if (result !== false) {
    if (result.error) {
      console.log(`Have a error, try again`);
    } else {
      console.log(`Channel ID: ${result.id}`);
    }
  } else {
    console.log('Invalid youtube channel URL');
  }
})();


/* Result
https://www.youtube.com/user/JustaTeeMusic

{
  id: 'UC_Eqg-tBPUUvA0heBZfdu6Q',
  username: 'JustaTeeMusic',
  error: false
}

https://www.youtube.com/channel/UCVfTp0vAXnuDL8SSI8tPYGA

{
  id: 'UCVfTp0vAXnuDL8SSI8tPYGA',
  username: false,
  error: false
}

https://google.com/

false

*/
```

## License

MIT