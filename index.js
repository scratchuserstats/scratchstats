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
    };
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
            var followersnum = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];

            document.getElementById("followers").innerHTML = followersnum;
            following(username, followersnum);
        }
    };

}

function following(username, followersnum) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/following/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            var following = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];

            document.getElementById("following").innerHTML = following;
            avgFollows(username,followersnum);
        }
    };

}

function avgFollows(username,followersnum) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            // Get id
            var response = xmlhttp.responseText;
            var obj = JSON.parse(response);
            document.getElementById('id').innerHTML = c(obj.id);
            messageCount(username);
            //
            var obj = JSON.parse(response);
            var curDate = new Date();
            var date = (obj.history.joined).substring(0, 15);
            //random add miscelannous date :P
            document.getElementById("joined").innerHTML = (obj.history.joined).substring(0,9);
            var year = (curDate.getFullYear()) - (parseInt(date.substring(0, 5)));
            var month = parseInt(date.substring(5, 7));
            var day = parseInt(date.substring(8, 10));
            var hour = parseInt(date.substring(11, 13));
            var avgFollowsPerYear = (followersnum / (year + (month / 12) + (day / 365)));
            var avgFollowsPerMonth = avgFollowsPerYear / 12;
            var avgFollowsPerDay = avgFollowsPerMonth / 30;
            var avgFollowsPerHour = avgFollowsPerDay / 24;

            avgFollowsPerYear = avgFollowsPerYear.toFixed(0);
            avgFollowsPerMonth = avgFollowsPerMonth.toFixed(1);
            avgFollowsPerDay = avgFollowsPerDay.toFixed(1);
            avgFollowsPerHour = avgFollowsPerHour.toFixed(2);

            if (year < 1) {
                document.getElementById('avgFollowersYear').style.fontSize = "x-large";
                document.getElementById('avgFollowersYear').innerHTML = 'Error: User under one year';
                if ((curDate.getUTCMonth() + 1) - month == 0) {
                    document.getElementById('avgFollowersMonth').style.fontSize = "x-large";
                    document.getElementById('avgFollowersMonth').innerHTML = 'Error: User is newer than a month';
                    if (curDate.getUTCDate() == day) {
                        document.getElementById('avgFollowersDay').style.fontSize = "x-large";
                        document.getElementById('avgFollowersDay').innerHTML = 'Error: User is newer than a day';
                        if (curDate.getUTCHours() == hour) {
                            document.getElementById('avgFollowersHour').style.fontSize = "x-large";
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
                        document.getElementById('avgFollowersMonth').style.fontSize = "x-large";
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
            idNumber(username);
        }
    };
}

function idNumber(username) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var obj = JSON.parse(response);
            document.getElementById('id').innerHTML = obj.id;
            messageCount(username);
        }
    };
}

function messageCount(username) {
    if (username.toLowerCase() !== "griffpatch"){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET','https://api.scratch.mit.edu/users/'+username+'/messages/count',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var response = xmlhttp.responseText;
                var obj = JSON.parse(response);
                document.getElementById('messageCount').innerHTML = obj.count;
                    activity(username);
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
                document.getElementById('messageCount').innerHTML = obj.msg_count;
                    activity(username);
            }
        };
    }
}

function activity(username) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/messages/ajax/user-activity/?user=' + username + '&max=1000000', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var responseactivity  = xmlhttp.responseText;
            var countloves = (responseactivity.match(/icon-xs black love/g) || []).length;
            document.getElementById("amtOfLovedProjects").innerHTML = c(countloves);
            /*var countshares = (responseactivity.match(/icon-xs black project/g) || []).length;
            document.getElementById("unsharedprojs").innerHTML = "Projects that were unshared: <b>" + String(countshares-totalProjects) + "</b> (BETA)";*/
        }};
}





function c(x) { // Add comma
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
