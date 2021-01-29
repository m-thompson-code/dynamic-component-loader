import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BaseCellComponent, CellChangedEvent } from 'src/app/cell.directive';

export interface InputCellChangedValue {
    type: 'input' | 'saved';
    input: string;
}

@Component({
    selector: 'app-input-cell',
    templateUrl: './input-cell.component.html',
    styleUrls: ['./input-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCellComponent implements BaseCellComponent<string, InputCellChangedValue> {
    @Input() data?: string;
    @Output() valueChanged: EventEmitter<CellChangedEvent<InputCellChangedValue>> = new EventEmitter();

    show?: boolean;

    save(input: string): void {
        this.data = input;

        const changeValue: InputCellChangedValue = {
            input: input,
            type: 'saved',
        }

        this.valueChanged.emit({
            value: changeValue,
        });

        this.show = false;
    }
}
