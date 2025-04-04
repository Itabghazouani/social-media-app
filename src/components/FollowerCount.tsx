"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { IFollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface IFollowerCountProps {
  userId: string;
  initialState: IFollowerInfo;
}

const FollowerCount = ({ initialState, userId }: IFollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCount;
