export interface ParseItemStateData {
    hasTouched: boolean;
    error: string;
  }
  
  export interface StateItem {
    prefix: string;
    zone: string;
    errors: {
      prefixError: ParseItemStateData;
      zoneError: ParseItemStateData;
    };
  }
  
  export interface ParseItemState {
    prefix: ParseItemStateData;
    zone: ParseItemStateData;
  }

  export interface storageItemState{
    prefix: string;
    zone: string;
  }
  
  export interface ParseStateArray extends Array<ParseItemState> {}
  
  export interface StateArray extends Array<StateItem> {}

  export interface storageItemStateArray extends Array<storageItemState> {}
  