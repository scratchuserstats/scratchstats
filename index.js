
function getUser() {
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
        window.location="http://scratchstats.cf/#"+username;
        location.reload();
    });
    document.getElementById('in').select();
    document.getElementById('in').focus();
}

function copy() {
copyTextToClipboard("http://scratchstats.cf/#"+username);
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
   document.getElementById("bodyTextModal").innerHTML = "<a class='modal-a'href='"+window.location.href+"'>"+window.location.href +"</a>&nbsp;" + document.getElementById("bodyTextModal").innerHTML;
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
    following();
    messageCount();
    document.getElementById("year").onchange=averagePer;
}

// SendAPIreq -> getIcon & getID & getJoinDate & followers
// Followers -> avgFollows
// getJoinDate -> projectStats -> activity & averagePer

//
function sendAPIreq(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            getIcon(response);
            getID(response);
            followers(response);
            getJoinDate(response);
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
    ga('set', 'page', '/user/#'+obj.username);		
    ga('send', 'pageview');
}

function getID(response){
    var obj = JSON.parse(response);
    document.getElementById('id').innerHTML = obj.id;
}

function getJoinDate(response){
    var obj = JSON.parse(response);
    document.getElementById("joined").innerHTML = (obj.history.joined).substring(0, obj.history.joined.indexOf('T'));
    divideperyear = (Math.floor(Date.now() / 1000)-new Date(obj.history.joined).valueOf()/1000)/31556952
    projectStats();
}

function followers(responseforavg) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/followers/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            var followersnum = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];
            document.getElementById("followers").innerHTML = c(followersnum);
            avgFollows(followersnum,responseforavg);
        }
    };

}

function avgFollows(followersnum,response) {
    var obj = JSON.parse(response);
    var year = (Math.floor(Date.now() / 1000)-new Date(obj.history.joined).valueOf()/1000)/31556952;
    var avgFollowsPerYear = followersnum/((Math.floor(Date.now() / 1000)-new Date(obj.history.joined).valueOf()/1000)/31556952);
    var avgFollowsPerMonth = avgFollowsPerYear / 12;
    var avgFollowsPerDay = avgFollowsPerMonth / 30.44;
    var avgFollowsPerHour = avgFollowsPerDay / 24;
    console.log(avgFollowsPerYear);

    avgFollowsPerYear = c(Number(avgFollowsPerYear.toFixed(0)));
    avgFollowsPerMonth = c(Number(avgFollowsPerMonth.toFixed(1)));
    avgFollowsPerDay = c(Number(avgFollowsPerDay.toFixed(1)));
    avgFollowsPerHour = c(Number(avgFollowsPerHour.toFixed(2)));

    document.getElementById('avgFollowersYear').innerHTML = c(avgFollowsPerYear);
    document.getElementById('avgFollowersHour').innerHTML = c(avgFollowsPerHour);
    document.getElementById('avgFollowersDay').innerHTML = c(avgFollowsPerDay);
    document.getElementById('avgFollowersMonth').innerHTML = c(avgFollowsPerMonth);
}
//

function following(followersnum) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/following/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            var following = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];
            document.getElementById("following").innerHTML = c(following);
        }
    };

}

function messageCount() {
    if (username.toLowerCase() !== "griffpatch"){
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
    else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET','https://api.scratch.mit.edu/proxy/users/griffpatch/activity/count?'+Math.floor(Date.now() / 1000),true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var response = xmlhttp.responseText;
                var obj = JSON.parse(response);
                document.getElementById('messageCount').innerHTML = c(obj.msg_count);
            }
        };
    }
}

