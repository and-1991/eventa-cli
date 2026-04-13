export type ComponentWrapper = {
  name: string;
  prop: string;
};

export type FunctionWrapper = {
  name: string;
  event?: string;
};

export type EventraConfig = {
  apiKey?: string;
  events: string[];
  wrappers: ComponentWrapper[];
  functionWrappers: FunctionWrapper[];
  sync: {
    include: string[];
    exclude: string[];
  };
};
