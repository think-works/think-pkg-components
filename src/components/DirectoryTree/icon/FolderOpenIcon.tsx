export const TreeFolderOpenIcon = ({
  style,
}: {
  style?: React.CSSProperties;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "sub", ...style }}
    >
      <path
        clipRule="evenodd"
        d="m4 3c-1.10457 0-2 .89543-2 2v3 11c0 1.1046.89543 2 2 2h10.5068 5.4932c1.1046 0 2-.8954 2-2v-11c0-1.10457-.8954-2-2-2h-6.3333l-.3187-1.43386c-.2033-.91508-1.0149-1.56614-1.9523-1.56614z"
        fill="#faba44"
        fillRule="evenodd"
      />
      <path
        d="m4 9c0-1.10457.89543-2 2-2h13c1.1046 0 2 .89543 2 2v10h-17z"
        fill="#fff"
      />
      <path
        d="m3.70141 11.6422c.17291-.9509 1.00117-1.6422 1.96774-1.6422h15.93445c1.2478 0 2.1909 1.1301 1.9677 2.3578l-1.2727 7c-.1729.951-1.0012 1.6422-1.9678 1.6422h-15.93437c-1.24781 0-2.19096-1.1301-1.96774-2.3578z"
        fill="#ffcc70"
      />
      <path
        clipRule="evenodd"
        d="m14 17.75c0-.4142.3358-.75.75-.75h4c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-4c-.4142 0-.75-.3358-.75-.75z"
        fill="#faba44"
        fillRule="evenodd"
      />
    </svg>
  );
};
