import { LinkIt } from "react-linkify-it";
import { ILinkifyProps } from "./Linkify";
import UserLinkWithTooltip from "../user/UserLinkWithTooltip";

const LinkifyUsername = ({ children }: ILinkifyProps) => {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithTooltip username={username} key={key}>
            {match}
          </UserLinkWithTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
};

export default LinkifyUsername;
