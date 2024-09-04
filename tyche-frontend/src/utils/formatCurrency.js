import axios from "axios";

const formatCurrency = async (amountInUSDT, selectedCurrency) => {
  try {
    // Fetch exchange rates from the API
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );

    // Extract exchange rates from the response
    const rates = response.data.rates;

    // Convert USD to the selected currency
    const exchangeRate = rates[selectedCurrency];
    const convertedAmount = amountInUSDT * exchangeRate;

    return convertedAmount.toFixed(2); // Format to two decimal places
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null; // Return null in case of an error
  }
};

export default formatCurrency;
