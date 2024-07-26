import type { NetData } from '../netTypes';

export const NetExporter = ({ currentNet }: { currentNet: NetData }) => {
  const handleExport = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(currentNet, undefined, 2))
    );
    element.setAttribute('download', 'net.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  return <button onClick={handleExport}>Export</button>;
};
