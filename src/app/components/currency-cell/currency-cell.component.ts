import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BaseCellComponent } from 'src/app/cell.directive';

@Component({
    selector: 'app-currency-cell',
    templateUrl: './currency-cell.component.html',
    styleUrls: ['./currency-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyCellComponent implements BaseCellComponent {
    @Input() data?: number;
}
