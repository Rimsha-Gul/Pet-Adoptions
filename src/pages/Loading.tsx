import loadingIcon from "../assets/loading.gif";

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center mb-8">
      <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
    </div>
  );
};

export default Loading;
