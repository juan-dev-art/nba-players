import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from './class/player';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'nba-players';

  private dataUrl: string = 'https://mach-eight.uc.r.appspot.com/';
  private maxValue: number;
  private minValue: number;
  public pairs: Array<any>;
  public showNoResults: boolean;

  //Group for the reactive form
  public formInputs: FormGroup;

  private players: Array<Player>;

  public pageOfItems: Array<any>;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.formInputs = this.formBuilder.group({
      txtHeight: [],
    });
  }

  /**
   * Init data information on component loaded
   */
  ngOnInit(): void {
    this.getPlayers();
  }

  /**
   * Load data form URL and takes min and max values to limit the range
   */
  private getPlayers(): void {
    this.http.get<any>(this.dataUrl).subscribe((data) => {
      this.players = data.values;
      //Max and min values to limit range
      this.maxValue = Math.max.apply(
        Math,
        Array.from(this.players.map((x) => x.h_in))
      );
      this.minValue = Math.min.apply(
        Math,
        Array.from(this.players.map((x) => x.h_in))
      );
    });
  }

  public keyPress(event: any) {
    this.pairs = [];
    let inputValue = this.formInputs.controls['txtHeight'].value;
    this.showNoResults = true;
    //Don't iterate for values out of the range
    if (!(inputValue >= this.minValue * 2 && inputValue <= this.maxValue * 2)) {
      return;
    }
    this.filterElements(inputValue);
  }

  private filterElements(inputValue: number) {
    for (let i = 0; i < this.players.length; i++) {
      const iElement = this.players[i];
      const ih_in = +iElement.h_in;
      for (let j = i + 1; j < this.players.length; j++) {
        const jElement = this.players[j];
        const jh_in = +jElement.h_in;
        if (ih_in + jh_in == inputValue) {
          let data = {
            playerA: iElement,
            playerB: jElement,
          };
          this.pairs.push(data);
        }
      }
    }
    if (this.pairs.length > 0) {
      this.showNoResults = false;
    }
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
}
