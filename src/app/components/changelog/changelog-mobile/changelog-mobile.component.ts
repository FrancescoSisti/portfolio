import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogService, Version } from '../../../services/changelog.service';

@Component({
  selector: 'app-changelog-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changelog-mobile.component.html',
  styleUrls: ['./changelog-mobile.component.scss']
})
export class ChangelogMobileComponent implements OnInit {
  versions: Version[] = [];

  constructor(private changelogService: ChangelogService) { }

  ngOnInit(): void {
    this.changelogService.getVersions().subscribe(versions => {
      this.versions = versions;
    });
  }
}
