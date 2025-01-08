import { routes } from "../router";

const Home = () => {
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

export default Home;
