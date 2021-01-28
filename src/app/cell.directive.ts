import { ChangeDetectorRef, Component, ComponentFactoryResolver, 
    ComponentRef, Directive, EventEmitter, Input, OnChanges, OnDestroy, 
    OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Type } from '@angular/core';
import { Subscription } from 'rxjs';

// Universal output event for cells
export interface CellEvent<T=string, V=unknown> {
    type: T;
    value: V;
}

// Each custom cell component should implement this base class
@Component({
    selector: 'app-base-cell',
    template: '',
})
export class BaseCellComponent {
    // Should be used for any and all input bindings for custom cell component
    @Input() data?: unknown;
    // Should be used for any and all output bindings for custom cell component
    @Output() valueEmitted?: EventEmitter<CellEvent>;
}

/**
 * Injects a dynamic cell component
 * 
 * <ng-template appCell 
 *      component="CellComponent" 
 *      [data]="inputBinding" 
 *      (valueEmitted)="handleValueEmitted($event)">
 * </ng-template>
 */
@Directive({
    selector: '[appCell]',
})
export class CellDirective<T extends BaseCellComponent> implements OnInit, OnChanges, OnDestroy {
    // Component Class Type
    @Input() component!: Type<T>;
    // Input binding for the instance of Component
    @Input() data: unknown;
    // Output binding for the instance of Component
    @Output() valueEmitted: EventEmitter<CellEvent> = new EventEmitter();

    // Stored componentRef once instance in created
    // Used to mark component for check when data is changed
    componentRef?: ComponentRef<T>;

    // TODO: find a more reactive way to handle passing the output events
    sub?: Subscription | null;

    constructor(public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.loadComponent();
    }

    // Handle change detection
    ngOnChanges(changes: SimpleChanges): void {
        const componentChange = changes['component'];
        if (componentChange && !componentChange.isFirstChange()) {
            this.loadComponent();
            return;
        }

        const dataChange = changes['data'];
        if (dataChange && !dataChange.isFirstChange()) {
            this.setData();
        }
    }

    loadComponent() {
        // Debugging log
        console.log("~ loadComponent", this.component.name, this.data);

        // Create factory for component
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);

        // Clear any existing views already in template
        this.viewContainerRef.clear();

        // Create component instance using factory
        this.componentRef = this.viewContainerRef.createComponent(componentFactory);

        // Bind input data
        this.setData();

        // Clean up output subscription
        this.sub?.unsubscribe();

        // If component instance has output binding, subscribe to it and emit its output value
        if (this.componentRef.instance.valueEmitted) {
            this.sub = this.componentRef.instance.valueEmitted.subscribe(value => {
                this.valueEmitted.emit(value);
            });
        } else {
            this.sub = null;
        }
    }

    setData() {
        // Debugging log
        console.log("~ \tsetData", this.component.name, this.data);

        if (!this.componentRef) {
            return;
        }

        // Set input binding
        this.componentRef.instance.data = this.data;

        // Explicitly marks the view as changed so that it can be checked again
        this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    }

    // Clean up subscriptions
    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
}
