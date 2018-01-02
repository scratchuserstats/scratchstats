function getUser() {
  var listofads = ["Formulate_ADD.jpg","mason-ad.jpg"];
document.getElementById("ad1").src = "https://scratchstats.cf/ads/" + listofads[Math.round(Math.random())>0.5?0:1];
    if(location.hash===""){
        userStatsUpdate("griffpatch");
    }
    else {
        username = location.hash.substring(1);
        userStatsUpdate(username);
    }
}

function newUser(){
    swal({
        title: 'Enter a Scratch Username',
        type: 'warning',
        html: '<br><input id="in" value="griffpatch" placeholder="griffpatch"autofocus/> ',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Get stats'
    }).then(function () {
        username = document.getElementById('in').value;
        if(username.startsWith("@")){username=username.substring(1);}
        window.location="https://scratchstats.cf/#"+username;
        location.reload();
    });
    document.getElementById('in').select();
    document.getElementById('in').focus();
}

function copy() {
copyTextToClipboard("http://scratchstats.cf/"+username);
}

function copy(text) {
copyTextToClipboard(text);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
var modal = document.getElementById('myModal');
    modal.style.display = "block";

var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}
}

function userStatsUpdate(user) {
    username = user;
    document.getElementById("reactions").src="https://emojireact.com/embed?emojis=grinning,joy,open_mouth,slight_smile,thumbsup&url="+"scratchstats.cf/"+username;
    console.log(username);
    sendAPIreq();
    messageCount();
    document.getElementById("year").onchange=averagePer;
}

// SendAPIreq -> getIcon & getID & getJoinDate & followers
// Followers -> avgFollows
// getJoinDate -> projectStats -> activity & averagePer

//
function sendAPIreq(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username + "?" + Math.floor(Date.now() / 1000), true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            getIcon(response);
            getID(response);
            getJoinDate(response);
            getCountryFlag(response);
        }
        if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
        newUser();
        }
    };
}

function getIcon(response){ // ga.js and username
    var obj = JSON.parse(response);
    var src= 'https://cdn2.scratch.mit.edu/get_image/user/'+obj.id+'_60x60.png';
    console.log(src);
    document.getElementById('icon').src = src;
    document.getElementById('user').innerHTML =  "@" + obj.username+ "</a>";
    username = obj.username;
    ga('set', 'page', '/user/#'+obj.username);
    ga('send', 'pageview');
}

function getID(response){
    var obj = JSON.parse(response);
    document.getElementById('id').innerHTML = obj.id;
}

function getJoinDate(response){
    var obj = JSON.parse(response);
    document.getElementById("joined").innerHTML = (obj.history.joined).substring(0, obj.history.joined.indexOf('T')) + " " + obj.history.joined.substring(11,19) + " <small>(" + moment(new Date(obj.history.joined).valueOf()).fromNow() + ")</small>";
    divideperyear = (Math.floor(Date.now() / 1000)-new Date(obj.history.joined).valueOf()/1000)/31556952
    projectStats();
	messagesRead(obj);
}

function getCountryFlag(response){
  var country = JSON.parse(response).profile.country;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET','https://restcountries.eu/rest/v2/name/'+country,true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        var response = JSON.parse(xmlhttp.responseText);
        console.log(JSON.stringify(response));
        document.getElementById("flag").innerHTML="<img src='"+response[response.length-1].flag+"' width='58'>";
        document.getElementById("flagquestion").innerHTML+= ": "+response[response.length-1].alpha2Code;
      }
      if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
        document.getElementById("flag").innerHTML="?";
      };
    };
}

function messageCount() {
	var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET','https://api.scratch.mit.edu/proxy/users/'+username+'/activity/count',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var response = xmlhttp.responseText;
                var obj = JSON.parse(response);
                document.getElementById('messageCount').innerHTML = c(obj.msg_count);
            }
        };
}

