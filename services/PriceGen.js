class PriceGenerator {
  constructor() {
    this.basePrice = 2000;
    this.lastPrice = this.basePrice;
    this.trend = 0;
    this.volatility = 0.02;
  }

  /*
  Generate price based on last price + change
  Change = 0.5 * maxChange * (randomFactor + trend)
  where maxChange = lastPrice * volatility, volatility = 0.02
        randomFactor = random number between -1 and 1
        trend = previous trend * alpha + randomFactor * (1 - alpha), alpha = 0.7
  */

  generatePrice() {
    const randomFactor = (Math.random() - 0.5) * 2;
    this.trend = this.trend * 0.7 + randomFactor * 0.3;

    const maxChange = this.lastPrice * this.volatility;
    const priceChange = 0.5 * maxChange * (randomFactor + this.trend);
    let newPrice = this.lastPrice + priceChange;

    const minPrice = this.basePrice * 0.8;
    const maxPrice = this.basePrice * 1.2;
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

    this.lastPrice = newPrice;
    return Math.round(newPrice * 100) / 100; // round to 2 decimal places
  }

  getCurrentPrice() {
    return {
      price: this.generatePrice(),
      timestamp: new Date().toISOString()
    };
  }
}

export default new PriceGenerator();