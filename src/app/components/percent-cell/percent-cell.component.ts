import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BaseCellComponent } from 'src/app/cell.directive';

@Component({
    selector: 'app-percent-cell',
    templateUrl: './percent-cell.component.html',
    styleUrls: ['./percent-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentCellComponent implements BaseCellComponent {
    @Input() data: number;
}
