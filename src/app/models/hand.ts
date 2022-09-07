export interface Hand {
  displayName: string;
  payouts: Array<number>;
};

export const HandValues = {
  RoyalFlush: [0, 250, 500, 750, 1000, 4000],
  StraightFlush: [0, 50, 100, 150, 200, 250],
  FourOfAKind: [0, 25, 50, 75, 100, 125],
  FullHouse: [0, 9, 18, 27, 36, 45],
  Flush: [0, 6, 12, 18, 24, 30],
  Straight: [0, 4, 8, 12, 16, 20],
  ThreeOfAKind: [0, 3, 6, 9, 12, 15],
  TwoPair: [0, 2, 4, 6, 8, 10],
  JacksOrBetter: [0, 1, 2, 3, 4, 5],
};

export enum HandIndices {
  ROYAL_FLUSH = 0,
  STRAIGHT_FLUSH = 1,
  FOUR_OF_A_KIND = 2,
  FULL_HOUSE = 3,
  FLUSH = 4,
  STRAIGHT = 5,
  THREE_OF_A_KIND = 6,
  TWO_PAIR = 7,
  JACKS_OR_BETTER = 8,
}

export const HANDS: Array<Hand> = [
  { displayName: 'Royal Flush', payouts: HandValues.RoyalFlush },
  { displayName: 'Straight Flush', payouts: HandValues.StraightFlush },
  { displayName: 'Four of a Kind', payouts: HandValues.FourOfAKind },
  { displayName: 'Full House', payouts: HandValues.FullHouse },
  { displayName: 'Flush', payouts: HandValues.Flush },
  { displayName: 'Straight', payouts: HandValues.Straight },
  { displayName: 'Three of a Kind', payouts: HandValues.ThreeOfAKind },
  { displayName: 'Two Pair', payouts: HandValues.TwoPair },
  { displayName: 'Jacks or Better', payouts: HandValues.JacksOrBetter },
];
