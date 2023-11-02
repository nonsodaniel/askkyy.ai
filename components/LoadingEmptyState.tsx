import React from "react";
import Loading from "./ui/Loading";
import { Empty } from "./ui/Empty";
interface ILoadingEmptyState {
  isLoading: boolean;
  isPageDataLoading: boolean;
  messages: any[];
}
const LoadingEmptyState = ({
  isLoading,
  isPageDataLoading,
  messages,
}: ILoadingEmptyState) => {
  return (
    <div>
      {isLoading && (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
          <Loading displayText />
        </div>
      )}
      {!isPageDataLoading && messages.length === 0 && !isLoading && (
        <Empty label="No conversation started." />
      )}
      {isPageDataLoading && !messages.length && (
        <div className="py-24 text-red-600">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default LoadingEmptyState;
