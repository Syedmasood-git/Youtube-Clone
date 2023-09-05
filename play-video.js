const apiKey="AIzaSyC2_Eo5RtiAHKmflW8ZuzPxX0OQMS3Nbg0";
const baseUrl="https://www.googleapis.com/youtube/v3";
const commentsContainer=document.getElementById("commentsContainer")
const videoname=document.getElementById("video")
const addCreator=document.getElementById("creator")
const right=document.getElementById("moreVideos")
const searchInput=document.getElementById("search-input");
const searchButton=document.getElementById("search-button")

window.addEventListener('load',()=>{
  let videoId=document.cookie.split("=")[1];
  console.log(videoId);

    if(YT){
        new YT.Player("videoPlaceholder",{
            height:"100%",
            width:"100%",
            videoId,
        });
    }
    loadComments(videoId);
    
})

async function loadComments(videoId){
    const endpoint=`${baseUrl}/commentThreads?key=${apiKey}&videoId=${videoId}&maxResult=5&part=snippet`;

    const response=await fetch(endpoint);
    const result=await response.json();
    console.log(result)
    // let videoid=result.items[0].id;
    // console.log(videoid);
    // await videoDetails(videoid);
    await videoDetails(result.items[0].snippet.videoId);
    result.items.forEach((item)=>{
        const repliesCount = item.snippet.totalReplyCount;
        const {
          authorDisplayName,
          textDisplay,
          likeCount,
          authorProfileImageUrl: profileUrl,
          publishedAt,
        } = item.snippet.topLevelComment.snippet;
        // console.log(item);
        const noOfComments=document.createElement("div")
        noOfComments.className="commentLogo";
        noOfComments.innerHTML=`
        <div class="commentLogo">
          <img
            src="${profileUrl}"
          />
        </div>
        <div cass="logoSeparate">
          <div class="comment-name">
            <p>${authorDisplayName}</p>
            <span>${calculateTheTimeGap(publishedAt)}</span>
          </div>
          <div class="commentText">
            <p>${textDisplay}</p>
          </div>
          <div class="commentLikes">
            <img src="./Assets/like.svg" />${likeCount}
            <img src="./Assets/dislike.svg" />0
            <span>REPLY</span>
          </div>
        </div>
      </div>
      `
        commentsContainer.appendChild(noOfComments);
    })
}
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
      return `${Math.ceil(secondsGap / (60 * 60))}hr ago`;
    }
    if (secondsGap < secondsPerWeek) {
      return `${Math.ceil(secondsGap / secondsPerWeek)} week ago`;
    }
    if (secondsGap < secondsPerMonth) {
      return `${Math.ceil(secondsGap / secondsPerMonth)} month ago`;
    }
    return `${Math.ceil(secondsGap / secondsPerYear)} year ago`;
  }

//    async function getVideoDetails(channelId){

