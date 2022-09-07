import { Card, CardSuit, CardSymbol } from './card';

export class Deck {

  cards!: Array<Card>;

  constructor() {
    this.initializeDeck();
  }

  initializeDeck(): void {
    this.cards = [];
    Object.values(CardSuit).forEach((suit) => {
      Object.values(CardSymbol).forEach((symbol) => {
        this.cards.push({
          symbol: symbol,
          symbolValue: this.getNumericSymbolValue(symbol),
          suit: suit,
          displayValue: this.getCardDisplayValue(suit, symbol),
        });
      });
    });
  }

  // wow this sucks
  // TODO: refactor to associative arrays/maps
  private getCardDisplayValue(suit: CardSuit, symbol: CardSymbol): string {
    let unicodeCharValue = 0x1F000;
    switch (suit) {
      case CardSuit.Clubs:
        unicodeCharValue += 0xD0;
        break;
      case CardSuit.Hearts:
        unicodeCharValue += 0xB0;
        break;
      case CardSuit.Spades:
        unicodeCharValue += 0xA0;
        break;
      case CardSuit.Diamonds:
        unicodeCharValue += 0xC0;
        break;
      default:
        break;
    }
    switch (symbol) {
      case CardSymbol.Ace:
        unicodeCharValue += 0x1;
        break;
      case CardSymbol.Two:
        unicodeCharValue += 0x2;
        break;
      case CardSymbol.Three:
        unicodeCharValue += 0x3;
        break;
      case CardSymbol.Four:
        unicodeCharValue += 0x4;
        break;
      case CardSymbol.Five:
        unicodeCharValue += 0x5;
        break;
      case CardSymbol.Six:
        unicodeCharValue += 0x6;
        break;
      case CardSymbol.Seven:
        unicodeCharValue += 0x7;
        break;
      case CardSymbol.Eight:
        unicodeCharValue += 0x8;
        break;
      case CardSymbol.Nine:
        unicodeCharValue += 0x9;
        break;
      case CardSymbol.Ten:
        unicodeCharValue += 0xA;
        break;
      case CardSymbol.Jack:
        unicodeCharValue += 0xB;
        break;
      case CardSymbol.Queen:
        unicodeCharValue += 0xD;
        break;
      case CardSymbol.King:
        unicodeCharValue += 0xE;
        break;
      default:
        break;
    }
    return String.fromCodePoint(unicodeCharValue);
  }

  private getNumericSymbolValue(symbol: CardSymbol): number {
    switch (symbol) {
      case CardSymbol.Ace:
        return 1;
      case CardSymbol.Two:
        return 2;
      case CardSymbol.Three:
        return 3;
      case CardSymbol.Four:
        return 4;
      case CardSymbol.Five:
        return 5;
      case CardSymbol.Six:
        return 6;
      case CardSymbol.Seven:
        return 7;
      case CardSymbol.Eight:
        return 8;
      case CardSymbol.Nine:
        return 9;
      case CardSymbol.Ten:
        return 10;
      case CardSymbol.Jack:
        return 11;
      case CardSymbol.Queen:
        return 12;
      case CardSymbol.King:
        return 13;
      default:
        return 0;
    }
  }

  shuffle(): void {
    let currentIndex = this.cards.length;
    let randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.cards[currentIndex], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[currentIndex]];
    }
  }

  print(): void {
    console.log(this.cards);
  }

  drawCard(numCards: number = 1): Array<Card> {
    return this.cards.splice(0, numCards);
  }

};
