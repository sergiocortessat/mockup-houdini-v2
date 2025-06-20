export const isWidgetMode = (() => {
  return (
    typeof window !== 'undefined' &&
    (window.location.search.includes('widgetMode=true') ||
      window.location.search.includes('widgetMode=1'))
  );
})();
