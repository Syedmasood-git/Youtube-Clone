const apiKey="AIzaSyC2_Eo5RtiAHKmflW8ZuzPxX0OQMS3Nbg0";
const baseUrl="https://www.googleapis.com/youtube/v3";

const searchInput=document.getElementById("search-input");
const searchButton=document.getElementById("search-button")
const container=document.getElementById("container")

function calculateTheTimeGap(publishTime) {
    let publishDate = new Date(publishTime);
    let currentDate = new Date();
  
    let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;
    // console.log(secondsGap);
    const secondsPerDay = 24 * 60 * 60;
    const secondsPerWeek = 7 * secondsPerDay;
    const secondsPerMonth = 30 * secondsPerDay;
    const secondsPerYear = 365 * secondsPerDay;
  
    if (secondsGap < secondsPerDay) {
      return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
    }
    if (secondsGap < secondsPerWeek) {
      return `${Math.ceil(secondsGap / secondsPerWeek)} week ago`;
    }
    if (secondsGap < secondsPerMonth) {
      return `${Math.ceil(secondsGap / secondsPerMonth)} month ago`;
    }
    return `${Math.ceil(secondsGap / secondsPerYear)} year ago`;
  }
// this will take videoID and returns stats of that video
async function getVideoStatistics(videoId) {
    const endpoint = `${baseUrl}/videos?&part=statistics&id=${videoId}&key=${apiKey}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      console.log(result.items);
      return result.items; 
    } catch (error) {
      alert("Failed to fetch Statistics for ", videoId);
    }
  }
function getViews(views) {
  if (views >= 1000000000) {
    return (views / 1000000000).toFixed(1) + 'b';
  } else if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'm';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k';
  } else {
    return views.toString();
  }
}
function navigateTovideoDetails(videoId){
  document.cookie=`id=${videoId.statistics[0].id}; path=/play-video.html`;
  window.location.href="http://127.0.0.1:5500/play-video.html"
}
function renderVideosOntoUI(videosList){
  console.log(videosList);
    videosList.forEach((video)=>{
        const videoContainer=document.createElement('div');
        videoContainer.className='video';
        videoContainer.innerHTML=`
        <img class="thumbnail" src="${video.snippet.thumbnails.high.url}" />
        <div class="bottom-container">
          <div class="logo-container">
            <img class="logo-vid" src="${video.channelLogo}" />
          </div>
          <div class="title-container">
          <div class=titleover>
            <p class="title">
              ${video.snippet.title}
            </p>
            </div>
            <p class="gray-text">${video.snippet.channelTitle}</p>
            <p class="gray-text">${getViews(video.statistics[0].statistics.viewCount)} views . ${calculateTheTimeGap(video.snippet.publishedAt)}</p>
          </div>
        </div>`
        container.appendChild(videoContainer)
        console.log(video);
      videoContainer.addEventListener('click',()=>{
        // console.log(video);
        navigateTovideoDetails(video);
      })
    })
}

async function fetchChannelLogo(channelId){
  const endpoint=`${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`
  try{
    const response=await fetch(endpoint);
    const result=await response.json();
    // console.log(result.items[0]);
    return result.items[0].snippet.thumbnails.high.url;
  }
  catch(error){
    console.log("error",channelId);
  }
}
async function fetchSearchResults(searchString){
    //Searches the given string
    container.innerHTML=''
    const endpoint=`${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`
    // const endpoint=`${baseUrl}/videos?key=${apiKey}&chart=mostPopular&part=snippet&maxResults=20`
    try{
        const response=await fetch(endpoint);
        const result=await response.json();
        // console.log(result);
        for(let i=0;i<result.items.length;i++){
          let currentVideoId=result.items[i].id.videoId;
          let channelId=result.items[i].snippet.channelId;
          const currentVideoStatistics=await getVideoStatistics(currentVideoId);
          const channelLogo=await fetchChannelLogo(channelId)
          result.items[i].statistics=currentVideoStatistics;
          result.items[i].channelLogo=channelLogo;
        //   // console.log(result.items[i].statistics.viewCount);
        console.log(result.items);
      }
      
      console.log(result.items);
        renderVideosOntoUI(result.items);
        
    }
    catch(error){
        alert("some error occured");
    }
}
/**
 * 
 * {
    "kind": "youtube#searchResult",
    "etag": "Dn_HjQZj7iXCRkRlNQXL3xxXTxE",
    "id": {
        "kind": "youtube#video",
        "videoId": "_O_9HUZvJK4"
    },
    "snippet": {
        "publishedAt": "2023-07-31T13:18:46Z",
        "channelId": "UCJsApDpIBPpRRg0n9ZVmKAQ",
        "title": "Weather obsession of Bangalore people📈🤣 #shorts #ahmedmasood #bangalore #ytshorts",
        "description": "",
        "thumbnails": {
            "default": {
                "url": "https://i.ytimg.com/vi/_O_9HUZvJK4/default.jpg",
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": "https://i.ytimg.com/vi/_O_9HUZvJK4/mqdefault.jpg",
                "width": 320,
                "height": 180
            },
            "high": {
                "url": "https://i.ytimg.com/vi/_O_9HUZvJK4/hqdefault.jpg",
                "width": 480,
                "height": 360
            }
        },
        "channelTitle": "Ahmed Masood",
        "liveBroadcastContent": "none",
        "publishTime": "2023-07-31T13:18:46Z"
    }
}
 */
async function fetchResults(){
  //Searches the given string
  container.innerHTML=''
  // const endpoint=`${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=5`
  const endpoint=`${baseUrl}/videos?key=${apiKey}&chart=mostPopular&part=snippet&maxResults=20`
  try{
      const response=await fetch(endpoint);
      const result=await response.json();
      // console.log(result);
      for(let i=0;i<result.items.length;i++){
        let currentVideoId=result.items[i].id;
        let channelId=result.items[i].snippet.channelId;
        const currentVideoStatistics=await getVideoStatistics(currentVideoId);
        const channelLogo=await fetchChannelLogo(channelId)
        result.items[i].statistics=currentVideoStatistics;
        result.items[i].channelLogo=channelLogo;
      //   // console.log(result.items[i].statistics.viewCount);
    }
    // console.log(result.items);
      renderVideosOntoUI(result.items);
  }
  catch(error){
      alert("some error occured");
  }
}





searchButton.addEventListener("click",()=>{
    const searchValue=searchInput.value;
    fetchSearchResults(searchValue);
    // homePage(searchValue);
})
// homePage("");
fetchResults("");
// getVideoStatistics("K_dIbWJMNO4");