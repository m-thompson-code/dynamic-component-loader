import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CellDirective } from './cell.directive';
import { CurrencyCellComponent } from './components/currency-cell/currency-cell.component';
import { PercentCellComponent } from './components/percent-cell/percent-cell.component';
import { InputCellComponent } from './components/input-cell/input-cell.component';

@NgModule({
    imports: [ BrowserModule ],
    providers: [],
    declarations: [
        AppComponent,
        CellDirective,
        CurrencyCellComponent,
        PercentCellComponent,
        InputCellComponent,
    ],
    entryComponents: [  ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor() {}
}
