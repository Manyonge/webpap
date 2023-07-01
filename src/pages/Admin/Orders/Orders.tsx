import * as Tabs from "@radix-ui/react-tabs";

export const Orders = () => {
  return (
    <Tabs.Root className="TabsRoot" defaultValue="tab1">
      <Tabs.List className="TabsList">
        <Tabs.Trigger className="TabsTrigger" value="tab1">
          All
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab2">
          New
        </Tabs.Trigger>
        ```
        <Tabs.Trigger className="TabsTrigger" value="tab3">
          Fulfilled
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};
