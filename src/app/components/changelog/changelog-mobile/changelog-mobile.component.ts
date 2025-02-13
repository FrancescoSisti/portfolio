import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogService, Version, PaginatedVersions } from '../../../services/changelog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-changelog-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changelog-mobile.component.html',
  styleUrls: ['./changelog-mobile.component.scss']
})
export class ChangelogMobileComponent implements OnInit {
  versions: Version[] = [];
  currentPage = new BehaviorSubject<number>(1);
  loading = new BehaviorSubject<boolean>(false);
  hasMore = false;
  total = 0;

  constructor(private changelogService: ChangelogService) { }

  ngOnInit(): void {
    this.loadVersions();
  }

  private loadVersions(): void {
    this.currentPage.pipe(
      tap(() => this.loading.next(true)),
      switchMap(page => this.changelogService.getVersions(page)),
      tap(() => this.loading.next(false))
    ).subscribe((result: PaginatedVersions) => {
      if (this.currentPage.value === 1) {
        this.versions = result.versions;
      } else {
        this.versions = [...this.versions, ...result.versions];
      }
      this.hasMore = result.hasMore;
      this.total = result.total;
    });
  }

  loadMore(): void {
    if (this.hasMore && !this.loading.value) {
      this.currentPage.next(this.currentPage.value + 1);
    }
  }

  trackByVersion(index: number, version: Version): string {
    return version.version;
  }

  trackByCommit(index: number, commit: any): string {
    return commit.hash;
  }
}
