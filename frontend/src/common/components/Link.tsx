import React, {FC, MouseEvent, ReactNode, forwardRef, createRef} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import MUILink, {LinkProps as MUILinkProps} from '@material-ui/core/Link'
import noop from 'lodash/fp/noop'
import pick from 'lodash/fp/pick'

type Props = {
  to?: string
  onClick?: (e: MouseEvent) => void
  color?: 'primary' | 'secondary'
  className?: string
  children?: ReactNode
}

const Link: FC<Props> = props => {
  const {className, children} = props
  const to = props.to || '#'
  const linkRef = createRef<HTMLAnchorElement>()

  const commonProps: MUILinkProps = {
    className,
    color: props.color || 'primary',
    onClick: props.onClick || noop,
    variant: 'body2',
  }

  if (to.startsWith('/')) {
    const ForwardedRouterLink = forwardRef<HTMLAnchorElement, MUILinkProps>((props, ref) => (
      <RouterLink innerRef={ref} to={to} {...pick(['className', 'onClick'], props)}>
        {children}
      </RouterLink>
    ))

    return (
      <MUILink {...commonProps} ref={linkRef} component={ForwardedRouterLink}>
        {children}
      </MUILink>
    )
  }

  return (
    <MUILink {...commonProps} href={to} target="_blank" rel="noopener noreferrer">
      {children || to}
    </MUILink>
  )
}

export default Link
