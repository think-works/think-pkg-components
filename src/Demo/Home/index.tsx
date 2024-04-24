import { routes } from "../router";

const DragContainerDemo = () => {
  return (
    <ul>
      {routes.map(({ path }) => (
        <li>
          <a href={path}>{path}</a>
        </li>
      ))}
    </ul>
  );
};

export default DragContainerDemo;