//    } 
   
   
   
   function videoName(videoId){
    const name=document.createElement("div");
    console.log("video id is"+videoId[0].id);
    name.innerHTML=`
    <h3>${videoId[0].snippet.localized.title}</h3>
    <div class="viewsContainer">
      <div class="views">
        <p>${getViews(videoId[0].statistics.viewCount)} Views . ${getDate(videoId[0].snippet.publishedAt)}</p>
      </div>
      <div class="likeShare">
        <img src="./Assets/like.svg" /><span>${getViews(videoId[0].statistics.likeCount)}</span>
        <img src="./Assets/dislike.svg" /><span></span>
        <img src="./Assets/share.svg" /><span>SHARE</span>
        <img src="./Assets/addPlaylist.svg" /><span>SAVE</span>
      </div>
    </div>`
  videoname.appendChild(name);
  }
  function creatorDetails(videoId){
    const creator=document.createElement("div") 
    creator.innerHTML=`<div class="creatorDetails">
    <div class="creatorLogo">
        <img
        src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
        alt="logo"
        />
    </div>
    <div class="subscribers">
        <div class="creatorName">
            <p>${videoId.snippet.localized.title}</p>
            <p>${getViews(videoId.statistics.subscriberCount)} Subscribers</p>
        </div>
        <div class="subscribeButton">
            <button>SUBSCRIBERS</button>
        </div>
    </div>
</div>
<div class="details">
    <p>
    ${videoId.snippet.localized.description}
    </p>
    <p>Show More</p>
</div>`
addCreator.appendChild(creator)
  }
  function getViews(views) {
    if (views >= 1000000000) {
      return (views / 1000000000).toFixed(1) + 'b';
    } else if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'm';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k';
    } else {
      return views;
    }
  }
  async function videoDetails(videoId){
    const endpoint = `${baseUrl}/videos?&part=statistics,snippet&id=${videoId}&key=${apiKey}`;
    try{
        const response=await fetch(endpoint);
        const result=await response.json();
        // console.log(result);
        let currentVideoId=result.items[0].id;
        let channelId=result.items[0].snippet.channelId;
        const currentVideoStatistics=await getVideoStatistics(currentVideoId);
        const channelLogo=await fetchChannelLogo(channelId)
        result.items[0].statistics=currentVideoStatistics;
        result.items[0].channelLogo=channelLogo;

    }
    catch(error){
        console.log("error",error);
    }
  }
  async function getVideoStatistics(videoId) {
    const endpoint = `${baseUrl}/videos?&part=statistics,snippet&id=${videoId}&key=${apiKey}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      // getViews(result.items[0].statistics)
      // getViews(result)
      
    //   return result.items[0]; 
    videoName(result.items) 
    // creatorDetails(result.items)
    getDate(result.items[0].snippet.publishedAt)
    
    }
    catch(error) {
            alert("Failed to fetch Statistics for ", videoId);
    }
  }

  function getDate(publishDate){
const dateObj = new Date(publishDate);

const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);

return formattedDate;
  }


  async function fetchChannelLogo(channelId){
    const endpoint=`${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet,statistics`
    try{
      const response=await fetch(endpoint);
      const result=await response.json();
    //   console.log(result.items[0]);
      creatorDetails(result.items[0]);
      return result.items[0]
    }
    catch(error){
      console.log("error",channelId);
    }
  }


  async function fetchSearchResults(){
    //Searches the given string
    right.innerHTML=''
    // const endpoint=`${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=5`
    const endpoint=`${baseUrl}/videos?key=${apiKey}&chart=mostPopular&part=snippet,statistics&maxResults=20`
    try{    
        const response=await fetch(endpoint);
        const result=await response.json();
        renderVideosOntoUI(result.items);
    }
    catch(error){
        alert("some error occured");
    }
}
function renderVideosOntoUI(videosList){
    console.log(videosList);
      videosList.forEach((videoID)=>{
          const suggested=document.createElement('div');
          suggested.className="card"
          suggested.innerHTML=`
          <div class=moreImg>
          <img
              src="${videoID.snippet.thumbnails.high.url}"
            />
          </div>
          <div class="vidTitle">
            <div class="suggesttitle">${videoID.snippet.title}</div>
            <p>${videoID.snippet.channelTitle}</p>
            <p>${getViews(videoID.statistics.viewCount)} views . ${getDate(videoID.snippet.publishedAt)}</p>
          </div>
          </div>`
          right.appendChild(suggested)
          // console.log(video);
          console.log(videoID);
        right.addEventListener('click',()=>{
          navigateTovideoDetails(videoID.id);
        })
      })
  }
  function navigateTovideoDetails(videoId){
    document.cookie=`id=${videoId}; path=/play-video.html`;
    window.location.href="http://127.0.0.1:5500/play-video.html"
  }

  searchButton.addEventListener("click",()=>{
    const searchValue=searchInput.value;
    fetchSearchResults(searchValue);
    // homePage(searchValue);
})
// homePage("");
// getVideoStatistics("K_dIbWJMNO4");
async function fetchResults(){
  //Searches the given string
  right.innerHTML=''
  // const endpoint=`${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=5`
  const endpoint=`${baseUrl}/videos?key=${apiKey}&chart=mostPopular&part=snippet,statistics&maxResults=20`
  try{    
      const response=await fetch(endpoint);
      const result=await response.json();
      renderVideosOntoUI(result.items);
  }
  catch(error){
      alert("some error occured");
  }
}
fetchResults()
