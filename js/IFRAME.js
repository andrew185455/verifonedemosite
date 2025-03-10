async function postData(apiUrl, jsonFilePath) {
    try {
        // Fetch the request payload from the JSON file
        const requestPayload = await fetch(jsonFilePath).then(response => response.json());
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestPayload.data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result.url; // Extracts the 'url' parameter from the response
    } catch (error) {
        console.error("Error in POST request:", error);
        return null;
    }
}

// Example usage:
const apiUrl = 'https://cst.test-gsc.vfims.com/oidc/checkout-service/v2/checkout';
const jsonFilePath = "requestData.json";
const username = 'e14c61c2-d4bb-44ed-a413-1e9f4f9d5bb8'; // Replace with your actual username
const password = 'zEekpiUXQEpEUTlLVopmWBoFONAzVpXZZOOP'; // Replace with your actual password

document.addEventListener("DOMContentLoaded", () => {
    postData(apiUrl, jsonFilePath).then(url => {
        if (url) {
            console.log("Returned URL:", url);
            
            // Insert script into the HTML page
            const container = document.getElementById("payment_form_container");
            if (container) {
                const scriptElement = document.createElement("script");
                scriptElement.src = url;
                scriptElement.defer = true;
                container.appendChild(scriptElement);
            }
        } else {
            console.log("Failed to retrieve URL");
        }
    });
});
