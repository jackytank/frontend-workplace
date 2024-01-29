import React from 'react';

export function useTimeTableDimension() {
  const margin = { top: 50, right: 60, bottom: 40, left: 40 };
  const [dimension, setDimension] = React.useState({
    width: window.innerWidth - margin.left - margin.right - 150,
    height: window.innerHeight - margin.top - margin.bottom,
    margin
  });

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setDimension({
        width: window.innerWidth - margin.left - margin.right - 150,
        height: window.innerHeight - margin.top - margin.bottom,
        margin
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return dimension;
}
