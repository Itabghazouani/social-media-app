import { LinkIt } from "react-linkify-it";
import Link from "next/link";
import { ILinkifyProps } from "./Linkify";

const LinkifyHashtag = ({ children }: ILinkifyProps) => {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <Link
            key={key}
            href={`/hashtag/${username}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
};

export default LinkifyHashtag;
