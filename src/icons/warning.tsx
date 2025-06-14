import React from 'react'

type Props = {
    fill?: string
}

const WarningIcon = ({ fill = '#C38004' }: Props) => {
  return <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.01">
<rect width="2.66667" height="2.66667" transform="translate(32 21.3333)" fill={fill}/>
</g>
<path d="M64 55.0938V61.333H0V55.04L30.4268 0H36.5869L64 55.0938ZM5.54688 56H58.4805L33.4131 5.59961L5.54688 56Z" fill={fill}/>
<path d="M36 45.3389V50.6719H30.667V45.3389H36ZM36 21.3389V40.0049H30.667V21.3389H36Z" fill={fill}/>
</svg>


}

export default WarningIcon