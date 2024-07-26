import type { NetLink } from '../netTypes';

export const WeightsList = ({ links }: { links: NetLink[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Source</th>
          <th>Target</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link) => (
          <tr key={`${link.sourceId}-${link.targetId}`}>
            <td>{link.sourceId}</td>
            <td>{link.targetId}</td>
            <td>{link.value}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
