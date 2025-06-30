import { VisaChevronRightTiny } from '@visa/nova-icons-react';
import {
  ContentCard,
  ContentCardBody,
  ContentCardSubtitle,
  ContentCardTitle,
  Typography,
  Utility,
} from '@visa/nova-react';
import Link from 'next/link';

type Props = {
    headline: string,
    subtitle?: string,
    text?: string,
    href: string
}

export const ClickableContentCard = ({ headline, subtitle, text, href }: Props) => {
  return (
    <Link href={href} className='w-full'>
      <ContentCard clickable tag="button" className='w-full' >
      <Utility element={<ContentCardBody tag="span" />} vAlignItems="start" vFlex vFlexCol vGap={4}>
        <ContentCardTitle variant="headline-4" tag="span">
          {headline}
          <VisaChevronRightTiny rtl className="v-icon-move" />
        </ContentCardTitle>
        {subtitle && <ContentCardSubtitle variant="subtitle-3" tag="span">
          {subtitle}
        </ContentCardSubtitle>}
        {text && <Utility element={<Typography tag="span" />} vPaddingTop={4}>
          {text}
        </Utility>}
      </Utility>
    </ContentCard>
    </Link>
  );
};