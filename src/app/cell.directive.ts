import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { Type } from '@angular/core';
import { Subscription } from 'rxjs';

// Universal output event for cells
export type CellChangedEvent<T = any> = T;

// Each custom cell component should implement this base class
@Component({
    // selector: 'app-base-cell',
    template: '',
})
export class BaseCellComponent<S=any, T=any> {
    /** Should be used for any and all input bindings for custom cell component */
    @Input() data?: S;
    /** Should be used for any and all output bindings for custom cell component */
    @Output() valueChanged?: EventEmitter<CellChangedEvent<T>>;
}

/**
 * Directive used to render a dynamic cell component
 *
 * <ng-template appCell
 *      cell="CustomCellComponent"
 *      [data]="inputBinding"
 *      (valueChanged)="handleCellChangedEvent($event)">
 * </ng-template>
 */
@Directive({
    selector: '[appCell]',
})
export class CellDirective<C extends BaseCellComponent>
    implements OnInit, OnChanges, OnDestroy {
    /** Custom cell component class */
    @Input() cell!: Type<C>;
    /**  Input binding for the instance of custom cell component */
    @Input() data: unknown;
    /**  Output binding for the instance of custom cell component */
    @Output() valueChanged: EventEmitter<CellChangedEvent> = new EventEmitter();

    /**
     * Stored componentRef once instance in created
     * Used to mark component for check when data is changed
     */
    componentRef?: ComponentRef<C>;

    /**
     * @deprecated TODO: find a more reactive way to handle passing the output events, this should be removed
     */
    sub?: Subscription | null;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnInit(): void {
        this.loadComponent();
    }

    // Handle change detection
    ngOnChanges(changes: SimpleChanges): void {
        const { cell: cellChanges, data: dataChanges } = changes;

        if (cellChanges && !cellChanges.isFirstChange()) {
            this.loadComponent();
            return;
        }

        if (dataChanges && !dataChanges.isFirstChange()) {
            this.setData();
        }
    }

    /**
     * Inject dynamic cell component using ViewContainerRef and setup input and output bindings
     */
    loadComponent(): void {
        // Debugging log
        console.log('~ loadComponent', this.cell.name, this.data);

        // Create factory for cell component
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory<C>(
            this.cell
        );

        // Clear any existing views already in template
        this.viewContainerRef.clear();

        // Create component instance using factory
        this.componentRef = this.viewContainerRef.createComponent<C>(componentFactory);

        // Bind input data
        this.setData();

        // Clean up output subscription
        this.sub?.unsubscribe();

        // If component instance has output binding, subscribe to it and emit its output value
        if (this.componentRef.instance.valueChanged) {
            this.sub = this.componentRef.instance.valueChanged.subscribe((value: CellChangedEvent) => {
                this.valueChanged.emit(value);
            });
        } else {
            this.sub = null;
        }
    }

    /**
     * Set input bindings and mark custom cell component instance for check
     */
    setData(): void {
        // Debugging log
        console.log('~ \tsetData', this.cell.name, this.data);

        if (!this.componentRef) {
            throw new Error("Unexpected missing componentRef");
        }

        // Set input binding
        this.componentRef.instance.data = this.data;

        // Explicitly marks the view as changed so that it can be checked again
        this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    }

    // Clean up subscriptions
    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
