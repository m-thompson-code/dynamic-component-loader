import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BaseCellComponent, CellChangedEvent } from 'src/app/cell.directive';

export interface InputCellChangedValue {
    type: 'input' | 'saved' | 'opened';
    value: string;
}

@Component({
    selector: 'app-input-cell',
    templateUrl: './input-cell.component.html',
    styleUrls: ['./input-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCellComponent implements BaseCellComponent<string, InputCellChangedValue> {
    @Input() data?: string;
    @Output() valueChanged: EventEmitter<CellChangedEvent<InputCellChangedValue>> = new EventEmitter();

    show?: boolean;

    toggleShow(): void {
        if (!this.show) {
            this.valueChanged.emit({
                value: '',
                type: 'opened',
            });
        }

        this.show = !this.show;
    }

    save(input: string): void {
        this.data = input;

        this.valueChanged.emit({
            value: input,
            type: 'saved',
        });

        this.show = false;
    }
}
