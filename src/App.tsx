import { NetworkChart } from './components/NetworkChart';
import data from './assets/net.json';
import { NodesList } from './components/NodesList';
import { WeightsList } from './components/WeightsList';
import { NetImporter } from './components/NetImporter';
import { NetExporter } from './components/NetExporter';
import { useState } from 'react';
import type { NetData } from './netTypes';

export const App = () => {
  const [neuralNet] = useState<NetData>(data);

  return (
    <>
      <div>
        <h1>Chart AI</h1>
        <NetImporter />
        <NetExporter currentNet={neuralNet} />
      </div>
      <NetworkChart data={neuralNet} />
      <NodesList nodes={neuralNet.nodes} />
      <WeightsList links={neuralNet.links} />
    </>
  );
};
