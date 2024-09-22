import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

type LinkRef = HTMLAnchorElement;
type NextLinkComposedProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  NextLinkProps & {
    href: NextLinkProps['href'];
    linkAs?: NextLinkProps['as'];
  };

const NextLinkComposed = React.forwardRef<LinkRef, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const { href, linkAs, replace, scroll, shallow, prefetch, locale, ...other } = props;

    return (
      <NextLink
        href={href}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        legacyBehavior
      >
        <a ref={ref} {...other} />
      </NextLink>
    );
  },
);

export default NextLinkComposed;