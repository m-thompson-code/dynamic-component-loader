import { Component, OnInit, Type } from '@angular/core';
import { BaseCellComponent, CellChangedEvent } from './cell.directive';
import { CurrencyCellComponent } from './components/currency-cell/currency-cell.component';
import { InputCellChangedValue, InputCellComponent } from './components/input-cell/input-cell.component';
import { PercentCellComponent } from './components/percent-cell/percent-cell.component';

export interface CellComponent {
    cell: Type<BaseCellComponent>;
    data: unknown;
}

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    event?: CellChangedEvent<InputCellChangedValue>;

    cellComponents: CellComponent[] = [];

    cols: CellComponent[] = [];

    ngOnInit() {
        this.addCell('currency');
        this.addCell('percent');
        this.addCell('currency');
        this.addCell('percent');
        this.addCell('input');
    }

    addCell(type: 'currency' | 'percent' | 'input'): void {
        if (type === 'currency') {
            this.cellComponents.push(this.getCurrencyCell());
        } else if (type === 'percent') {
            this.cellComponents.push(this.getPercentCell());
        } else {
            this.cellComponents.push(this.getInputCell());
        }
    }

    addRandomCells(count: number): void {
        for (let i = 0; i < count; i++) {
            this.cellComponents.push(this.getRandomCell());
        }
    }

    popCell(): void {
        this.cellComponents.pop();
    }

    shuffleCells(): void {
        // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = this.cellComponents.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.cellComponents[currentIndex];
            this.cellComponents[currentIndex] = this.cellComponents[randomIndex];
            this.cellComponents[randomIndex] = temporaryValue;
        }
    }

    getCurrencyCell(): CellComponent {
        return {
            cell: CurrencyCellComponent,
            data: 100 * Math.random(),
        };
    }

    getPercentCell(): CellComponent {
        return {
            cell: PercentCellComponent,
            data: 100 * Math.random() / 100,
        };
    }

    getInputCell(): CellComponent {
        return {
            cell: InputCellComponent,
            data: 'some default ' + Math.floor(Math.random() * 100), 
        };
    }

    getRandomCell(): CellComponent {
        const seed = Math.floor(Math.random() * 3);

        if (seed === 2) {
            return this.getCurrencyCell();
        } else if(seed === 1) {
            return this.getPercentCell();
        }

        return this.getInputCell();
    }

    randomizeComponents(): void {
        for (let i = 0; i < this.cellComponents.length; i++) {
            this.cellComponents[i] = this.getRandomCell();
        }
    }
    
    randomizeDatas(): void {
        for (const cellComponent of this.cellComponents) {
            if (cellComponent.cell === CurrencyCellComponent) {
                cellComponent.data = 100 * Math.random();
            } else if (cellComponent.cell === PercentCellComponent) {
                cellComponent.data = 100 * Math.random() / 100;
            } else {
                cellComponent.data = 'some default ' + Math.floor(Math.random() * 100);
            }
        }
    }

    handleCellChangedEvent(event: CellChangedEvent<InputCellChangedValue>): void {
        console.log(event);
        this.event = event;
    }
}
