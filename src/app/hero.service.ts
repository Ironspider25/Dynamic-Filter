import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  activeFilters: BehaviorSubject<string[]> = new BehaviorSubject(['']);
  currentFilteredUserDetaill: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  currentNameFilteredUserDetaill: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  userDetails: any[] = [
    {
      id: "1",
      name: 'jim',
      state: "GUJ",
      city: "Surat"
    },
    {
      id: "2",
      name: 'jim',
      state: "GOA",
      city: "Panjim"
    },
    {
      id: "3",
      name: 'abc',
      state: "MahaRastra",
      city: "Mumbai"
    },
    {
      id: "4",
      name: 'pqr',
      state: "GUJ",
      city: "Surat"
    },
  ]
  constructor() { }
}
