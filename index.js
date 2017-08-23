/*To use swal,s
swal({
  title: 'Error!',
  text: 'Do you want to continue',
  type: 'error',
  confirmButtonText: 'Cool'
})
*/

var followers;

function userStatsUpdate (username) {
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
          }
    }

}
