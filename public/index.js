// GoldDigger JavaScript functionality
console.log('GoldDigger app loaded');

// Add your JavaScript functionality here
const priceDisplay = document.getElementById('price-display');
const connectionStatus = document.getElementById('connection-status');
const form = document.querySelector('form');
const amountInput = document.getElementById('investment-amount');
const investBtn = document.getElementById('invest-btn');
const summary = document.getElementById('investment-summary');
const dialog = document.querySelector('dialog');

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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = amountInput.value.trim();

  if (!amount || parseFloat(amount) < 10) {
    alert('Please enter a valid amount (minimum £10)');
    return;
  }

  processPurchase(amount);
})


async function processPurchase(amount) {
  try {
    investBtn.textContent = 'Processing...';
    investBtn.disabled = true;

    const response = await fetch('/api/purchase', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ amount: parseFloat(amount) })
    });

    const data = await response.json();
    if (data.success) {
      const { purchase } = data;
      summary.textContent = `You just bought ${purchase.goldAmount} ounces (oz) for £${purchase.amount}. You will receive documentation shortly.`;
      dialog.showModal();
      amountInput.value = ''
    }
    else 
      alert(`Purchase failed: ${data.error}`);

  }
  catch(error) {
    alert('Purchase failed. Please try again')
  }
  finally {
    investBtn.textContent = 'Invest Now!';
    investBtn.disabled = false;
  }
}

dialog.querySelector('button').addEventListener('click', () => {
  dialog.close();
})

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