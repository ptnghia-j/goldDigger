import config from '../config.js';
class PriceGenerator {
  constructor() {
    this.basePrice = config.PRICE.BASE;
    this.lastPrice = this.basePrice;
    this.trend = 0;
    this.volatility = config.PRICE.VOLATILITY;
  }

  /*
  Using weighted moving average to generate price
  Change = 0.5 * maxChange * (randomFactor + trend)
  where maxChange = lastPrice * volatility, volatility = 0.02
        randomFactor = random number between -1 and 1
        trend = previous trend * alpha + randomFactor * (1 - alpha), alpha = 0.7
  */

  generatePrice() {
    const randomFactor = (Math.random() - 0.5) * 2;
    this.trend = this.trend * config.PRICE.ALPHA + randomFactor * (1 - config.PRICE.ALPHA);

    const maxChange = this.lastPrice * this.volatility;
    const priceChange = 0.5 * maxChange * (randomFactor + this.trend);
    let newPrice = this.lastPrice + priceChange;

    const minPrice = this.basePrice * config.PRICE.MIN_RATIO;
    const maxPrice = this.basePrice * config.PRICE.MAX_RATIO;
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