function activity() {
    var activity = new XMLHttpRequest();
    activity.open('GET', 'https://scratch.mit.edu/messages/ajax/user-activity/?user=' + username + '&max=1000000', true);
    activity.send();
    activity.onreadystatechange = function() {
        if (activity.readyState === 4 && activity.status === 200) {
            var responseactivity  = activity.responseText;
            var countloves = (responseactivity.match(/icon-xs black love/g) || []).length;
            var countfaves = (responseactivity.match(/icon-xs black favorite/g) || []).length;
			      var countstudiofollows = (responseactivity.match(/is now following the studio/g) || []).length;
			      var countfollows = (responseactivity.match(/is now following/g) || []).length-countstudiofollows;
			      var countcurations = (responseactivity.match(/became a curator of/g) || []).length;
			      var countshares = (responseactivity.match(/shared the project/g) || []).length;
			      var countactivity = (responseactivity.match(/<li>/g) || []).length;


            document.getElementById("amtLoved").innerHTML = (countloves===20?"20+":countloves)+"💖 ";
            document.getElementById("amtFaved").innerHTML = (countfaves===20?"20+":countfaves)+"⭐ ";
            document.getElementById("amtActivity").innerHTML = countactivity;

            if(countloves!==(responseactivity.match(/loved/g) || []))
            {
              document.getElementById("amtFollowed").innerHTML = "?";
              document.getElementById("amtStudiosFollowed").innerHTML = "?";
              document.getElementById("amtCurated").innerHTML = "?";
              document.getElementById("amtShared").innerHTML = "?";
              return;
            }

            document.getElementById("amtFollowed").innerHTML = countfollows===0?"0":countfollows;
            document.getElementById("amtStudiosFollowed").innerHTML = countstudiofollows===0?"0":countstudiofollows;
            document.getElementById("amtCurated").innerHTML = countcurations===0?"0":countcurations;
            document.getElementById("amtShared").innerHTML = countshares===0?"0":countshares;
        }};
}

var totalProjects = 0;
var offset = 0;
var totalViews = 0;
var totalLoves = 0;
var totalFaves = 0;
var totalComments = 0;
var mostViewedNum = -1;
var mostViewedLoves = -1;
var mostViewedFaves = -1;
var mostViewedComments = -1;
var mostViewedLikes = -1;
var mostLovedNum = -1;
var mostLovedViews = -1;
var mostLovedFaves = -1;
var mostLovedLikes = -1;
var mostLovedComments = -1;
var mostCommentedNum  = -1;
var mostCommentedViews = -1;
var mostCommentedLoves = -1;
var mostCommentedLikes = -1;
var mostComentedFaves = -1;
var mostLikedNum = -1;
var mostLikedViews = -1;
var mostLikedFaves = -1;
var mostLikedLoves = -1;
var mostLikedComments = -1;
function projectStats() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username + "/projects?offset=" + offset, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var parsedJSON = JSON.parse(xmlhttp.responseText);

            if (parsedJSON.length === 0 & offset === 0) {
				location.hash="averageProjectStats2";
				location.hash=username;
                activity();
				return;}

        if(offset===0 && parsedJSON.length !== 0)getBrowser(parsedJSON[0].id,parsedJSON.length!==1?parsedJSON[1].id:0); // Get browser & OS

            var i = 0;
            while(i < parsedJSON.length) {
                // Views
                totalViews = totalViews + Number(parsedJSON[i].stats.views);
                if (Number(parsedJSON[i].stats.views)>mostViewedNum) {
                    mostViewedID = parsedJSON[i].id;
                    mostViewedTitle =  parsedJSON[i].title.substring(0,21)
                    mostViewedNum = parsedJSON[i].stats.views;
                    mostViewedImg = parsedJSON[i].image;
                    mostViewedFaves = parsedJSON[i].stats.favorites;
                    mostViewedLoves = parsedJSON[i].stats.loves;
                    mostViewedComments = parsedJSON[i].stats.comments;
                    mostViewedLikes = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                    mostViewedLikes = mostViewedLikes.toFixed();
                }
                //
                // Loves
                totalLoves = totalLoves + Number(parsedJSON[i].stats.loves);
                if (Number(parsedJSON[i].stats.loves)>mostLovedNum) {
                    mostLovedID = parsedJSON[i].id;
                    mostLovedTitle =  parsedJSON[i].title.substring(0,21)
                    mostLovedNum = parsedJSON[i].stats.loves;
                    mostLovedImg = parsedJSON[i].image;
                    mostLovedFaves = parsedJSON[i].stats.favorites;
                    mostLovedViews = parsedJSON[i].stats.views;
                    mostLovedComments = parsedJSON[i].stats.comments;
                    mostLovedLikes = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                    mostLovedLikes = mostLovedLikes.toFixed();
                }
                //
                // Faves
                totalFaves = totalFaves + Number(parsedJSON[i].stats.favorites);
                //
                // Comments
                totalComments = totalComments + Number(parsedJSON[i].stats.comments);
                if (Number(parsedJSON[i].stats.comments)>mostCommentedNum) {
                    mostCommentedID = parsedJSON[i].id;
                    mostCommentedTitle = parsedJSON[i].title.substring(0,21)
                    mostCommentedNum = parsedJSON[i].stats.comments;
                    mostCommentedImg = parsedJSON[i].image;
                    mostCommentedFaves = parsedJSON[i].stats.favorites;
                    mostCommentedViews = parsedJSON[i].stats.views;
                    mostCommentedLoves = parsedJSON[i].stats.loves;
                    mostCommentedLikes = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                    mostCommentedLikes = mostCommentedLikes.toFixed();
                }
                //
                // Love-View ratio
                var ratio = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                if (ratio>mostLikedNum) {
                    mostLikedID = parsedJSON[i].id;
                    mostLikedTitle = parsedJSON[i].title.substring(0,21)
                    mostLikedNum = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                    mostLikedNum = mostLikedNum.toFixed();
                    mostLikedImg = parsedJSON[i].image;
                    mostLikedFaves = parsedJSON[i].stats.favorites;
                    mostLikedViews = parsedJSON[i].stats.views;
                    mostLikedLoves = parsedJSON[i].stats.loves;
                    mostLikedComments = parsedJSON[i].stats.comments;
                }
                //
                totalProjects++;
                i++;
            }

            if (parsedJSON.length === 20) {
                offset = offset+20;
                setTimeout(function(){projectStats(); }, 200);}
            else {
                showProjectStats();
            }
        }};
}

