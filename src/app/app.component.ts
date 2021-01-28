import { Component, OnInit } from '@angular/core';
import { BaseCellComponent, CellEvent } from './cell.directive';
import { CurrencyCellComponent } from './components/currency-cell/currency-cell.component';
import { InputCellComponent } from './components/input-cell/input-cell.component';
import { PercentCellComponent } from './components/percent-cell/percent-cell.component';

export interface Cell {
    component: typeof BaseCellComponent;
    data: unknown;
}

interface Row {
    cells: [];
}

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    event?: CellEvent<'input' | 'saved', string>;

    cells: Cell[] = [];

    cols: Cell[];

    constructor() {}

    ngOnInit() {
        this.addCell('currency');
        this.addCell('percent');
        this.addCell('currency');
        this.addCell('percent');
        this.addCell('input');
    }

    addCell(type: 'currency' | 'percent' | 'input'): void {
        if (type === 'currency') {
            this.cells.push(this.getCurrencyCell());
        } else if (type === 'percent') {
            this.cells.push(this.getPercentCell());
        } else {
            this.cells.push(this.getInputCell());
        }
    }

    popCell(): void {
        this.cells.pop();
    }

    shuffleCells(): void {
        // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = this.cells.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.cells[currentIndex];
            this.cells[currentIndex] = this.cells[randomIndex];
            this.cells[randomIndex] = temporaryValue;
        }
    }

    getCurrencyCell(): Cell {
        return {
            component: CurrencyCellComponent,
            data: 100 * Math.random(),
        };
    }

    getPercentCell(): Cell {
        return {
            component: PercentCellComponent,
            data: 100 * Math.random() / 100,
        };
    }

    getInputCell(): Cell {
        return {
            component: InputCellComponent,
            data: 'some default ' + Math.floor(Math.random() * 100), 
        };
    }

    randomizeComponents(): void {
        for (let i = 0; i < this.cells.length; i++) {
            const seed = Math.floor(Math.random() * 3);

            if (seed === 2) {
                this.cells[i] = this.getCurrencyCell();
            } else if(seed === 1) {
                this.cells[i] = this.getPercentCell();
            } else {
                this.cells[i] = this.getInputCell();
            }
        }
    }
    
    randomizeDatas(): void {
        for (const cell of this.cells) {
            if (cell.component === CurrencyCellComponent) {
                cell.data = 100 * Math.random();
            } else if (cell.component === PercentCellComponent) {
                cell.data = 100 * Math.random() / 100;
            } else {
                cell.data = 'some default ' + Math.floor(Math.random() * 100);
            }
        }
    }

    handleValueEmitted(event: CellEvent<'input' | 'saved', string>) {
        console.log(event);
        this.event = event;
    }
}
