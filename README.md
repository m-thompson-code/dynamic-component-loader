# dynamic-component-loader

Showcases how to dynamicly generate components using a custom directive [demo](https://m-thompson-code.github.io/dynamic-component-loader/)

[Angular walkthrough on dyamic components](https://angular.io/guide/dynamic-component-loader)

[download to their walkthrough source code](https://angular.io/generated/zips/dynamic-component-loader/dynamic-component-loader.zip)

### Showcase

This simple applicaton showcases dynamically adding / removing custom cells on the fly. You can also update the data for each cell or change the cell to a different component on the fly. There are 3 custom cell components.

1. PercentCellComponent
2. CurrencyCellComponent
3. InputCellComponent

### General

#### Base Cell Component

There are 3 custom cell components. Each implement the base class `BaseCellComponent`

#### Input binding

All 3 custom cell components showcase input binding.

The custom cells allow for one input binding `@Input() data?: unknown`.

The directive will assume type `unknown`, but you can type the custom cell components' data property.

#### Change Detection OnPush

Each of the custom cell components in this showcase use OnPush. The cell directive manages change detection and marks components for change as needed, but you don't need to use OnPush if you don't want to.

#### Output binding

The InputCellComponent showcases binding output events. The directive subscribes to the custom cell component and emits the same value `@Output() dataEmitted: EventEmitter<CellEvent>`.

### scripts

`npm install` - install

`npm start` - local development server

`npm run build` - aot/prod build

`npm run serve` - local prod server (you need to build first)
