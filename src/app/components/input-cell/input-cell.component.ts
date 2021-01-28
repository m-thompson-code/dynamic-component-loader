import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BaseCellComponent, CellEvent } from 'src/app/cell.directive';

@Component({
    selector: 'app-input-cell',
    templateUrl: './input-cell.component.html',
    styleUrls: ['./input-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCellComponent implements BaseCellComponent {
    @Input() data: string;
    @Output() valueEmitted: EventEmitter<CellEvent<'input' | 'saved', string>> = new EventEmitter();

    show?: boolean;

    save(value: string) {
        this.data = value;

        this.valueEmitted.emit({type: 'saved', value: this.data });

        this.show = false;
    }
}
