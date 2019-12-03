import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {isObject} from "util";


@Injectable({
  providedIn: 'root'
})
export class ActiveMqService {
  private webSockets: Map<string, WebSocket>;
  private webSocketsSubject: Map<string, BehaviorSubject<any>>;

  constructor() {
    this.webSockets = new Map<string, WebSocket>();
    this.webSocketsSubject = new Map<string, BehaviorSubject<any>>();
  }


  private createWebSocket(
    destination: string,
    url: string = environment.activeMq.url,
    protocol: string = environment.activeMq.protocol
  ) {
    this.webSockets.set(destination, new WebSocket(url, protocol));
  }
  subscribe<T>(
    destination: string,
    next: (value: T) => void,
    url: string = environment.activeMq.url,
    protocol: string = environment.activeMq.protocol) {
    if (!this.webSocketsSubject.has(destination)) {
      this.createWebSocket(destination, url, protocol);
      this.webSockets.get(destination).onopen = () => {
        this.webSockets.get(destination).send("CONNECT\n\n\0");
        this.webSockets.get(destination).send(`SUBSCRIBE\ndestination:${destination}\n\nack:auto\n\n\0`);
      };

      this.webSocketsSubject.set(destination, new BehaviorSubject<T>(null));
      this.webSockets.get(destination).onmessage = (msg) => {
        const data: string = msg.data;
          if (data.startsWith("MESSAGE")) {
            const matches = data.match(/.*\{(.*)\}.*/ig);
            this.webSocketsSubject.get(destination).next(JSON.parse(matches[0].substring(0, matches[0].length - 1)));
          }
      }
    }
    this.webSocketsSubject.get(destination).subscribe(next);
  }

  send(
    destination: string,
    msg: any,
    url: string = environment.activeMq.url,
    protocol: string = environment.activeMq.protocol
  ) {
    if (!this.webSockets.has(destination)) {
      this.createWebSocket(destination, url, protocol);
      let toSend;
      if (isObject(msg)) {
        toSend = JSON.stringify(msg);
      } else {
        toSend = msg.toString();
      }
      this.webSockets.get(destination).onopen = () => {
        this.webSockets.get(destination).send(`CONNECT\n\n\0`);
        this.webSockets.get(destination).send(`SEND\ndestination:${destination}\n\n${toSend}\0`);
        this.webSockets.get(destination).close();
        this.webSockets.delete(destination);
      };
    }
  }
}
