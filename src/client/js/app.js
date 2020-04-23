
/**GeoNames **/
const GeoNamesURL = 'http://api.geonames.org/searchJSON?Cities=';
const userName = 'amal.ahmed'

// weatherbit
const weatherbitURL = 'https://api.weatherbit.io/v2.0/';
const weatherBitKey = '2cce0263d94645a793554e20e270c72b';

// pixabay.com
const pixabayURL = "https://pixabay.com/api/"
const pixabayKey = '16157293-1dc39b307c24dc502a2479e8f';

let tripObject = {};

// *****************get data from geonames ***************************
const getCityData = async (GeoNamesURL, city, userName) => {
    let URL = GeoNamesURL + city + "&username=" + userName;
    const res = await fetch(URL);
    try {
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("error: ", err);
    }
};

// ****************** get Forecasts based on date ****************************

const getFutureForecasts = async (city, country, latitude, longitude, numOfDays) => {
    if (numOfDays <= 7) { // if date within week
        const url = weatherbitURL + "current?city=" + city + "&key=" + weatherBitKey;
        const res = await fetch(url);
        try {
            const data = await res.json();
            if (data.count > 0) {
                return data.data[0].weather.description
            }
        } catch (err) {
            console.log("error: ", err);
        }
    } else { // if date future date
        const url = weatherbitURL + "forecast/daily?city=" + city + "&key=" + weatherBitKey;
        debugger;
        const res = await fetch(url);
        try {
            const data = await res.json();
            if (data.count > 0) {
                return data.data[0].weather.description
            }
        } catch (err) {
            console.log("error: ", err);
        }

    }


};

// ****************** pull image from pixabay ****************************

const getImage = async (city, country) => {
    const url = pixabayURL + "?key=" + pixabayKey + "&q=" + city + "&image_type=photo&pretty=true";
    const res = await fetch(url);
    try {
        const data = await res.json();
        if (data.hits.length > 0) {
            const imageURL = data.hits[0].largeImageURL;
            return imageURL;
        } else {
            const url = pixabayURL + "?key=" + pixabayKey + "&q=" + country + "&image_type=photo&pretty=true";
            if (data.hits.length > 0) {
                const imageURL = data.hits[0].largeImageURL;
                return imageURL;
            }
        }
    } catch (err) {
        console.log("error: ", err);
    }
};

// ****************** Get Number Of Days ****************************
const getDays = (date1, date2) => {
    const numOfDays = new Date(date1).getTime() - new Date(date2).getTime()
    const Difference_In_Days = numOfDays / (1000 * 3600 * 24);
    return Difference_In_Days;
};

// ****************** Update HTML ****************************
const UpdateUI = async (imageURL, tripObject) => {
    debugger;
    console.log(tripObject);
    document.getElementById("result-container").style.display = "flex";

    document.getElementById("res-image").src = imageURL;

    document.getElementById("weather-data").innerHTML = tripObject.weather;

    document.getElementById("country-data").innerHTML = tripObject.city;
    document.getElementById("city-data").innerHTML = tripObject.country;
    document.getElementById("trip-Length-data").innerHTML = tripObject.tripLength;





};

//******************** */ Submit event Listener ******************************
document.getElementById("submit").addEventListener("click", function (event) {


    const city = document.getElementById('city').value;
    let departingDate = document.getElementById('departing-date').value;
    let endDate = document.getElementById('end-date').value;

    tripObject.tripLength = parseInt(getDays(endDate, departingDate));
    tripObject.city = city;
    tripObject.departingDate = departingDate;

    if (Client.validateCity(city)) {
        console.log("::: Form Submitted :::")

        getCityData(GeoNamesURL, city, userName).then((data) => {
            tripObject.country = data.geonames[0].countryName;
            tripObject.latitude = data.geonames[0].countryName;
            tripObject.longitude = data.geonames[0].lng;
            tripObject.numOfDays = getDays(departingDate, Date.now());


            const weather = getFutureForecasts(tripObject.city, tripObject.country,
                tripObject.latitude, tripObject.longitude, tripObject.numOfDays);

            return weather;
        }).then((data) => {
            debugger;
            tripObject.weather = data;
            tripObject.imageURL = getImage(city)
            return tripObject.imageURL;
        }
        ).then((imgURL) => {
            UpdateUI(imgURL, tripObject);

        });
    } else {
        alert("Please Enter a Valid City ");
    }
});

// export { submitTrip }
