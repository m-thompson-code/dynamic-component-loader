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
    Type
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
 * <ng-template
 *      [cell]="CustomCellComponent"
 *      [data]="inputBinding"
 *      (valueChanged)="handleCellChangedEvent($event)">
 * </ng-template>
 */
@Directive({
    selector: '[cell]',
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

    // Used clean up valueChanged subscriptions
    private readonly unsubscribe$ = new Subject<void>();

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnInit(): void {
        this.loadComponent();
    }

    /**
     * Inject dynamic cell component using ViewContainerRef and setup input and output bindings
     */
    loadComponent(): void {
        // Create factory for cell component
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory<C>(
            this.cell
        );

        // Clear any existing views already in template
        this.viewContainerRef.clear();

        // Create component instance using factory
        this.componentRef = this.viewContainerRef.createComponent<C>(componentFactory);

        // Handle Input bindings
        this.setData();

        // Handle Output bindings
        this.setValueChanged();
    }

    /**
     * Handle change detection
     */
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
     * Set input bindings and mark custom cell component instance for check
     */
    setData(): void {
        // Debugging log
        // console.log('~ \tsetData', this.cell.name, this.data);

        if (!this.componentRef) {
            throw new Error("Unexpected missing componentRef");
        }

        // Set input binding
        this.componentRef.instance.data = this.data;

        // Explicitly marks the view as changed so that it can be checked again
        this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    }

    /**
     * Update valueChanged emitter. Cleans up previous subscription if it exists
     */
    setValueChanged(): void {
        // Clean up output subscription
        this.unsubscribe$.next();

        if (!this.componentRef) {
            throw new Error("Unexpected missing componentRef");
        }

        // If component instance has output binding, subscribe to it and emit its output value
        this.componentRef.instance.valueChanged?.pipe(takeUntil(this.unsubscribe$)).subscribe((value: CellChangedEvent) => {
            this.valueChanged.emit(value);
        });
    }

    /**
     * Clean up subscriptions and dynamic component instance
     */
    ngOnDestroy(): void {
        this.componentRef?.destroy();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
