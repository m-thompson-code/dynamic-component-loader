import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BaseCellComponent, CellChangedEvent } from 'src/app/cell.directive';

export enum InputCellEventType {
    INPUT = "INPUT", 
    SAVED = "SAVED",
    EDIT = "EDIT"
}

export interface InputCellChangedValue {
    type: InputCellEventType;
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

    readonly InputCellEventType = InputCellEventType;

    toggleShow(): void {
        if (!this.show) {
            this.valueChanged.emit({
                value: '',
                type: InputCellEventType.EDIT,
            });
        }

        this.show = !this.show;
    }

    save(input: string): void {
        this.data = input;

        this.valueChanged.emit({
            value: input,
            type: InputCellEventType.SAVED,
        });

        this.show = false;
    }
}
