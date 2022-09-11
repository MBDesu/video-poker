import { Component } from '@angular/core';
import { Card, CardSymbol } from './models/card';
import { Deck } from './models/deck';
import { Hand, HandIndices, HANDS } from './models/hand';
import { PriorityQueue } from './util/priority-queue';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // TODO: extract game logic to its own component/service
  readonly UNSELECTED_CARD_INDICES = [0, 1, 2, 3, 4];
  deck!: Deck;
  unselectedCardIndices!: Array<number>;
  drawnCards!: Array<Card>;
  hasDrawn!: boolean;
  handValue!: Hand;
  gameHasStarted = false;
  gameIsOver = false;
  showPayouts = false;
  currentBet!: number;
  coins = 50;

  setBet(amount: number): void {
    this.currentBet = amount;
    this.coins -= amount;
    this.initializeGame();
  }

  private initializeGame(): void {
    this.gameHasStarted = true;
    this.hasDrawn = false;
    this.gameIsOver = false;
    this.handValue = { displayName: '', payouts: [0] };
    this.deck = new Deck();
    this.unselectedCardIndices = Array.from(this.UNSELECTED_CARD_INDICES);
    this.deck.shuffle();
    this.drawnCards = this.deck.drawCard(5);
  }

  restartGame(): void {
    this.coins = 50;
    this.gameHasStarted = false;
    this.gameIsOver = false;
    this.handValue = { displayName: '', payouts: [0] };
    this.drawnCards = [];
  }

  drawNewCards(): void {
    if (this.hasDrawn) {
      this.initializeGame();
    } else {
      for (let i = 0; i < this.unselectedCardIndices.length; i++) {
        this.drawnCards[this.unselectedCardIndices[i]] = this.deck.drawCard()[0];
      }
      this.hasDrawn = true;
      this.determineHandAndValue();
      this.unselectedCardIndices = Array.from(this.UNSELECTED_CARD_INDICES);
      this.gameHasStarted = false;
      if (this.coins <= 0) {
        this.gameIsOver = true;
      }
    }
  }

  // bad
  toggleSelectedCard(index: number): void {
    if (this.hasDrawn) {
      return;
    }
    const indexOfTheIndex = this.unselectedCardIndices.indexOf(index);
    if (indexOfTheIndex > -1) {
      this.unselectedCardIndices.splice(indexOfTheIndex, 1);
    } else {
      this.unselectedCardIndices.push(index);
    }
  }

  togglePayouts(): void {
    this.showPayouts = !this.showPayouts;
  }

  // easiest solution would be to use a priority queue for hands
  // and then check if the hand is each hand
  // not optimal whatsoever, but would work fine
  //
  // Might even just be able to use a stack,
  // since these checks are made in order anyway
  // TODO: think about stacks
  private determineHandAndValue(): void {
    const possibleHands = new PriorityQueue<Hand>();
    const sortedCards = Array.from(this.drawnCards);
    sortedCards.sort(this.sortCardsBySymbolValue);
    this.checkRoyalFlush(possibleHands);
    this.checkStraightFlush(possibleHands, sortedCards);
    this.checkFourOfAKind(possibleHands);
    this.checkFullHouse(possibleHands);
    this.checkFlush(possibleHands);
    this.checkStraight(possibleHands, sortedCards);
    this.checkThreeOfAKind(possibleHands);
    this.checkTwoPair(possibleHands);
    this.checkJacksOrBetter(possibleHands);
    this.handValue = possibleHands.peek() ?? { displayName: 'Nothing', payouts: [0, 0, 0, 0, 0, 0] };
    this.coins += this.handValue.payouts[this.currentBet];
  }

  private sortCardsBySymbolValue(a: Card, b: Card): number {
    if (a.symbolValue < b.symbolValue) {
      return -1;
    } else if (a.symbolValue > b.symbolValue) {
      return 1;
    }
    return 0;
  }

  private checkRoyalFlush(possibleHands: PriorityQueue<Hand>): void {
    const suit = this.drawnCards[0].suit;
    const isRoyalFlush = this.drawnCards.every((card) => {
      // TODO: this check is broken...maybe
      return card.suit === suit && ['A', 'K', 'Q', 'J', '10'].indexOf(card.symbol) > -1;
    });
    if (isRoyalFlush) {
      possibleHands.insert(HANDS[HandIndices.ROYAL_FLUSH], HandIndices.ROYAL_FLUSH);
    }
  }

  private checkStraightFlush(possibleHands: PriorityQueue<Hand>, sortedCards: Array<Card>): void {
    const suit = sortedCards[0].suit;
    let isStraightFlush = sortedCards.every((card, i, sortedCards) => {
      let isStraight = true;
      if (i > 0) {
        isStraight = Math.abs(sortedCards[i - 1].symbolValue - sortedCards[i].symbolValue) === 1;
      }
      return card.suit === suit && isStraight;
    });
    // no need to check for ace high straights since
    // an ace high straight flush is a royal flush
    if (isStraightFlush) {
      possibleHands.insert(HANDS[HandIndices.STRAIGHT_FLUSH], HandIndices.STRAIGHT_FLUSH);
    }
  }

  private checkFourOfAKind(possibleHands: PriorityQueue<Hand>): void {
    let counts = new Array<number>(15).fill(0);
    this.drawnCards.forEach((card) => {
      counts[card.symbolValue]++;
      if (card.symbolValue === 1) {
        counts[14]++;
      }
      if (counts[card.symbolValue] >= 4) {
        possibleHands.insert(HANDS[HandIndices.FOUR_OF_A_KIND], HandIndices.FOUR_OF_A_KIND);
      }
    });
  }

  private checkFullHouse(possibleHands: PriorityQueue<Hand>): void {
    let counts = new Array<number>(15).fill(0);
    this.drawnCards.forEach((card) => {
      counts[card.symbolValue]++;
      if (card.symbolValue === 1) {
        counts[14]++;
      }
    });
    if (counts.indexOf(2) > -1 && counts.indexOf(3) > -1) {
      possibleHands.insert(HANDS[HandIndices.FULL_HOUSE], HandIndices.FULL_HOUSE);
    }
  }

  private checkFlush(possibleHands: PriorityQueue<Hand>): void {
    const suit = this.drawnCards[0].suit;
    const isFlush = this.drawnCards.every((card) => card.suit === suit);
    if (isFlush) {
      possibleHands.insert(HANDS[HandIndices.FLUSH], HandIndices.FLUSH);
    }
  }

  private checkStraight(possibleHands: PriorityQueue<Hand>, sortedCards: Array<Card>): void {
    let hasAce = false;
    let isStraight = sortedCards.every((card, i, sortedCards) => {
      if (card.symbol === CardSymbol.Ace) {
        hasAce = true;
      }
      if (i < 1) {
        return true;
      }
      return sortedCards[i].symbolValue - sortedCards[i - 1].symbolValue === 1;
    });
    if (hasAce && !isStraight) {
      const aceHigh = JSON.parse(JSON.stringify(sortedCards));
      aceHigh[0].symbolValue = 14;
      aceHigh.sort(this.sortCardsBySymbolValue);
      isStraight = aceHigh.every((card: Card, i: number, sortedCards: Array<Card>) => {
      if (card.symbol === CardSymbol.Ace) {
        hasAce = true;
      }
      if (i < 1) {
        return true;
      }
      return sortedCards[i].symbolValue - sortedCards[i - 1].symbolValue === 1;
    });
    }
    if (isStraight) {
      possibleHands.insert(HANDS[HandIndices.STRAIGHT], HandIndices.STRAIGHT);
    }
  }

  private checkThreeOfAKind(possibleHands: PriorityQueue<Hand>): void {
    let counts = new Array<number>(15).fill(0);
    this.drawnCards.forEach((card) => {
      counts[card.symbolValue]++;
      if (counts[card.symbolValue] >= 3 || counts[14] >= 3) {
        possibleHands.insert(HANDS[HandIndices.THREE_OF_A_KIND], HandIndices.THREE_OF_A_KIND);
      }
    });
  }

  private checkTwoPair(possibleHands: PriorityQueue<Hand>): void {
    let counts = new Array<number>(15).fill(0);
    let pairs = 0;
    this.drawnCards.forEach((card) =>{
      counts[card.symbolValue]++;
    });
    counts.forEach((count) => {
      if (count === 2) {
        pairs++;
      }
    });
    if (pairs === 2) {
      possibleHands.insert(HANDS[HandIndices.TWO_PAIR], HandIndices.TWO_PAIR);
    }
  }

  private checkJacksOrBetter(possibleHands: PriorityQueue<Hand>): void {
    const vals = Object.create(null);
    for (const card of this.drawnCards) {
      let val = card.symbol;
      if (val in vals && (val === 'J' || val === 'Q' || val === 'K' || val === 'A')) {
        possibleHands.insert(HANDS[HandIndices.JACKS_OR_BETTER], HandIndices.JACKS_OR_BETTER);
        break;
      }
      vals[val] = true;
    }
  }

}
