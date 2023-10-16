const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-cente">
      <div className="flex items-center justify-center rounded-full animate-spin">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#0073e6"
            strokeWidth="5"
          ></circle>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="5"
            stroke-dasharray="180 180"
            stroke-dashoffset="90"
          ></circle>
        </svg>
      </div>
      <p>
        <span className="text-[#625df5b3] font-extrabold text-1xl">Askkyy</span>{" "}
        is thinking...
      </p>
      <b>Note: This might take some time.</b>
    </div>
  );
};

export default Loading;
