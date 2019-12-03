import {Component, OnInit} from '@angular/core';
import {ActiveMqService} from "./active-mq.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test';


  constructor(private activeMqService: ActiveMqService) {
  }

  ngOnInit(): void {

    this.activeMqService.subscribe<any>(
      'demo_activemq.hello-world',
      (data) => console.log(data)
    );

    this.activeMqService.subscribe<any>(
      'demo_activemq.test',
      (data) => console.log(data)
    );

    this.activeMqService.send('demo_activemq.blop', {user: 'Flavian'});

  }


}
