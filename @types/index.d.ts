export {};

declare global {
  interface Window {
    ApexCharts: any;
    $: any;
    mobileCheck: Function;
    opera: any;
  }
}
