var followers;
var following;

function userStatsUpdate (username) {
  console.log(username);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        var response = xmlhttp.responseText;
        var obj = JSON.parse(response);
        document.getElementById('user').innerHTML = "<a href= 'https://scratch.mit.edu/users/"+ obj.username + "/'>"  + "<b>@" +obj.username+"</b>"+"</a>";
      }
  }
  followers(username);
}

function followers(username) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/followers/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response  = xmlhttp.responseText;
            var find = response.search("<h2>");
            followers = response.substring(find,find+200).match(/\(([^)]+)\)/)[1];

            document.getElementById("followers").innerHTML = followers;
            following(username);
          }
    }

}

function following(username) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/following/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response  = xmlhttp.responseText;
            var find = response.search("<h2>");
            following = response.substring(find,find+200).match(/\(([^)]+)\)/)[1];

            document.getElementById("following").innerHTML = following;
            avgFollows(username);
          }
    }

}

function avgFollows(username) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response  = xmlhttp.responseText;
            var obj = JSON.parse(response);
            var curDate = new Date();
            var date = (obj.history.joined).substring(0,15);
            var year = (curDate.getFullYear()) - (parseInt(date.substring(0,5)));
            var month = parseInt(date.substring(5,7));
            var day = parseInt(date.substring(8,10));
            var hour = parseInt(date.substring(11,13));
            console.log('followers: '+followers);
            console.log('year ' + year);
            console.log('hour ' + hour);
            console.log('day ' + day);
            console.log('month ' + month);
            console.log('avgyear ' + (followers/(year + (month/12) + (day/365))));
            var avgFollowsPerYear = (followers/(year + (month/12) + (day/365)));
            var avgFollowsPerMonth = avgFollowsPerYear/12;
            var avgFollowsPerDay = avgFollowsPerMonth/30;
            var avgFollowsPerHour = avgFollowsPerDay/24 + hour/24;

            document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
            document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
            document.getElementById('avgFollowersMonth').innerHTML = avgFollowsPerMonth;
            document.getElementById('avgFollowersYear').innerHTML = avgFollowsPerYear;
          }
    }
}
