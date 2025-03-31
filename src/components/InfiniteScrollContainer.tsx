import { PropsWithChildren } from "react";
import { useInView } from "react-intersection-observer";

interface IInfiniteScrollContainerProps extends PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

const InfiniteScrollContainer = ({
  onBottomReached,
  className,
  children,
}: IInfiniteScrollContainerProps) => {
  const { ref } = useInView({
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;
