import { CommonModule } from '@angular/common';
import { Component, computed, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { HeroService } from './hero.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableModule, InputSwitchModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  userDetails!: WritableSignal<any[]>;
  activeFilters: any[] = [];
  isToggleFilterOn = false;
  isNameFilterOn = false;
  filters: any = {};
  constructor(private heroService: HeroService) {
    effect(() => {
      console.log('signal change', this.userDetails());
    });
  }

  ngOnInit(): void {
    this.userDetails = signal(this.heroService.userDetails);
    this.userDetails().forEach((ele) => {
      for (let key of Object.keys(ele)) {
        if (!this.filters[key]) {
          this.filters[key] = [];
        }
        if (!this.filters[key].find((d: any) => d.label === ele[key])) {
          this.filters[key].push({ label: ele[key], isToggleOn: false });
        }
      }
    });
  }

  onClearFilter() {
    this.userDetails.set(this.heroService.userDetails);
    Object.values(this.filters).forEach((ele: any) => {
      ele.forEach((ele: any) => ele.isToggleOn = false);
    });
    this.isToggleFilterOn = false;
  }

  onFilter() {
    this.activeFilters = [];
    this.isToggleFilterOn = true;
    for (const [key, value] of Object.entries(this.filters)) {
      (value as any).forEach((ele: any) => {
        if (ele.isToggleOn) {
          this.activeFilters.push({ key: key, label: ele.label });
        }
      });
    }
    this.userDetails.update(() => {
      const filteredUserDetails = this.heroService.userDetails.filter((ele: any) => {
        const FIND = this.activeFilters.find(af => {
          return ele[af.key] === af.label;
        });
        if (FIND) {
          return ele;
        }
      });
      this.heroService.currentFilteredUserDetaill.next(filteredUserDetails);
      if (this.isNameFilterOn) {
        const data = filteredUserDetails.filter(ele => {
          const FIND = this.heroService.currentNameFilteredUserDetaill.getValue()
            .find(d => d.id === ele.id);
          if (!FIND) {
            return ele;
          }
        });
        return [...data, ...this.heroService.currentNameFilteredUserDetaill.getValue()];
      } else {
        return filteredUserDetails;
      }
    });
  }

  onNameFilter(searchTerm: string): void {
    this.isNameFilterOn = true;
    const SEARCH_TERM = searchTerm.toLowerCase();
    if (!SEARCH_TERM.length) {
      this.isNameFilterOn = false;
      this.userDetails.update(() => {
        if (this.isToggleFilterOn) {
          return this.heroService.currentFilteredUserDetaill.getValue();
        } else {
          return this.heroService.userDetails;
        }
      });
    } else {
      this.userDetails.update(() => {
        let user: any[] = [];
        const filteredUserDetails = this.heroService.userDetails
          .filter(ele => ele.name.includes(SEARCH_TERM));
        this.heroService.currentNameFilteredUserDetaill.next(filteredUserDetails);
        if (this.isToggleFilterOn) {
          if (filteredUserDetails && filteredUserDetails.length) {
            const data = filteredUserDetails.filter(ele => {
              const find = this.heroService.currentFilteredUserDetaill.getValue().find(d => d.id === ele.id);
              if (!find) {
                return ele;
              }
            });
            user = [...data, ...this.heroService.currentFilteredUserDetaill.getValue()];
            return user;
          } else {
            return this.heroService.currentFilteredUserDetaill.getValue();
          }
        } else {
          return filteredUserDetails;
        }
      });
    }
  }

}
