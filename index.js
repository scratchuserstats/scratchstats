var followers;
var following;

function userStatsUpdate(username) {
    console.log(username);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var obj = JSON.parse(response);
            var src= 'https://cdn2.scratch.mit.edu/get_image/user/'+obj.id+'_60x60.png';
            console.log(src);
            document.getElementById('icon').src = src;
            document.getElementById('user').innerHTML =  "<b>@" + obj.username + "</b>" + "</a>";
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
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            followers = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];

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
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            following = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];

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
            var response = xmlhttp.responseText;
            var obj = JSON.parse(response);
            var curDate = new Date();
            var date = (obj.history.joined).substring(0, 15);
            var year = (curDate.getFullYear()) - (parseInt(date.substring(0, 5)));
            var month = parseInt(date.substring(5, 7));
            var day = parseInt(date.substring(8, 10));
            var hour = parseInt(date.substring(11, 13));
            var avgFollowsPerYear = (followers / (year + (month / 12) + (day / 365)));
            var avgFollowsPerMonth = avgFollowsPerYear / 12;
            var avgFollowsPerDay = avgFollowsPerMonth / 30;
            var avgFollowsPerHour = avgFollowsPerDay / 24;

            avgFollowsPerYear = avgFollowsPerYear.toFixed(3);
            avgFollowsPerMonth = avgFollowsPerMonth.toFixed(3);
            avgFollowsPerDay = avgFollowsPerDay.toFixed(3);
            avgFollowsPerHour = avgFollowsPerHour.toFixed(3);

            if (year < 1) {
                document.getElementById('avgFollowersYear').innerHTML = 'Error: User is newer than a year';
                if ((curDate.getUTCMonth() + 1) - month == 0) {
                    document.getElementById('avgFollowersMonth').innerHTML = 'Error: User is newer than a month';
                    if (curDate.getUTCDate() == day) {
                        document.getElementById('avgFollowersDay').innerHTML = 'Error: User is newer than a day';
                        if (curDate.getUTCHours() == hour) {
                            document.getElementById('avgFollowersDay').innerHTML = 'Error: User is newer than a hour';
                        } else {
                            document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                        }
                    } else {
                        document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                        document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
                    }
                } else if ((curDate.getUTCMonth() + 1) - month == 1) {
                    if (curDate.getUTCDate() < day) {
                        document.getElementById('avgFollowersMonth').innerHTML = 'Error: User is newer than a month';
                        document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                        document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
                    } else {
                        document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                        document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
                        document.getElementById('avgFollowersMonth').innerHTML = avgFollowsPerMonth;
                    }
                } else {
                    document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                    document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
                    document.getElementById('avgFollowersMonth').innerHTML = avgFollowsPerMonth;
                }
            } else {
                document.getElementById('avgFollowersYear').innerHTML = avgFollowsPerYear;
                document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
                document.getElementById('avgFollowersMonth').innerHTML = avgFollowsPerMonth;
            }
        }
    }
}
