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

/**
 * Directive used to render a dynamic cell component
 *
 * <ng-template appSimpleCell
 *      cell="CustomCellComponent"
 *      [data]="inputBinding"
 *      (valueChanged)="handleCellChangedEvent($event)">
 * </ng-template>
 */
@Directive({
    selector: '[appSimpleCell]',
})
export class SimpleCellDirective
    implements OnInit, OnChanges, OnDestroy {
    /** Custom cell component class */
    @Input() cell!: Type<unknown>;
    /**  Input binding for the instance of custom cell component */
    @Input() data: unknown;
    /**  Output binding for the instance of custom cell component */
    @Output() valueChanged: EventEmitter<any> = new EventEmitter();

    /**
     * Stored componentRef once instance in created
     * Used to mark component for check when data is changed
     */
    componentRef?: ComponentRef<any>;

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
        // Create factory for cell component
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
            this.cell
        );

        // Clear any existing views already in template
        this.viewContainerRef.clear();

        // Create component instance using factory
        this.componentRef = this.viewContainerRef.createComponent(componentFactory);

        // Bind input data
        this.setData();

        // Clean up output subscription
        this.sub?.unsubscribe();

        // If component instance has output binding, subscribe to it and emit its output value
        if (this.componentRef.instance.valueChanged) {
            this.sub = this.componentRef.instance.valueChanged.subscribe((value: any) => {
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
