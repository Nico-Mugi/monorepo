import { MessageLike, ParaglideMessage } from "@inlang/paraglide-js-react";

export function BoldMessage({
  message,
}: {
  message: MessageLike<
    {},
    {},
    {
      b: {
        children: true;
        options: {};
        attributes: {};
      };
    }
  >;
}) {
  return (
    <ParaglideMessage
      message={message}
      inputs={{}}
      markup={{
        b: ({ children }) => <b>{children}</b>,
      }}
    />
  );
}
