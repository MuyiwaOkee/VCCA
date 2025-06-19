import { VisaChevronRightTiny, VisaFileUploadTiny } from '@visa/nova-icons-react';
import {
  Button,
  ContentCard,
  ContentCardBody,
  ContentCardSubtitle,
  ContentCardTitle,
  Link,
  Typography,
  Utility,
} from '@visa/nova-react';

type ButtonProps = {
    text: string,
    onClickFunc?: () => void
}

type LinkProps = {
    text: string,
    href: string
}

type Props = {
    id?: string,
    headline: string,
    subtitle?: string,
    text?: string,
    primaryButton: ButtonProps,
    link?: LinkProps
}

export const DefaultContentCard = ({ id, headline, subtitle, text, primaryButton, link }: Props) => {
  return (
    <ContentCard id={id}>
      <Utility element={<ContentCardBody />} vFlex vFlexCol vGap={4}>
        <Utility vAlignItems="center" vFlex vFlexRow vJustifyContent="between">
          <ContentCardTitle variant="headline-4">{headline}</ContentCardTitle>
          <Button aria-label="Export [Headline]" buttonSize="small" colorScheme="tertiary" iconButton>
            <VisaFileUploadTiny />
          </Button>
        </Utility>
        {subtitle && <ContentCardSubtitle variant="subtitle-3">{subtitle}</ContentCardSubtitle>}
        {text && <Typography className="v-pt-4">
          {text}
        </Typography>}
        <Utility vAlignItems="center" vFlex vFlexWrap vGap={16} vPaddingTop={12}>
          <Button onClick={primaryButton.onClickFunc}>{primaryButton.text}</Button>
          {link && <Link href={link.href} noUnderline>
            {link.text} <VisaChevronRightTiny rtl />
          </Link>}
        </Utility>
      </Utility>
    </ContentCard>
  );
};