// Description: This module retrieves all the countries from the API and returns them as an array.

const axios = require('axios');

async function getCountries() {
    // Make post request to get all the countries from the API.
    const options = {
        url: 'https://countriesnow.space/api/v0.1/countries',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }

    try {
        var response = await axios(options);
    } catch (error) {
        console.log("[ERROR] - Failed to retrieve API data:", error);
    }

    let data = response.data.data;

    // Filter the data to get only the countries that have cities
    let filteredData = data.filter((item) => {
        return item.cities.length > 0;
    });

    // Sort the data by country name
    filteredData.sort((a, b) => {
        if (a.country > b.country) {
            return 1;
        }
        if (a.country < b.country) {
            return -1;
        }
        return 0;
    });

    // Keep only country names from the data
    let countryNames = filteredData.map((item) => {
        return item.country;
    });

    return countryNames;

}

let countries = getCountries();

module.exports = countries;
