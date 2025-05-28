import { Component } from '@angular/core';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {
  tasks = [
    {
      title: 'Task Title 1',
      description: 'Description text for the first task goes here. It might be a bit longer to test wrapping.',
      category: 'Cleaning',
      location: 'Downtown'
    },
    {
      title: 'Task Title 2',
      description: 'Another description text for the second task example, maybe related to gardening.',
      category: 'Gardening',
      location: 'Suburbs'
    },
    {
      title: 'Task Title 3',
      description: 'Description for the third task which might be shorter.',
      category: 'Delivery',
      location: 'Old Town'
    },
    {
      title: 'Task Title 4 - Need help moving boxes',
      description: 'Looking for someone strong to help move boxes this Saturday morning for about 2 hours.',
      category: 'Moving Help',
      location: 'North District'
    },
    {
      title: 'Task Title 5 - Urgent translation',
      description: 'Need a quick translation of a short document. ASAP.',
      category: 'Translation',
      location: 'Remote'
    }
  ];

  
}

