import {
  Button,
  ContentCard,
  ContentCardBody,
  ContentCardTitle,
  Link,
  Typography,
  Utility,
} from "@visa/nova-react";

export default function Home() {
 return  <ContentCard borderBlockEnd>
      <Utility element={<ContentCardBody />} vFlex vFlexCol vGap={4}>
        <ContentCardTitle variant="headline-4">Muyiwa</ContentCardTitle>
        <Typography className="v-pt-4">
          Our favorite commmunity member
        </Typography>
        <Utility
          vAlignItems="center"
          vFlex
          vFlexWrap
          vGap={16}
          vPaddingTop={12}
        >
          <Button>Primary action</Button>
          <Link href="./content-card" noUnderline>
            Destination label
          </Link>
        </Utility>
      </Utility>
    </ContentCard>
}
