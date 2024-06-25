import { routes } from "../router";

const DragContainerDemo = () => {
  return (
    <ul>
      {routes.map(({ path }) => (
        <li key={path}>
          <a href={path}>{path}</a>
        </li>
      ))}
    </ul>
  );
};

export default DragContainerDemo;
