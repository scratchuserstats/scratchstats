var followers;
var following;
var exampleLocation = [
  'United States',	'Afghanistan',	'Aland Islands',	'Albania',	'Algeria',	'American Samoa',	'Andorra',	'Angola',	'Anguilla',	'Antarctica',	'Antigua and Barbuda',	'Argentina',	'Armenia',	'Aruba',	'Australia',	'Austria',	'Azerbaijan',	'Bahamas',	'Bonaire, Sint Eustatius and Saba',	'Bahrain',	'Bangladesh',	'Barbados',	'Belarus',	'Belgium',	'Belize',	'Benin',	'Bermuda',	'Bhutan',	'Bolivia',	'Bosnia and Herzegovina',	'Botswana',	'Bouvet Island',	'Brazil',	'British Indian Ocean Territory',	'Brunei',	'Bulgaria',	'Burkina Faso',	'Burundi',	'Cambodia',	'Cameroon',	'Canada',	'Cape Verde',	'Cayman Islands',	'Central African Republic',	'Chad',	'Chile',	'China',	'Christmas Island',	'Cocos (Keeling) Islands',	'Colombia',	'Comoros',	'Congo',	'Congo, The Democratic Republic of the',	'Cook Islands',	'Costa Rica',	"Cote d'Ivoire",	'Croatia',	'Cuba',	'Cyprus',	'Czech Republic',	'Denmark',	'Djibouti',	'Dominica',	'Dominican Republic',	'Ecuador',	'Egypt',	'El Salvador',	'Equatorial Guinea',	'Eritrea',	'Estonia',	'Ethiopia',	'Falkland Islands (Malvinas)',	'Faroe Islands',	'Fiji',	'Finland',	'France',	'French Guiana',	'French Polynesia',	'French Southern Territories',	'Gabon',	'Gambia',	'Georgia',	'Germany',	'Ghana',	'Gibraltar',	'Greece',	'Greenland',	'Grenada',	'Guadeloupe',	'Guam',	'Guatemala',	'Guernsey',	'Guinea',	'Guinea-Bissau',	'Guyana',	'Haiti',	'Heard Island and McDonald Islands',	'Vatican City',	'Honduras',	'Hong Kong',	'Hungary',	'Iceland',	'India',	'Indonesia',	'Iran',	'Iraq',	'Ireland',	'Isle of Man',	'Israel',	'Italy',	'Jamaica',	'Japan',	'Jersey',	'Jordan',	'Kazakhstan',	'Kenya',	'Kiribati',	'North Korea',	'South Korea',	'Kuwait',	'Kyrgyzstan',	'Laos',	'Latvia',	'Lebanon',	'Lesotho',	'Liberia',	'Libya',	'Liechtenstein',	'Lithuania',	'Luxembourg',	'Macao',	'Macedonia, The Former Yugoslav Republic of',	'Madagascar',	'Malawi',	'Malaysia',	'Maldives',	'Mali',	'Malta',	'Marshall Islands',	'Martinique',	'Mauritania',	'Mauritius',	'Mayotte',	'Mexico',	'Micronesia, Federated States of',	'Moldova',	'Monaco',	'Mongolia',	'Montenegro',	'Montserrat',	'Morocco',	'Mozambique',	'Myanmar',	'Namibia',	'Nauru',	'Nepal',	'Netherlands',	'Netherlands Antilles',	'New Caledonia',	'New Zealand',	'Nicaragua',	'Niger',	'Nigeria',	'Niue',	'Norfolk Island',	'Northern Mariana Islands',	'Norway',	'Oman',	'Pakistan',	'Palau',	'Palestine, State of',	'Panama',	'Papua New Guinea',	'Paraguay',	'Peru',	'Philippines',	'Pitcairn',	'Poland',	'Portugal',	'Puerto Rico',	'Qatar',	'Reunion',	'Romania',	'Russia',	'Rwanda',	'Saint Barthelemy',	'Saint Helena',	'Saint Kitts and Nevis',	'Saint Lucia',	'Saint Martin',	'Saint Pierre and Miquelon',	'Saint Vincent and the Grenadines',	'Samoa',	'San Marino',	'Sao Tome and Principe',	'Saudi Arabia',	'Senegal',	'Serbia',	'Seychelles',	'Sierra Leone',	'Singapore',	'Slovakia',	'Slovenia',	'Solomon Islands',	'Somalia',	'South Africa',	'South Georgia and the South Sandwich Islands',	'South Sudan',	'Spain',	'Sri Lanka',	'Sudan',	'Suriname',	'Svalbard and Jan Mayen',	'Swaziland',	'Sweden',	'Switzerland',	'Syria',	'Taiwan',	'Tajikistan',	'Tanzania',	'Thailand',	'Timor-Leste',	'Togo',	'Tokelau',	'Tonga',	'Trinidad and Tobago',	'Tunisia',	'Turkey',	'Turkmenistan',	'Turks and Caicos Islands',	'Tuvalu',	'Uganda',	'Ukraine',	'United Arab Emirates',	'United Kingdom',	'United States Minor Outlying Islands',	'Uruguay',	'Uzbekistan',	'Vanuatu',	'Venezuela',	'Vietnam',	'Virgin Islands, British',	'Virgin Islands, U.S.',	'Wallis and Futuna',	'Kosovo',	'Western Sahara',	'Yemen',	'Zambia',	'Zimbabwe'];
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
            //random add miscelannous date :P
            document.getElementById("joined").innerHTML = (obj.history.joined).substring(0,9);
            var year = (curDate.getFullYear()) - (parseInt(date.substring(0, 5)));
            var month = parseInt(date.substring(5, 7));
            var day = parseInt(date.substring(8, 10));
            var hour = parseInt(date.substring(11, 13));
            var avgFollowsPerYear = (followers / (year + (month / 12) + (day / 365)));
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
    }
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
      }
    }
}