function showProjectStats(){

    activity();
    averagePer();

    document.getElementById("mostLoved").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostLovedID+"/' class='projTitle' target='blank'>"+mostLovedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostLovedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics'style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics' style='font-weight:bold;'>💖"+c(mostLovedNum)+"</li><li class='statistics' style='font-weight:bold;'>⭐"+c(mostLovedFaves)+"</li><li class='statistics'>👍"+mostLovedLikes+"%</li><li class='statistics'>👁️"+c(mostLovedViews)+"</li><li class='statistics'>💬"+c(mostLovedComments)+"</li></ul></td></table>";
    document.getElementById("mostLiked").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostLikedID+"/' class='projTitle' target='blank'>"+mostLikedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostLikedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics' >💖"+c(mostLikedLoves)+"</li><li class='statistics'>⭐"+c(mostLikedFaves)+"</li><li class='statistics' style='font-weight:bold;'>👍"+mostLikedNum+"%</li><li class='statistics'>👁️"+c(mostLikedViews)+"</li><li class='statistics'>💬"+c(mostLikedComments)+"</li></ul></td></table>";
    document.getElementById("mostViewed").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostViewedID+"/' class='projTitle' target='blank'>"+mostViewedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostViewedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖"+c(mostViewedLoves)+"</li><li class='statistics'>⭐"+c(mostViewedFaves)+"</li><li class='statistics'>👍"+mostViewedLikes+"%</li><li class='statistics' style='font-weight:bold;'>👁️"+c(mostViewedNum)+"</li><li class='statistics'>💬"+c(mostViewedComments)+"</li></ul></td></table>";
    document.getElementById("mostCommented").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostCommentedID+"/' class='projTitle' target='blank'>"+mostCommentedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostCommentedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul  class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖"+c(mostCommentedLoves)+"</li><li class='statistics'>⭐"+c(mostCommentedFaves)+"</li><li class='statistics'>👍"+mostCommentedLikes+"%</li><li class='statistics'>👁️"+c(mostCommentedViews)+"</li><li class='statistics' style='font-weight:bold;'>💬"+c(mostCommentedNum)+"</li></ul></td></table>";

    averageLoves = totalLoves/totalProjects;
    averageFaves = totalFaves/totalProjects;
    averageViews = totalViews/totalProjects;
    averageComments = totalComments/totalProjects;
    averageLikes = Number(totalLoves)/Number(totalViews)*100;

    document.getElementById("averageLoves").innerHTML = "💖 " + c(averageLoves.toFixed());
    document.getElementById("averageFaves").innerHTML = "⭐ " + c(averageFaves.toFixed());
    document.getElementById("averageViews").innerHTML = "👁️ " + c(averageViews.toFixed());
    document.getElementById("averageCommented").innerHTML = "💬 " + c(averageComments.toFixed());
    document.getElementById("averageLiked").innerHTML = "👍 " + c(averageLikes.toFixed())+"%";
}

