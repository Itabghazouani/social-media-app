import { ReactNode } from "react";
import LinkifyUrl from "./LinkifyUrl";
import LinkifyUsername from "./LinkifyUsername";
import LinkifyHashtag from "./LinkifyHashtag";

export interface ILinkifyProps {
  children: ReactNode;
}

const Linkify = ({ children }: ILinkifyProps) => {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
};

export default Linkify;
