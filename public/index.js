// GoldDigger JavaScript functionality
console.log('GoldDigger app loaded');

// Add your JavaScript functionality here
const priceDisplay = document.getElementById('price-display');
const connectionStatus = document.getElementById('connection-status');

let updateInterval = null; // store interval ID

function updateStatus(connected) {
  connectionStatus.textContent = connected ? 'Live Price ✅': 'Connection Lost ❌';
  connectionStatus.style.color = connected ? 'green' : 'red';
}

async function fetchPrice() {
  try {
    const response = await fetch('/api/price');
    const data = await response.json();

  
    if (data.success) {
      priceDisplay.textContent = data.price.toFixed(2);
      updateStatus(true);
    }
    
  }
  catch(err) {
    updateStatus(false);
    priceDisplay.textContent = '----.--';
  }
}

function startPriceUpdates() {
  fetchPrice();
  updateInterval = setInterval(fetchPrice, 3000);
}

document.addEventListener('DOMContentLoaded', startPriceUpdates);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) 
    clearInterval(updateInterval);
  else
    startPriceUpdates();
})