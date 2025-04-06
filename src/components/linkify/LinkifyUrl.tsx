import { LinkItUrl } from "react-linkify-it";
import { ILinkifyProps } from "./Linkify";

const LinkifyUrl = ({ children }: ILinkifyProps) => {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
};

export default LinkifyUrl;