function averagePer() {

console.log(divideperyear);

    if(divideperyear<1&&document.getElementById("yearoption")){document.getElementById("yearoption").remove();}
    if(divideperyear<0.083&&document.getElementById("monthoption")){document.getElementById("monthoption").remove();}

    lovesPerYear = totalLoves/divideperyear;
    lovesPerYear = c(lovesPerYear.toFixed());
    favesPerYear = totalFaves/divideperyear;
    favesPerYear = c(favesPerYear.toFixed());
    viewsPerYear = totalViews/divideperyear;
    viewsPerYear = c(viewsPerYear.toFixed());
    commentsPerYear = totalComments/divideperyear;
    commentsPerYear = c(commentsPerYear.toFixed());

    lovesPerMonth = totalLoves/divideperyear/12;
    lovesPerMonth = c(lovesPerMonth.toFixed());
    favesPerMonth = totalFaves/divideperyear/12;
    favesPerMonth = c(favesPerMonth.toFixed());
    viewsPerMonth = totalViews/divideperyear/12;
    viewsPerMonth = c(viewsPerMonth.toFixed());
    commentsPerMonth = totalComments/divideperyear/12;
    commentsPerMonth = c(commentsPerMonth.toFixed());

    lovesPerDay = totalLoves/divideperyear/12/30.44;
    lovesPerDay = c(lovesPerDay.toFixed());
    favesPerDay = totalFaves/divideperyear/12/30.44;
    favesPerDay = c(favesPerDay.toFixed());
    viewsPerDay = totalViews/divideperyear/12/30.44;
    viewsPerDay = c(viewsPerDay.toFixed());
    commentsPerDay = totalComments/divideperyear/12/30.44;
    commentsPerDay = c(commentsPerDay.toFixed());

    if(document.getElementById("year").value==="year"){
        document.getElementById("averageTotalLoves").innerHTML = "💖 " + lovesPerYear;
        document.getElementById("averageTotalFaves").innerHTML = "⭐ " + favesPerYear;
        document.getElementById("averageTotalViews").innerHTML = "👁️ " + viewsPerYear;
        document.getElementById("averageTotalCommented").innerHTML = "💬 " + commentsPerYear;
    }

    if(document.getElementById("year").value==="month"){
        document.getElementById("averageTotalLoves").innerHTML = "💖 " + lovesPerMonth;
        document.getElementById("averageTotalFaves").innerHTML = "⭐ " + favesPerMonth;
        document.getElementById("averageTotalViews").innerHTML = "👁️ " + viewsPerMonth;
        document.getElementById("averageTotalCommented").innerHTML = "💬 " + commentsPerMonth;
    }

    if(document.getElementById("year").value==="day"){
        document.getElementById("averageTotalLoves").innerHTML = "💖 " + lovesPerDay;
        document.getElementById("averageTotalFaves").innerHTML = "⭐ " + favesPerDay;
        document.getElementById("averageTotalViews").innerHTML = "👁️ " + viewsPerDay;
        document.getElementById("averageTotalCommented").innerHTML = "💬 " + commentsPerDay;
    }

    if(document.getElementById("year").value==="total"){
    document.getElementById("averageTotalLoves").innerHTML = "💖 " + c(totalLoves);
    document.getElementById("averageTotalFaves").innerHTML = "⭐ " + c(totalFaves);
    document.getElementById("averageTotalViews").innerHTML = "👁️ " + c(totalViews);
    document.getElementById("averageTotalCommented").innerHTML = "💬 " + c(totalComments);
	}

}

function messagesRead(obj) {
	if(obj.history.lastReadMessages===null){
		document.getElementById("messagesRead").innerHTML = "?"
	}
	else {
	var timeago = moment(new Date(obj.history.lastReadMessages).valueOf()).fromNow();
	document.getElementById("messagesRead").innerHTML = "<span title='"+obj.history.lastReadMessages.replace("T"," ").replace(".000Z"," UTC")+"'>"+timeago+"</span>";
	}
}

function getBrowser(id,id2){
    checkua = new XMLHttpRequest();
    checkua.open("GET", 'https://cdn.projects.scratch.mit.edu/internalapi/project/' + id + '/get/', true);
    checkua.send();
    checkua.onreadystatechange = function() {
                if (checkua.readyState === 4 && checkua.status === 200) {
        useragent = JSON.parse(checkua.responseText).info.userAgent;
        if(useragent===undefined){
          if(id2!==0)getBrowser(id2,0);
          document.getElementById("browser").innerHTML = "?";
          document.getElementById("OS").innerHTML = "?";
          return;
        }
        getinfo = new XMLHttpRequest();
        getinfo.open("GET", 'https://helloacm.com/api/parse-user-agent/?s=' + encodeURI(useragent), true);
        getinfo.send();
        getinfo.onreadystatechange = function() {
                    if (getinfo.readyState === 4 && getinfo.status === 200) {
            document.getElementById("browser").innerHTML = JSON.parse(getinfo.responseText).browser;
        getinfo = new XMLHttpRequest();
        getinfo.open("GET", 'https://cors-anywhere.herokuapp.com/http://www.useragentstring.com/?uas=' + encodeURI(useragent) + "&getJSON=os_name", true);
        getinfo.send();
        getinfo.onreadystatechange = function() {
                  if (getinfo.readyState === 4 && getinfo.status === 200) {
                      document.getElementById("OS").innerHTML= JSON.parse(getinfo.responseText).os_name;
                              }
                            };
}
}
};
};
}

function c(x) { // Add comma
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
