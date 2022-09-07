export class PriorityQueue<T> {
  private data: [number, T][] = [];

  insert(data: T, priority: number): void {
    this.data.push([priority, data]);
  }

  peek(): T | null {
    return this.isEmpty() ? null :
    this.data.reduce((previousValue, currentValue) => {
      return currentValue[0] < previousValue[0] ? currentValue : previousValue;
    })[1];
  }

  pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    let min = this.data[0];
    let index = -1;
    this.data.forEach((el, i) => {
      if (el[0] < min[0]) {
        min = el;
        index = i;
      }
    });
    this.data.splice(index, 1);
    return min[1];
  }

  size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

};
