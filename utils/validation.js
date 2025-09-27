export function validatePurchase(data) {
  if (!data?.amount) 
    return { isValid: false, error: 'Amount required' };

  const amount = parseFloat(data.amount);

  if (isNaN(amount) || amount <= 0)
    return { isValid: false, error: 'Amount must be a positive number' }

  if (amount < 10) 
    return { isValid: false, error: 'Minimum amount is £10' };

  if (amount > 100000) 
    return { isValid: false, error: 'Maximum amount is £100,000' };

  return { isValid: true };
}

export function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      }
      catch {
        reject(new Error('Invalid JSON'));
      }

    })
  })
}