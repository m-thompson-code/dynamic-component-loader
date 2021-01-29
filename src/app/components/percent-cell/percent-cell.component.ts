import { PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseCellComponent } from 'src/app/cell.directive';

@Component({
    selector: 'app-percent-cell',
    templateUrl: './percent-cell.component.html',
    styleUrls: ['./percent-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentCellComponent extends BaseCellComponent<number> {
    @Input() data?: number;

    // This constructor has more arguments than BaseCellComponent and that's okay :)
    constructor(public percentPipe: PercentPipe) {
        super();
    }
}