function activity() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/messages/ajax/user-activity/?user=' + username + '&max=1000000', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var responseactivity  = xmlhttp.responseText;
            var countloves = (responseactivity.match(/icon-xs black love/g) || []).length;
            document.getElementById("amtOfLovedProjects").innerHTML = countloves===20?"20+":countloves;
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

            if (parsedJSON.length === 0 & offset !== 0) {showProjectStats();}
            if (parsedJSON.length === 0 & offset === 0) {
                document.getElementById("mostProjectStats").remove();
                document.getElementById("averageProjectStats").remove();
                document.getElementById("totalProjectStats").remove();
                document.getElementById("averageProjectStats").remove();
                var y = 0;
                while(y<12){
                    document.getElementsByTagName("BR")[6].remove();
                    y++;
                }
                activity();
                avgFollows();}

            var i = 0;
            while(i < parsedJSON.length) {
                // Views
                totalViews = totalViews + Number(parsedJSON[i].stats.views);
                if (Number(parsedJSON[i].stats.views)>mostViewedNum) {
                    mostViewedID = parsedJSON[i].id;
                    mostViewedTitle =  parsedJSON[i].title.length>20 ?  parsedJSON[i].title.substring(0,20)+"..." : parsedJSON[i].title;
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
                    mostLovedTitle =  parsedJSON[i].title.length>20 ?  parsedJSON[i].title.substring(0,20)+"..." : parsedJSON[i].title;
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
                    mostCommentedTitle = parsedJSON[i].title.length>20 ?  parsedJSON[i].title.substring(0,20)+"..." : parsedJSON[i].title;
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
                    mostLikedTitle = parsedJSON[i].title.length>20 ?  parsedJSON[i].title.substring(0,20)+"..." : parsedJSON[i].title;
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

    document.getElementById("mostLoved").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostLovedID+"/' class='projTitle' target='blank'>"+mostLovedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostLovedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics'style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics' style='color:red;'>💖"+c(mostLovedNum)+"</li><li class='statistics' style='color:red;'>⭐"+c(mostLovedFaves)+"</li><li class='statistics'>👍"+mostLovedLikes+"%</li><li class='statistics'>👁️"+c(mostLovedViews)+"</li><li class='statistics'>💬"+c(mostLovedComments)+"</li></ul></td></table>";
    document.getElementById("mostLiked").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostLikedID+"/' class='projTitle' target='blank'>"+mostLikedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostLikedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics' >💖"+c(mostLikedLoves)+"</li><li class='statistics'>⭐"+c(mostLikedFaves)+"</li><li class='statistics' style='color:red;'>👍"+mostLikedNum+"%</li><li class='statistics'>👁️"+c(mostLikedViews)+"</li><li class='statistics'>💬"+c(mostLikedComments)+"</li></ul></td></table>";
    document.getElementById("mostViewed").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostViewedID+"/' class='projTitle' target='blank'>"+mostViewedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostViewedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖"+c(mostViewedLoves)+"</li><li class='statistics'>⭐"+c(mostViewedFaves)+"</li><li class='statistics'>👍"+mostViewedLikes+"%</li><li class='statistics' style='color:red;'>👁️"+c(mostViewedNum)+"</li><li class='statistics'>💬"+c(mostViewedComments)+"</li></ul></td></table>";
    document.getElementById("mostCommented").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostCommentedID+"/' class='projTitle' target='blank'>"+mostCommentedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostCommentedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul  class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖"+c(mostCommentedLoves)+"</li><li class='statistics'>⭐"+c(mostCommentedFaves)+"</li><li class='statistics'>👍"+mostCommentedLikes+"%</li><li class='statistics'>👁️"+c(mostCommentedViews)+"</li><li class='statistics' style='color:red;'>💬"+c(mostCommentedNum)+"</li></ul></td></table>";

    averageLoves = totalLoves/totalProjects;
    averageFaves = totalFaves/totalProjects;
    averageViews = totalViews/totalProjects;
    averageComments = totalComments/totalProjects;
    averageLikes = Number(totalLoves)/Number(totalViews)*100;

    document.getElementById("averageLoves").innerHTML = "💖 " + c(averageLoves.toFixed());
    document.getElementById("averageFaves").innerHTML = "⭐ " + c(averageFaves.toFixed());
    document.getElementById("averageViews").innerHTML = "👁️ " + c(averageViews.toFixed());
    document.getElementById("averageCommented").innerHTML = "💬 " + c(averageComments.toFixed());
    document.getElementById("averageLiked").innerHTML = "<span title=\"Love-view ratio\">👍 " + c(averageLikes.toFixed())+"%</span>";

    document.getElementById("totalLoves").innerHTML = "💖 " + c(totalLoves);
    document.getElementById("totalFaves").innerHTML = "⭐ " + c(totalFaves);
    document.getElementById("totalViews").innerHTML = "👁️ " + c(totalViews);
    document.getElementById("totalComments").innerHTML = "💬 " + c(totalComments);
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
}

function c(x) { // Add comma
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
