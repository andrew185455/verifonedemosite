document.getElementById('payNowButton').addEventListener('click', function() {
    // Define the API URL and authentication credentials
    const apiUrl = 'https://cst.test-gsc.vfims.com/oidc/checkout-service/v2/checkout';
    const username = 'e14c61c2-d4bb-44ed-a413-1e9f4f9d5bb8'; // Replace with your actual username
    const password = 'zEekpiUXQEpEUTlLVopmWBoFONAzVpXZZOOP'; // Replace with your actual password

        // Prepare the authentication headers
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    headers.append('Content-Type', 'application/json');

    // Load the request data from the JSON file (this ensures it's fetched every time the button is clicked)
    fetch('./requestData.json')
        .then(response => response.json()) // Parse the JSON file content
        .then(requestData => {
            // Send the POST request to the API with the fetched data
            fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestData)
            })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                // Check if the "url" is present in the response
                if (data && data.url) {
                    // Redirect to the provided URL from the API response
                    window.location.href = data.url;
                } else {
                    console.error('Error: URL not found in the response.');
                }
            })
            .catch(error => {
                console.error('Error during API call:', error);
            });
        })
        .catch(error => {
            console.error('Error loading request data:', error);
        });
});
