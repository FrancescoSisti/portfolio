import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogService, Version } from '../../../services/changelog.service';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {
  versions: Version[] = [];

  constructor(private changelogService: ChangelogService) { }

  ngOnInit(): void {
    this.changelogService.getVersions().subscribe(versions => {
      this.versions = versions;
    });
  }
}
