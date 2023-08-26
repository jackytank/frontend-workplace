import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  intervalSub: any;
  title: string = "It just a normal title!";
  employeeList: Employee[] = [
    {
      id: 1,
      name: 'John',
      email: 'john@gmail.com'
    },
    {
      id: 2,
      name: 'Smith',
      email: 'smith@gmail.com'
    },
    {
      id: 3,
      name: 'Smilga',
      email: 'smilga@gmail.com'
    }
  ];
  currentDate: Date = new Date();
  salary: number = 10000.2345323;

  getMin(arg0: number, arg1: number) {
    return Math.min(arg0, arg1);
  }

  ngOnInit(): void {
    this.intervalSub = setInterval(() => {
      console.log('interval fired');
    }, 1000);
  }
  ngOnDestroy(): void {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }
}

interface Employee {
  id: number;
  name: string;
  email: string;
}