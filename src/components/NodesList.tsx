import type { NetNode } from '../netTypes';

export const NodesList = ({ nodes }: { nodes: NetNode[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Layer</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((node) => (
          <tr key={node.id}>
            <td>{node.id}</td>
            <td>{node.layer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
