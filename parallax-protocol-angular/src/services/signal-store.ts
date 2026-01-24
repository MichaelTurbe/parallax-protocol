import { Signal } from "@angular/core";

export class SignalStore { 
  private signalMap: Map<string, Signal<any>>;

  constructor() {
    this.signalMap = new Map <string, Signal<any>>();
  }

  public add(name: string, signal: Signal<any>) {
    this.signalMap.set(name, signal);
  }

  public get(name: string) {
    return this.signalMap.get(name);
  }

  public has(name: string): boolean {
    return this, this.signalMap.has(name);
  }
}

