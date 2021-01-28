import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';

import { Type } from '@angular/core';
import { Subscription } from 'rxjs';

export interface CellEvent {
    type: string;
    data: any;
}

@Component({
    selector: 'app-base-cell',
    template: '',
})
export class BaseCellComponent {
    @Input() data?: any;
    @Output() dataEmitted?: EventEmitter<CellEvent>;// = new EventEmitter();
}

@Directive({
    selector: '[appCell]',
})
export class CellDirective<T extends BaseCellComponent> implements OnInit, OnChanges, OnDestroy {
    @Input() component: Type<T>;
    @Input() data: any;
    @Output() dataEmitted: EventEmitter<CellEvent> = new EventEmitter();

    componentRef?: ComponentRef<T>;

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
        console.log("loadComponent", this.component.name, this.data);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);

        this.viewContainerRef.clear();

        this.componentRef = this.viewContainerRef.createComponent(componentFactory);

        this.setData();

        this.sub?.unsubscribe();

        if (this.componentRef.instance.dataEmitted) {
            this.sub = this.componentRef.instance.dataEmitted.subscribe(value => {
                this.dataEmitted.emit(value);
            });
        } else {
            this.sub = null;
        }
    }

    setData() {
        console.log("setData", this.component.name, this.data);
        if (!this.componentRef) {
            return;
        }

        this.componentRef.instance.data = this.data;

        // Explicitly marks the view as changed so that it can be checked again
        this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
}
