export const TreeFolderIcon = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "sub", ...style }}
    >
      <path
        d="m2 5c0-1.10457.89543-2 2-2h7.3957c.9374 0 1.749.65106 1.9523 1.56614l3.1111 13.99996c.2776 1.2491-.6728 2.4339-1.9523 2.4339h-10.5068c-1.10457 0-2-.8954-2-2z"
        fill="#faba44"
      />
      <rect fill="#ffcc70" height="15" rx="2" width="20" x="2" y="6" />
      <path
        clipRule="evenodd"
        d="m14 17.75c0-.4142.3358-.75.75-.75h4c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-4c-.4142 0-.75-.3358-.75-.75z"
        fill="#faba44"
        fillRule="evenodd"
      />
    </svg>
  );
};
