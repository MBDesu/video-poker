export enum CardSymbol {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
};

export enum CardSuit {
  Clubs = '♣',
  Diamonds = '♦',
  Hearts = '♥',
  Spades = '♠',
};

export interface Card {
  symbol: CardSymbol;
  symbolValue: number;
  suit: CardSuit;
  displayValue: string;
};
