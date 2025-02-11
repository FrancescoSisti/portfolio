import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Commit {
  hash: string;
  date: string;
  message: string;
}

interface Version {
  version: string;
  date: string;
  commits: Commit[];
}

@Component({
  selector: 'app-changelog-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changelog-mobile.component.html',
  styleUrls: ['./changelog-mobile.component.scss']
})
export class ChangelogMobileComponent {
  versions: Version[] = [
    {
      version: '1.0.0',
      date: '2024-02-11',
      commits: [
        {
          hash: '3eaf6b6',
          date: '2024-02-11',
          message: 'Add Mobile Projects View with Responsive Design and Device Detection'
        },
        {
          hash: '276524e',
          date: '2024-02-11',
          message: 'Enhance Mobile Navbar Styling with Advanced Interaction and Visual Effects'
        },
        {
          hash: '5a52041',
          date: '2024-02-11',
          message: 'Redesign Mobile Navbar with iOS-Inspired Navigation and Interaction Patterns'
        },
        {
          hash: '364ce0b',
          date: '2024-02-11',
          message: 'Refine Mobile Navbar Styling with Enhanced Performance and Visual Interactions'
        },
        {
          hash: '81ca708',
          date: '2024-02-11',
          message: 'Improve Mobile Navbar Styling with Modern Viewport and Performance Optimizations'
        }
      ]
    },
    {
      version: '0.2.0',
      date: '2024-02-03',
      commits: [
        {
          hash: 'f9049fb',
          date: '2024-02-03',
          message: 'Enhance Home Component with Creative Project Previews and Responsive Design'
        },
        {
          hash: '1e30f18',
          date: '2024-02-03',
          message: 'Add Mobile Skills View with Responsive Design and Interactive Tabs'
        },
        {
          hash: 'dc0b36c',
          date: '2024-02-03',
          message: 'Optimize Performance and Routing with Advanced Preloading and Lazy Loading'
        }
      ]
    },
    {
      version: '0.1.0',
      date: '2024-01-15',
      commits: [
        {
          hash: '46b0bfe',
          date: '2024-01-15',
          message: 'Initial commit'
        },
        {
          hash: '3282a71',
          date: '2024-01-15',
          message: 'Setup basic portfolio site structure'
        },
        {
          hash: 'a40b5c2',
          date: '2024-01-15',
          message: 'Implement basic navigation and layout'
        }
      ]
    }
  ];
}
