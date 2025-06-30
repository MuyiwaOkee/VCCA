import React from 'react'
import { Footer, Link, Utility, VisaLogo } from '@visa/nova-react';

const DefaultFooter = () => {
  return (
    <Footer className="w-full absolute bottom-0">
      <Utility vFlex vMarginRight={1}>
        <VisaLogo aria-label="Visa" />
      </Utility>
      <Utility vFlex vFlexWrap vFlexGrow vJustifyContent="between" vGap={42}>
        {`Copyright © ${new Date().getFullYear()} Visa Inc. All Rights Reserved`}
        <Utility tag="ul" vFlex vFlexWrap vGap={16}>
          <li>
            <Link href="/footer">Contact us</Link>
          </li>
          <li>
            <Link href="/footer">Privacy</Link>
          </li>
          <li>
            <Link href="/footer">Legal/terms and conditions</Link>
          </li>
        </Utility>
      </Utility>
    </Footer>
  )
}

export default DefaultFooter