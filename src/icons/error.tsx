import React from 'react'

type Props = {
    fill?: string
}

const ErrorIcon = ({ fill = '#AD2929' }: Props) => {
  return <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10_2135)">
<g opacity="0.01">
<rect width="2.66667" height="2.66667" transform="translate(32 21.3333)" fill={fill}/>
</g>
<path d="M32 0C49.6533 0 64 14.3467 64 32C64 49.6533 49.6533 64 32 64C14.3467 64 0 49.6533 0 32C5.16698e-07 14.3467 14.3467 5.16729e-07 32 0ZM32 5.33301C17.3067 5.33301 5.33301 17.3067 5.33301 32C5.33301 46.6933 17.3067 58.667 32 58.667C46.6933 58.667 58.667 46.6933 58.667 32C58.667 17.3067 46.6933 5.33301 32 5.33301Z" fill={fill}/>
<path d="M32 42.667C33.4727 42.667 34.6668 43.8604 34.667 45.333C34.667 46.8058 33.4728 48 32 48C30.5272 48 29.333 46.8058 29.333 45.333C29.3332 43.8604 30.5273 42.667 32 42.667ZM34.667 37.333H29.333V16H34.667V37.333Z" fill={fill}/>
</g>
<defs>
<clipPath id="clip0_10_2135">
<rect width="64" height="64" fill="none"/>
</clipPath>
</defs>
</svg>


}

export default ErrorIcon